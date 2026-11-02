/**
 * Capture an actual UI request as plain data while its response is live.
 * Navigation reads only accept requests started after the new main document
 * commits. An in-flight refresh from the previous document cannot satisfy them.
 * No request is fulfilled, repeated or replaced by this observer.
 */
export function captureUiJsonResponse(page, matches, { afterNavigation = false, timeout = 30000 } = {}) {
  const eligible = new Set()
  let documentReady = !afterNavigation, reading = false, settled = false, timer
  let onNavigation, onRequest, onResponse, onClose
  const cleanup = () => {
    clearTimeout(timer)
    page.off('framenavigated', onNavigation)
    page.off('request', onRequest)
    page.off('response', onResponse)
    page.off('close', onClose)
    eligible.clear()
  }
  const result = new Promise((resolve, reject) => {
    const finish = (error, value) => {
      if (settled) return
      settled = true
      cleanup()
      if (error) reject(error)
      else resolve(value)
    }
    onNavigation = frame => {
      if (frame !== page.mainFrame() || reading) return
      documentReady = true
      eligible.clear()
    }
    onRequest = request => {
      if (settled || reading || !documentReady) return
      if (request.frame() === page.mainFrame() && matches(request)) eligible.add(request)
    }
    onResponse = response => {
      const request = response.request()
      if (settled || reading || !eligible.has(request)) return
      reading = true
      // Start reading now, not after click/goto/reload or a later navigation.
      const snapshot = {
        status: response.status(), url: response.url(), method: request.method(),
        cache: response.headers()['cache-control'] || null,
        requestBody: request.postDataJSON(),
      }
      response.json().then(body => finish(null, { ...snapshot, body }), error => {
        finish(new Error(`UI JSON ${request.method()} ${new URL(request.url()).pathname}: ${error.message}`))
      })
    }
    onClose = () => finish(new Error('The page closed before its UI JSON response was captured'))
    page.on('framenavigated', onNavigation)
    page.on('request', onRequest)
    page.on('response', onResponse)
    page.on('close', onClose)
    timer = setTimeout(() => finish(new Error(reading
      ? 'The UI response body was not readable before timeout'
      : afterNavigation ? 'The new document did not produce the expected UI JSON request'
        : 'The UI did not produce the expected JSON request')), timeout)
  })
  // A click/navigation is awaited by the caller concurrently. Keep an early
  // rejection handled until that caller awaits this same (still rejecting) promise.
  result.catch(() => {})
  return result
}
