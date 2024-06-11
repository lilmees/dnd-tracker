export function generateToken(length = 32): string {
  const numbers = '0123456789'
  const charsLower = 'abcdefghijklmnopqrstuvwxyz'
  const charsUpper = charsLower.toUpperCase()
  const chars = numbers.concat(charsLower, charsUpper)

  let string = ''
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return string
}
