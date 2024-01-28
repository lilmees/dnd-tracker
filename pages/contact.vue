<script setup lang="ts">
useHead({ title: 'Contact' })

const { t } = useI18n()
const toast = useToastStore()
const localePath = useLocalePath()

function sendContactMail ({ __init, ...formData }: Obj): void {
  useFetch('/api/emails/contact-request', {
    method: 'POST',
    body: { props: formData }
  })

  toast.success({ title: t('pages.contact.success') })
  navigateTo(localePath('/'))
}
</script>

<template>
  <Layout name="centered">
    <section class="mt-10">
      <h1 class="max-w-[300px] pb-8">
        {{ $t('pages.contact.title') }}
        <span class="wave mr-2">
          👋
        </span>
      </h1>
      <FormKit
        type="form"
        :actions="false"
        @submit="sendContactMail"
      >
        <FormKit
          name="name"
          :label="$t('components.inputs.nameLabel')"
          validation="length:3,30|alpha_spaces"
        />
        <FormKit
          name="email"
          :label="$t('components.inputs.emailLabel')"
          validation="required|length:5,50|email"
        />
        <FormKit
          name="question"
          type="textarea"
          :maxlength="1000"
          :label="$t('components.inputs.questionLabel')"
          validation="required|length:3,1000"
        />
        <FormKit type="submit" :aria-label="$t('pages.contact.send')">
          {{ $t('pages.contact.send') }}
        </FormKit>
      </FormKit>
    </section>
  </Layout>
</template>
