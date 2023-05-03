<script setup lang="ts">
import { useToastStore } from '@/store/toast'

const { $i18n } = useNuxtApp()
const toast = useToastStore()
const localePath = useLocalePath()
const mail = useMail()

const form: Ref<ContactForm> = ref({ name: '', email: '', question: '' })

function sendContactMail (form: Obj): void {
  mail.send({
    from: form.email,
    subject: form.name
      ? `Contact/question mail from ${form.name}`
      : 'Contact/question mail',
    html: `
    <h1>New question/contact</h1>
    <p>DATE: ${new Date()} </p>
    <p>EMAIL: ${form.email} </p>
    ${form.name ? `<p>NAME: ${form.name} </p>` : ''}
    </br>
    <p>${form.question} </p>
    `
  })
  toast.success({ title: $i18n.t('contact.success') })
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
        @submit="sendContactMail"
      >
        <Input
          focus
          name="name"
          :label="$t('inputs.nameLabel')"
          validation="length:3,30|alpha_spaces"
        />
        <Input
          name="email"
          :label="$t('inputs.emailLabel')"
          validation="required|length:5,50|email"
          required
        />
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
