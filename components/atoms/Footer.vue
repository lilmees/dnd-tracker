<script setup>
const localePath = useLocalePath()
</script>

<template>
  <div class="bg-black py-8 tracker-shadow">
    <div class="dnd-container flex flex-col gap-4">
      <div class="flex flex-col md:flex-row justify-between">
        <NuxtLink :to="localePath('/')" class="mt-2">
          <h1 class="font-logo">
            DND-TRACKER
          </h1>
        </NuxtLink>
        <div class="flex flex-row gap-y-4 gap-x-20 mt-3">
          <div class="mt-4 md:mt-0">
            <h3 class="mb-4">
              Contact
            </h3>
            <div class="flex flex-col gap-4">
              <NuxtLink to="mailto:jeremy@dnd-tracker.com" class="flex">
                <Icon
                  name="material-symbols:mail-outline-rounded"
                  class="w-6 h-6 mr-2"
                />
                <span>
                  Email
                </span>
              </NuxtLink>
              <NuxtLink :to="localePath('/contact')" class="flex">
                <Icon name="fluent:form-24-regular" class="w-6 h-6 mr-2" />
                <span>
                  Form
                </span>
              </NuxtLink>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <h3 class="mb-4">
              Policies
            </h3>
            <div class="flex flex-col gap-4">
              <NuxtLink :to="localePath('/cookie-policy')" class="flex">
                <Icon name="material-symbols:cookie-outline-rounded" class="w-6 h-6 mr-2" />
                <span>
                  Cookie
                </span>
              </NuxtLink>
              <NuxtLink :to="localePath('/privacy-policy')" class="flex">
                <Icon name="ic:outline-shield" class="w-6 h-6 mr-2" />
                <span>
                  Privacy
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <NuxtImg
          src="/cat.webp"
          alt="Wizard cat"
          sizes="sm:500px md:500px lg:500px"
          class="h-[200px] hidden md:block"
          format="webp"
          provider="imagekit"
        />
      </div>
      <div class="flex flex-col md:flex-row justify-center gap-x-20 gap-y-4 mt-4 md:mt-0">
        <NuxtLink to="https://www.instagram.com/mount_lazarus/" target="_blank">
          <p class="body-small">
            Illustrations by Mount Lazarus
          </p>
        </NuxtLink>
        <p class="text-primary body-small">
          ©{{ new Date().getFullYear() }} dnd-tracker
        </p>
      </div>
    </div>
  </div>
</template>
