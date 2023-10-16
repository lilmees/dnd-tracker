<script setup lang="ts">
import type { Container } from 'tsparticles-engine'

definePageMeta({ middleware: ['session-id', 'auth'] })

const route = useRoute()
const profile = useProfileStore()
const badge = useBadgesStore()

onMounted(async () => {
  if (profile.data) {
    const changes: ProfileUpdate = { stripe_session_id: route.query.session_id as string }

    // add family badge if not already added
    if (!profile.data.badges.some(badge => badge.id === 4)) {
      const familyBadge = await badge.getBadgeById(4)

      if (familyBadge) {
        profile.data.badges.push({ ...familyBadge, earned: Date.now() })
        changes.badges = profile.data.badges
      }
    }

    await profile.updateProfile(changes)
  }
})

function handleConfetti (container: Container): void {
  setTimeout(() => container.destroy(), 5000)
}
</script>

<template>
  <NuxtLayout name="centered" shadow>
    <div class="space-y-6">
      <h2>
        {{ $t('pages.subscribeSuccess.title') }}
      </h2>
      <div class="space-y-2">
        <p>
          {{ $t('pages.subscribeSuccess.text.one') }}
        </p>
        <p>
          {{ $t('pages.subscribeSuccess.text.two') }}
        </p>
        <p>
          {{ $t('pages.subscribeSuccess.text.three') }}
        </p>
      </div>
      <div class="flex justify-end">
        <RouteLink url="/">
          <button class="btn-primary">
            {{ $t('pages.error.goHome') }}
          </button>
        </RouteLink>
      </div>
      <NuxtParticles
        id="confetti"
        class="absolute"
        :options="{
          fullScreen: {
            zIndex: 1,
          },
          particles: {
            number: {
              value: 0,
            },
            color: {
              value: ['#7333E0', '#D926AA', '#36D399', '#3ABFF8', '#FBBD23', '#1FB2A5', '#F87272'],
            },
            shape: {
              type: ['circle', 'square'],
              options: {},
            },
            opacity: {
              value: 1,
              animation: {
                enable: true,
                minimumValue: 0,
                speed: 2,
                startValue: 'max',
                destroy: 'min',
              },
            },
            size: {
              value: 4,
              random: {
                enable: true,
                minimumValue: 2,
              },
            },
            links: {
              enable: false,
            },
            life: {
              duration: {
                sync: true,
                value: 5,
              },
              count: 1,
            },
            move: {
              enable: true,
              gravity: {
                enable: true,
                acceleration: 10,
              },
              speed: {
                min: 10,
                max: 20,
              },
              decay: 0.1,
              direction: 'none',
              straight: false,
              outModes: {
                default: 'destroy',
                top: 'none',
              },
            },
            rotate: {
              value: {
                min: 0,
                max: 360,
              },
              direction: 'random',
              move: true,
              animation: {
                enable: true,
                speed: 60,
              },
            },
            tilt: {
              direction: 'random',
              enable: true,
              move: true,
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 60,
              },
            },
            roll: {
              darken: {
                enable: true,
                value: 25,
              },
              enable: true,
              speed: {
                min: 15,
                max: 25,
              },
            },
            wobble: {
              distance: 30,
              enable: true,
              move: true,
              speed: {
                min: -15,
                max: 15,
              },
            },
          },
          emitters: {
            life: {
              count: 0,
              duration: 0.1,
              delay: 0.4,
            },
            rate: {
              delay: 0.1,
              quantity: 150,
            },
            size: {
              width: 0,
              height: 0,
            },
          },
        }"
        @load="handleConfetti"
      />
    </div>
  </NuxtLayout>
</template>
