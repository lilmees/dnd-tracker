<script setup>
import { useToastStore } from '@/store/toast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const toast = useToastStore()
const localePath = useLocalePath()

const form = ref({ name: null, email: null, question: null })

function submitted() {
  toast.success({ title: t('contact.success') })
  navigateTo(localePath('/'))
}
</script>

<template>
  <NuxtLayout name="centered">
    <section class="mt-10">
      <h1 class="max-w-[300px] pb-4">
        {{ $t('contact.title') }}
      </h1>
      <FormKit
        v-model="form"
        type="form"
        :actions="false"
        message-class="error-message"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        name="contact-form"
        method="post"
        netlify
        @submit="submitted"
      >
        <input type="hidden" name="form-name" value="contact-form" />
        <Input focus name="name" :label="$t('inputs.nameLabel')" validation="length:3,30|alpha_spaces" />
        <Input name="email" :label="$t('inputs.emailLabel')" validation="required|length:5,50|email" required />
        <Input
          name="question"
          type="textarea"
          :label="$t('inputs.questionLabel')"
          validation="required|length:3,1000|"
          required
        />
        <Button :label="$t('contact.send')" type="submit" />
      </FormKit>
    </section>
  </NuxtLayout>
</template>
