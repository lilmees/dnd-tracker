const randomRoll = max => Math.floor(Math.random() * max) + 1

export const rollD100 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(100))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD20 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(20))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD12 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(12))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD10 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(10))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD8 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(8))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD6 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(6))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD4 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(4))
  return rolls.length === 1 ? rolls[0] : rolls
}

export const rollD2 = (amount = 1) => {
  const rolls = []
  for (let i = 0; i < amount; i++) rolls.push(randomRoll(2))
  return rolls.length === 1 ? rolls[0] : rolls
}
