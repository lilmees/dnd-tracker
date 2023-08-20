import { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import { en, nl } from '@formkit/i18n'

const config: DefaultConfigOptions = {
  locales: { en, nl },
  locale: 'nl',
  config: {
    classes: generateClasses({
      global: {
        outer: 'formkit-disabled:opacity-40',
        label: 'font-bold body-small',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-danger body-small mt-1',
        actions: 'mt-4'
      },
      text: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input',
        wrapper: 'input-wrapper'
      },
      password: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input',
        wrapper: 'input-wrapper'
      },
      number: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input',
        wrapper: 'input-wrapper'
      },
      textarea: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input',
        wrapper: 'input-wrapper'
      },
      select: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input',
        wrapper: 'input-wrapper'
      },
      date: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input',
        wrapper: 'input-wrapper'
      },
      checkbox: {
        input: 'w-5 h-5 rounded-lg border-slate-400 disabled:pointer-events-none disabled:bg-slate-100 bg-transparent cursor-pointer',
        label: 'block body-small',
        legend: 'font-bold body-small mb-1',
        wrapper: 'flex flex-row gap-2 items-center cursor-pointer',
        options: 'flex flex-col gap-1 mb-3'
      },
      color: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input p-0 h-9',
        wrapper: 'input-wrapper'
      },
      radio: {
        input: 'h-4 w-4',
        options: 'flex flex-col gap-1 mb-3 body-small',
        wrapper: 'flex flex-row gap-x-2 w-fit cursor-pointer',
        legend: 'font-bold body-small mb-1'
      },
      form: {
        messages: 'list-none p-0 mt-4 mb-0 bg-danger/10 border border-danger rounded-lg px-3 py-2',
        message: 'text-danger text-xs'
      },
      submit: {
        input: 'btn-black w-full mt-4'
      },
      button: {
        input: 'btn-black w-full mt-4',
        outer: 'grow'
      }
    })
  }
}

export default config
