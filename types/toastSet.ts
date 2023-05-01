interface ToastSet {
  timeout?: number
  title?: string
  text?: string
  actions?: any[]
  timed?: boolean
  type?: 'error'|'warn'|'info'|'success'
}
