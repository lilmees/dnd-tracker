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
        actions: 'mt-4',
        prefixIcon: 'h-12 pl-4 flex self-stretch grow-0 shrink-0 [&>svg]:m-auto',
        suffixIcon: 'h-12 pr-4 flex self-stretch grow-0 shrink-0 [&>svg]:m-auto'
      },
      text: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input'
      },
      password: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input'
      },
      number: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input'
      },
      textarea: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input'
      },
      select: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input'
      },
      date: {
        inner: 'input-inner formkit-invalid:ring-danger formkit-errors:ring-danger',
        input: 'input'
      },
      checkbox: {
        input: 'w-5 h-5 disabled:pointer-events-none disabled:bg-slate-100',
        label: 'block text-lg mb-1',
        wrapper: 'flex flex-row gap-2 items-center'
      },
      color: {
        label: 'block font-normal text-base mb-1 text-primary formkit-invalid:text-danger'
      },
      radio: {
        input: 'h-5 w-5 ml-1',
        outer: '!w-min',
        label: 'hidden',
        options: 'flex flex-row'
      },
      form: {
        messages: 'list-none p-0 mt-4 mb-0 bg-danger/10 border border-danger rounded px-3 py-2',
        message: 'text-danger text-xs'
      },
      submit: {
        input: 'btn bg-black w-full mt-3'
      },
      button: {
        input: 'btn bg-black w-full mt-3',
        outer: 'grow'
      }
    })
  }
}

export default config
