import { driver } from 'driver.js'
import type { DriveStep, Driver } from 'driver.js'
import playground from '@/fixtures/playground.json'

export function useTour () {
  const table = useTableStore()
  const profile = useProfileStore()
  const { t } = useI18n()

  const encCopy = ref<Encounter>()
  const campaignStep = ref<boolean>(false)
  const driverObj = ref<Driver>()
  const tourSteps = 15
  const giphy = '<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/xT8qBepJQzUjXpeWU8" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/olympics-shaun-the-sheep-aardman-xT8qBepJQzUjXpeWU8">via GIPHY</a></p>'

  const steps = computed<DriveStep[]>(() => {
    const steps: DriveStep[] = []

    for (let i = 0; i < tourSteps; i++) {
      steps.push({
        element: `#tour-${i}`,
        popover: {
          title: t(`tour.${i}.title`),
          description: i === (tourSteps - 1) ? giphy : t(`tour.${i}.description`)
        }
      })
    }

    if (!campaignStep.value) {
      steps.splice(3, 1)
    }

    return steps
  })

  function initializeTour (): void {
    driverObj.value?.destroy()

    driverObj.value = driver({
      showProgress: true,
      smoothScroll: true,
      allowClose: false,
      disableActiveInteraction: true,
      nextBtnText: t('actions.next'),
      prevBtnText: t('actions.prev'),
      doneBtnText: t('actions.finish'),
      steps: steps.value,
      onCloseClick: () => close(),
      onDestroyed: () => close()
    })
  }

  function close (): void {
    profile.updateProfile({ completedTour: true })
    table.isPlayground = false

    if (encCopy.value) {
      table.encounter = encCopy.value
    }

    driverObj.value?.destroy()
  }

  function startTour (campaign: boolean = false): void {
    table.isPlayground = true
    campaignStep.value = campaign

    initializeTour()
    driverObj.value?.drive()

    if (table.encounter !== null) {
      encCopy.value = table.encounter

      // figure way out to get encounter homebrew campaign working
      // translations

      table.encounter = playground as unknown as Encounter
    }
  }

  return { startTour }
}
