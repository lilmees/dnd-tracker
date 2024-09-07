import { driver } from 'driver.js'
import type { DriveStep, Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

import playground from '@/constants/tour-playground.json'

export function useTour() {
  const user = useSupabaseUser()
  const table = useTableStore()
  const profile = useProfileStore()
  const { t } = useI18n()

  const isTourActive = useState<boolean>('tour-active', () => false)
  const tourCompleted = useCookie<boolean>('tourCompleted')
  const encCopy = ref<Encounter>()
  const driverObj = ref<Driver>()
  const tourSteps = 15

  const steps = computed<DriveStep[]>(() => {
    const steps: DriveStep[] = []

    for (let i = 0; i < tourSteps; i++) {
      steps.push({
        element: `#tour-${i}`,
        popover: {
          title: t(`tour.${i}.title`),
          description: i === (tourSteps - 1)
            ? '<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/xT8qBepJQzUjXpeWU8" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/olympics-shaun-the-sheep-aardman-xT8qBepJQzUjXpeWU8">via GIPHY</a></p>'
            : t(`tour.${i}.description`),
        },
      })
    }

    if (!isTourActive.value) {
      steps.splice(3, 1)
    }

    return steps
  })

  function initializeTour(): void {
    driverObj.value?.destroy()

    driverObj.value = driver({
      showProgress: true,
      smoothScroll: true,
      disableActiveInteraction: true,
      nextBtnText: t('actions.next'),
      prevBtnText: t('actions.prev'),
      doneBtnText: t('actions.finish'),
      steps: steps.value,
      onCloseClick: () => close(),
      onDestroyed: () => close(),
      onDestroyStarted: () => {
        if (!driverObj.value?.hasNextStep() || confirm(t('tour.sure'))) {
          close()
        }
      },
    })

    driverObj.value.drive()
  }

  function close(): void {
    if (user.value) {
      profile.updateProfile({ completedTour: true })
    }
    else {
      tourCompleted.value = true
    }

    table.isPlayground = false
    isTourActive.value = false

    if (encCopy.value) {
      table.encounter = encCopy.value
    }

    driverObj.value?.destroy()
  }

  async function startTour(campaign: boolean = false): Promise<void> {
    if (user.value && !profile.data) {
      await until(!!profile.data).toBe(true, { timeout: 1000 })
    }

    if (profile.data?.completedTour || tourCompleted.value) {
      return
    }

    table.isPlayground = true
    isTourActive.value = campaign

    initializeTour()

    if (table.encounter !== null) {
      encCopy.value = table.encounter

      table.encounter = playground as unknown as Encounter
    }
  }

  return { startTour }
}
