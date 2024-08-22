type Dice = 'd100' | 'd20' | 'd12' | 'd10' | 'd8' | 'd6' | 'd4'

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'black'

interface Option<T> {
  label: string
  value: T | number | string
}

interface Obj {
  [key: string]: any
}

interface RGB {
  r: number
  g: number
  b: number
}
