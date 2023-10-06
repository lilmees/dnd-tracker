type Dice = 'd100'|'d20'|'d12'|'d10'|'d8'|'d6'|'d4'

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'black'

interface Option {
  label: string
  value: number | string
}

interface Obj {
  [key: string]: any
}
