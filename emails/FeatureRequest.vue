<script setup lang="ts">
defineProps<{
  email: string
  title: string
  text: string
  name: string
  id: number
}>()
</script>

<template>
  <ETailwind
    :config="{
      theme: {
        extend: {
          colors: {
            background: '#2A303C',
            tracker: '#21252E',
            primary: '#7333E0',
            secondary: '#D926AA',
            success: '#36D399',
            info: '#3ABFF8',
            warning: '#FBBD23',
            help: '#1FB2A5',
            danger: '#F87272',
          },
        },
      },
    }"
  >
    <EHtml>
      <EHead />
      <EPreview>
        {{ `feature request from ${name}` }}
      </EPreview>
      <EBody class="bg-background my-auto mx-auto text-white">
        <EContainer class="p-4 md:p-7 my-10 mx-auto max-w-[700px]">
          <ESection class="mt-[32px]">
            <EImg
              src="/logo.png"
              width="250"
              alt="DnD Tracker"
              class="my-0 mx-auto"
            />
          </ESection>
          <EHeading class="font-normal text-center p-0 my-[30px] mx-0">
            New feature request
          </EHeading>
          <EText class="px-4">
            DATE: {{ new Date().toLocaleDateString('nl-NL') }},
          </EText>
          <EText class="px-4">
            EMAIL: {{ email }},
          </EText>
          <EText class="px-4">
            NAME: {{ name }},
          </EText>
          <EText class="px-4">
            ID: {{ id }},
          </EText>
          <EText class="px-4">
            TITLE: {{ title }}
          </EText>
          <EText class="px-4">
            TEXT: {{ text }}
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
