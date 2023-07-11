<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="bg-tracker py-8 tracker-shadow">
    <div class="dnd-container flex flex-col gap-4">
      <div class="flex flex-col md:flex-row justify-between">
        <NuxtLink :to="localePath('/')" class="mt-2">
          <NuxtImg
            src="/logo.svg"
            alt="DnD Tracker logo"
            sizes="sm:500px md:500px lg:500px"
            class="h-16"
            provider="imagekit"
          />
        </NuxtLink>
        <div class="flex flex-row gap-y-4 gap-x-20 mt-3">
          <div class="mt-4 md:mt-0">
            <p class="mb-4 head-3">
              Contact
            </p>
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
            <p class="mb-4 head-3">
              Policies
            </p>
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
