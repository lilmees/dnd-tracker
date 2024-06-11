type ToastType = 'error' | 'warn' | 'info' | 'success'

interface Toast {
  key: number
  timeout: number
  title: string
  text: string
  actions: any[]
  timed: boolean
  type: ToastType
}
