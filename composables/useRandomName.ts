import { firstname, lastname, middlename } from '@/fixtures/names.json'

export function useRandomName(): string {
  const first = randomArrayItem(firstname)
  const last = randomArrayItem(lastname.prefixes) + randomArrayItem(lastname.suffixes)

  if (Math.random() <= 0.10) {
    return `${first} ${randomArrayItem(middlename)} ${last}`
  }

  return `${first} ${last}`
}
