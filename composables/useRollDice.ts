const randomRoll = (max: number): number => Math.floor(Math.random() * max) + 1

export const useDiceRoll = (dice: number, amount = 1): number | number[] => {
  const rolls: number[] = []
  for (let i = 0; i < amount; i++) {
    rolls.push(randomRoll(+dice))
  }
  return rolls.length === 1 ? rolls[0] : rolls
}
