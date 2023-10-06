<script setup lang="ts">
import logRocket from 'logrocket'
import type { Container } from 'tsparticles-engine'

const toast = useToastStore()
const store = useCurrentCampaignStore()
const profile = useProfileStore()
const route = useRoute()
const localePath = useLocalePath()

if (!route.query.token) {
  routeToNoMember()
}

const isLoading = ref<boolean>(false)
const container = ref<Container>()
const data = ref<CheckJoinCampaign>()

onMounted(async () => {
  const check = await store.findJoinCampaignToken(route.query.token as string)

  if (!check || (profile.data?.id !== check.user.id)) {
    routeToNoMember()
  } else {
    data.value = check as CheckJoinCampaign
  }
})

async function acceptInvite (): Promise<void> {
  isLoading.value = true

  try {
    if (data.value) {
      await store.addCampaignTeamMember({
        campaign: data.value.campaign.id,
        role: data.value.role,
        user: data.value.user.id
      }, data.value.id)

      container.value?.play()
      setTimeout(() => {
        container.value?.destroy()
        navigateTo(localePath(route.fullPath.split('?')[0].replace('/join', '/content')))
      }, 5000)
    }
  } catch (err: any) {
    toast.error()
    logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}

async function declineInvite (): Promise<void> {
  isLoading.value = true

  try {
    if (data.value) {
      await store.deleteJoinCampaignToken(data.value.id)
      navigateTo(localePath('/'))
    }
  } catch (err: any) {
    toast.error()
    logRocket.captureException(err as Error)
  } finally {
    isLoading.value = false
  }
}

function routeToNoMember (): void {
  navigateTo(localePath('/no-member'))
}
</script>

<template>
  <div
    v-if="data"
    class="space-y-6 max-w-prose mx-auto p-6 rounded-lg border-4 border-black bg-black/30"
  >
    <h2>
      {{ $t('pages.campaign.join.title', { campaign: data.campaign.title }) }}
    </h2>
    <p>
      {{ $t('pages.campaign.join.text', { campaign: data.campaign.title, role: $t(`general.roles.${data.role}.title`) }) }}
    </p>
    <div class="flex justify-end gap-2">
      <button
        :disabled="isLoading"
        class="btn-black"
        @click="declineInvite"
      >
        {{ $t('actions.decline') }}
      </button>
      <button
        :disabled="isLoading"
        class="btn-success"
        @click="acceptInvite"
      >
        {{ $t('pages.campaign.join.accept') }}
      </button>
    </div>
    <NuxtParticles
      id="confetti"
      class="absolute"
      :options="{
        fullScreen: {
          zIndex: 1
        },
        particles: {
          number: {
            value: 0
          },
          color: {
            value: [
              '#7333E0',
              '#D926AA',
              '#36D399',
              '#3ABFF8',
              '#FBBD23',
              '#1FB2A5',
              '#F87272'
            ]
          },
          shape: {
            type: [
              'circle',
              'square'
            ],
            options: {}
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              minimumValue: 0,
              speed: 2,
              startValue: 'max',
              destroy: 'min'
            }
          },
          size: {
            value: 4,
            random: {
              enable: true,
              minimumValue: 2
            }
          },
          links: {
            enable: false
          },
          life: {
            duration: {
              sync: true,
              value: 5
            },
            count: 1
          },
          move: {
            enable: true,
            gravity: {
              enable: true,
              acceleration: 10
            },
            speed: {
              min: 10,
              max: 20
            },
            decay: 0.1,
            direction: 'none',
            straight: false,
            outModes: {
              default: 'destroy',
              top: 'none'
            }
          },
          rotate: {
            value: {
              min: 0,
              max: 360
            },
            direction: 'random',
            move: true,
            animation: {
              enable: true,
              speed: 60
            }
          },
          tilt: {
            direction: 'random',
            enable: true,
            move: true,
            value: {
              min: 0,
              max: 360
            },
            animation: {
              enable: true,
              speed: 60
            }
          },
          roll: {
            darken: {
              enable: true,
              value: 25
            },
            enable: true,
            speed: {
              min: 15,
              max: 25
            }
          },
          wobble: {
            distance: 30,
            enable: true,
            move: true,
            speed: {
              min: -15,
              max: 15
            }
          }
        },
        emitters: {
          life: {
            count: 0,
            duration: 0.1,
            delay: 0.4
          },
          rate: {
            delay: 0.1,
            quantity: 150
          },
          size: {
            width: 0,
            height: 0
          }
        }
      }
      "
      @load="(con: Container) => {
        container = con
        container.pause()
      }"
    />
  </div>
  <div
    v-else
    class="animate-pulse space-y-6 max-w-prose mx-auto p-6 rounded-lg border-4 border-tracker bg-tracker/50 h-[250px]"
  >
    <div class="bg-tracker w-full h-8 rounded-full" />
    <div class="bg-tracker w-full h-20 rounded-lg" />
    <div class="flex justify-end gap-2">
      <div class="bg-tracker w-[120px] h-10 rounded-lg" />
      <div class="bg-tracker w-[210px] h-10 rounded-lg" />
    </div>
  </div>
</template>
