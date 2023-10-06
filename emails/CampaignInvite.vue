<script setup lang="ts">
const props = defineProps<{
  inviteLink: string
  invitedBy: string
  username: string
  campaign: string
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
      <EPreview>{{ $t('preview') }}</EPreview>
      <EBody class="bg-background my-auto mx-auto text-white">
        <EContainer class="p-4 md:p-7 my-10 mx-auto max-w-[700px]">
          <ESection class="mt-[32px]">
            <EImg src="/logo.png" width="250" alt="DnD Tracker" class="my-0 mx-auto" />
          </ESection>
          <EHeading class="font-normal text-center p-0 my-[30px] mx-0">
            Join <strong>{{ campaign }}</strong> on <strong>DnD Tracker</strong>
          </EHeading>
          <EText class="px-4">
            {{ $t('hello') }} {{ username }},
          </EText>
          <EText class="px-4">
            <strong>{{ invitedBy }}</strong>
            {{ $t('joinStart') }}
            <strong>{{ campaign }}</strong>
            {{ $t('joinEnd') }}
            <strong>DnD Tracker</strong>.
          </EText>
          <ESection class="my-7 px-4">
            <EButton
              class="bg-primary border-primary py-4 px-6 rounded-lg outline-none border-4 text-white font-bold"
              :href="inviteLink"
            >
              {{ $t('button') }}
            </EButton>
          </ESection>
          <EText class="text-[14px] leading-[24px] px-4">
            {{ $t('paste') }}
            <ELink :href="inviteLink" class="text-primary no-underline">
              {{ inviteLink }}
            </ELink>
          </EText>
          <EText class="text-[14px] leading-[24px] px-4">
            {{ $t('fun') }},
            <br>
            DnD-Tracker Team
          </EText>
          <EHr class="border border-solid border-slate-700 my-[26px] mx-0 w-full" />
          <EText class="text-[#666666] text-[12px] leading-[24px] px-4">
            {{ $t('footer') }}
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
