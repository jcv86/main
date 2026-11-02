/** Runs in the page. Report geometry only; never include labels or form values. */
export function choiceControlLayout() {
  const failures = []
  let controls = 0
  const rect = value => ({ left:value.left, top:value.top, right:value.right, bottom:value.bottom })
  const visibleRect = (box, element) => {
    const result = rect(box)
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor)
      if (style.visibility === 'hidden' || style.display === 'none') return null
      const bounds = ancestor.getBoundingClientRect()
      if (/^(auto|scroll|hidden|clip)$/.test(style.overflowX)) {
        result.left = Math.max(result.left, bounds.left)
        result.right = Math.min(result.right, bounds.right)
      }
      if (/^(auto|scroll|hidden|clip)$/.test(style.overflowY)) {
        result.top = Math.max(result.top, bounds.top)
        result.bottom = Math.min(result.bottom, bounds.bottom)
      }
    }
    return result.right > result.left && result.bottom > result.top ? result : null
  }
  const check = (box, boundary, control, part, container) => {
    if (!box || !boundary) return
    if (box.left < boundary.left - 1 || box.right > boundary.right + 1
      || box.top < boundary.top - 1 || box.bottom > boundary.bottom + 1) {
      failures.push({ control, part, container, bounds:box, boundary:rect(boundary) })
    }
  }
  for (const input of document.querySelectorAll('input[type="radio"],input[type="checkbox"]')) {
    const style = getComputedStyle(input)
    const inputBox = visibleRect(input.getBoundingClientRect(), input)
    if (!inputBox || style.visibility === 'hidden' || style.display === 'none') continue
    const control = { index:controls++, type:input.type, id:input.id }
    for (const label of Array.from(input.labels ?? [])) {
      const labelBox = visibleRect(label.getBoundingClientRect(), label)
      if (!labelBox) continue
      const group = label.closest('fieldset') ?? label.parentElement
      const groupBox = group && visibleRect(group.getBoundingClientRect(), group)
      const formBox = input.form && visibleRect(input.form.getBoundingClientRect(), input.form)
      check(inputBox, labelBox, control, 'input', 'label')
      check(labelBox, groupBox, control, 'label', 'fieldset-or-parent')
      check(labelBox, formBox, control, 'label', 'form')
      const text = document.createTreeWalker(label, NodeFilter.SHOW_TEXT)
      while (text.nextNode()) {
        if (!text.currentNode.textContent.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(text.currentNode)
        for (const box of range.getClientRects()) {
          const visible = visibleRect(box, text.currentNode.parentElement)
          check(visible, labelBox, control, 'label-text', 'label')
          check(visible, groupBox, control, 'label-text', 'fieldset-or-parent')
          check(visible, formBox, control, 'label-text', 'form')
        }
      }
    }
  }
  return { controls, failures }
}
