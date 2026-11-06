import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

/**
 * Playwright 1.56.1's Chromium adapter enables focus emulation on every page:
 * https://github.com/microsoft/playwright/blob/v1.56.1/packages/playwright-core/src/server/chromium/crPage.ts
 * The isolated, integrity-checked adapter disables its original-session override
 * only when DTC_NATIVE_TAB_FOCUS=yes. A separate CDP session cannot release it.
 * This helper proves actual browser visibility and only observes browser events;
 * it never dispatches events or replaces document visibility/focus properties.
 */
export async function createNativeTabReturn(page, sibling, { timeout = 10_000 } = {}) {
  assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Native tab observation is restricted to the disposable browser lab')
  assert.equal(process.env.DTC_NATIVE_TAB_FOCUS, 'yes', 'Native tab observation requires the isolated adapter opt-in')
  assert.ok(process.env.DISPLAY, 'Native tab observation requires a headed Chromium display (xvfb-run in CI)')
  assert.notEqual(page, sibling, 'Two distinct tabs are required')
  assert.equal(page.context(), sibling.context(), 'Observe two tabs of the same browser context')
  assert.equal(page.context().browser()?.browserType().name(), 'chromium')
  assert.ok(Number.isInteger(timeout) && timeout >= 1_000 && timeout <= 30_000)
  for (const tab of [page, sibling]) {
    const url = new URL(tab.url())
    assert.ok(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname),
      'Native tab observation uses only the local synthetic application')
  }

  const key = `__dtcNativeTabReturn_${randomUUID().replaceAll('-', '')}`
  const controlled = []
  let away = null, disposed = false

  async function state(tab) {
    return tab.evaluate(() => ({ visibility: document.visibilityState, focused: document.hasFocus() }))
  }
  async function states() {
    const [main, other] = await Promise.all([state(page), state(sibling)])
    return { page: main, sibling: other }
  }
  async function events() {
    return page.evaluate(key => window[key]?.events || [], key)
  }
  async function waitForState(tab, visibility, focused) {
    // Hidden tabs do not guarantee requestAnimationFrame callbacks.
    await tab.waitForFunction(({ visibility, focused }) => document.visibilityState === visibility
      && document.hasFocus() === focused, { visibility, focused }, { timeout, polling: 50 })
  }
  async function verifyPair(mainVisible, stage) {
    try {
      await Promise.all([
        waitForState(page, mainVisible ? 'visible' : 'hidden', mainVisible),
        waitForState(sibling, mainVisible ? 'hidden' : 'visible', !mainVisible),
      ])
    } catch {
      throw new Error(`Native tab ${stage} was not observed: ${JSON.stringify(await states())}`)
    }
  }
  async function dispose() {
    if (disposed) return
    disposed = true
    const failures = []
    for (const tab of controlled) {
      if (!tab.isClosed()) {
        try {
          await tab.evaluate(key => { window[key]?.dispose(); delete window[key] }, key)
        } catch (error) { failures.push(error) }
      }
    }
    if (failures.length) throw new Error('Native tab observation cleanup failed')
  }

  try {
    for (const tab of [page, sibling]) {
      controlled.push(tab)
      await tab.evaluate(key => {
        const observed = []
        const record = event => {
          if (observed.length >= 40) return
          observed.push({ type: event.type, isTrusted: event.isTrusted,
            visibility: document.visibilityState, focused: document.hasFocus() })
        }
        window.addEventListener('focus', record)
        window.addEventListener('blur', record)
        document.addEventListener('visibilitychange', record)
        window[key] = { events: observed, dispose() {
          window.removeEventListener('focus', record)
          window.removeEventListener('blur', record)
          document.removeEventListener('visibilitychange', record)
        } }
      }, key)
    }
  } catch (error) { await dispose().catch(() => {}); throw error }

  return {
    async leave() {
      assert.equal(disposed, false)
      assert.equal(away, null, 'Observe exactly one leave/return cycle')
      await page.bringToFront()
      await verifyPair(true, 'initial foreground')
      // Discard setup observations; subsequent records are native tab changes.
      await page.evaluate(key => { window[key].events.length = 0 }, key)
      await sibling.bringToFront()
      await verifyPair(false, 'departure')
      await page.waitForFunction(key => window[key]?.events.some(event => event.type === 'visibilitychange'
        && event.isTrusted && event.visibility === 'hidden'), key, { timeout, polling: 50 })
      away = await states()
      return away
    },
    async returnToPage() {
      assert.equal(disposed, false)
      assert.ok(away, 'The original page must first be observed hidden')
      await page.bringToFront()
      await verifyPair(true, 'return')
      await page.waitForFunction(key => {
        const observed = window[key]?.events || []
        const hidden = observed.findIndex(event => event.type === 'visibilitychange' && event.isTrusted && event.visibility === 'hidden')
        return hidden >= 0
          && observed.some((event, index) => index > hidden && event.type === 'visibilitychange' && event.isTrusted && event.visibility === 'visible')
          && observed.some((event, index) => index > hidden && event.type === 'focus' && event.isTrusted && event.focused)
      }, key, { timeout, polling: 50 })
      return { mechanism: 'headed_chromium_native_tab_activation', focusEmulation: 'disabled_in_pinned_adapter',
        away, returned: await states(), events: await events() }
    },
    dispose,
  }
}
