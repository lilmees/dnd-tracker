export function start(el: Element): void {
  (el as HTMLDivElement).style.height = el.scrollHeight + 'px'
}

export function end(el: Element): void {
  (el as HTMLDivElement).style.height = ''
}
