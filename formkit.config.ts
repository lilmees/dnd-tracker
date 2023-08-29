import { createProPlugin, inputs } from '@formkit/pro'
import { defineFormKitConfig } from '@formkit/vue'
import { generateClasses, createThemePlugin } from '@formkit/themes'
import { genesisIcons } from '@formkit/icons'
import { en, nl } from '@formkit/i18n'

export default defineFormKitConfig((): any => {
  const key = useRuntimeConfig().public.formkit

  return {
    plugins: [
      createProPlugin(key, inputs),
      createThemePlugin()
    ],
    icons: genesisIcons,
    locales: { en, nl },
    locale: 'nl',
    config: {
      classes: generateClasses(
        {
          global: {
            fieldset: 'border-4 border-black rounded-lg px-2 pb-1',
            help: 'text-xs text-gray-300',
            inner: 'formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none',
            input: 'outline-none text-white bg-transparent disabled:cursor-not-allowed placeholder:text-gray-400',
            legend: 'block mb-1 font-bold body-small',
            loaderIcon: 'inline-flex items-center w-4 text-gray-300 animate-spin',
            label: 'block mb-1 font-bold body-small',
            messages: 'list-none p-0 mt-1 mb-0',
            message: 'text-danger text-xs mt-1',
            outer: 'mb-4 formkit-disabled:opacity-50',
            prefixIcon: 'w-10 flex self-stretch grow-0 shrink-0 rounded-tl rounded-bl border-r-4 border-black [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            suffixIcon: 'w-10 flex border-l-4 border-black self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto'
          },
          'family:box': {
            decorator: 'block relative h-5 w-5 mr-2 rounded-lg bg-transparant border-4 border-black peer-checked:border-primary peer-checked:bg-primary/50',
            decoratorIcon: 'hidden',
            help: 'mb-2 mt-1.5',
            input: 'absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none peer',
            label: 'mt-1 select-none',
            wrapper: 'flex items-center mb-1'
          },
          'family:button': {
            input: '$remove:bg-transparent btn-black',
            wrapper: 'flex justify-end'
          },
          'family:dropdown': {
            dropdownWrapper: 'my-2 w-full rounded-lg [&::-webkit-scrollbar]:hidden',
            emptyMessageInner: 'flex items-center justify-center text-sm p-2 text-center w-full text-gray-400 [&>span]:mr-3 [&>span]:ml-0',
            inner: 'relative flex border-4 border-black focus-within:border-primary rounded-lg mb-1 [&>span:first-child]:focus-within:text-primary',
            input: 'w-full px-3 py-2 rounded overflow-hidden border-none outline-none',
            listbox: 'bg-black/50 border-4 border-black rounded-lg overflow-hidden backdrop-blur',
            listboxButton: 'flex w-12 self-stretch justify-center mx-auto',
            listitem: 'pl-5 body-small cursor-pointer relative data-[is-active="true"]:text-primary data-[is-active="true"]:aria-selected:text-primary aria-selected:text-primary aria-selected:text-primary',
            loaderIcon: 'ml-auto',
            loadMoreInner: 'flex items-center justify-center text-sm p-2 text-center w-full text-blue-500 formkit-loading:text-gray-400 cursor-pointer [&>span]:mr-3 [&>span]:ml-0',
            option: 'p-2.5',
            optionLoading: 'text-gray-400',
            placeholder: 'p-2.5 text-gray-400',
            selector: 'flex w-full justify-between items-center max-h-[40px] [&u]',
            selectedIcon: 'block absolute top-1/2 left-2 w-3 -translate-y-1/2',
            selectIcon: 'flex box-content w-4 px-2 self-stretch grow-0 shrink-0 [&>svg]:w-[1em]'
          },
          'family:text': {
            inner: 'flex items-center border-4 border-black focus-within:border-primary [&>label:first-child]:focus-within:text-primary rounded-lg mb-1',
            input: 'w-full px-3 py-2 border-none placeholder:text-gray-400'
          },
          color: {
            inner: 'flex w-full formkit-prefix-icon:max-w-[7.5em] formkit-suffix-icon:formkit-prefix-icon:max-w-[10em] border-4 border-black rounded-lg',
            input: '$reset h-10 appearance-none w-full cursor-pointer border-none rounded overflow-hidden p-0 m-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none',
            suffixIcon: 'min-w-[2.5em] pr-0 pl-0 m-auto'
          },
          radio: {
            decorator: 'rounded-full',
            decoratorIcon: 'w-5 p-[5px]'
          },
          range: {
            inner: '$reset flex items-center ',
            input: '$reset w-full mb-1 h-2 p-0 rounded-full',
            prefixIcon: '$reset w-4 mr-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            suffixIcon: '$reset w-4 ml-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto'
          },
          select: {
            inner: 'flex relative items-center rounded-lg mb-1 border-4 border-black focus-within:border-primary [&>span:first-child]:focus-within:text-primary',
            input: '!bg-transparent w-full pl-3 pr-8 py-2 h-10 border-none placeholder:text-gray-400 formkit-multiple:p-0 data-[placeholder="true"]:text-gray-400 formkit-multiple:data-[placeholder="true"]:text-inherit',
            selectIcon: 'flex p-[3px] shrink-0 w-5 mr-2 -ml-[1.5em] h-full pointer-events-none [&>svg]:w-[1em]',
            option: 'formkit-multiple:p-3 formkit-multiple:text-sm',
            icon: 'hidden'
          },
          textarea: {
            inner: 'flex rounded-lg mb-1 border-4 border-black focus-within:border-primary [&>label:first-child]:focus-within:text-primary',
            input: 'block w-full h-32 px-3 py-3 border-none text-base text-gray-700 placeholder:text-gray-400'
          },
          autocomplete: {
            closeIcon: 'block grow-0 shrink-0 w-3 mr-3.5',
            inner: '[&>div>[data-value]]:absolute [&>div>[data-value]]:mb-0',
            option: 'grow text-ellipsis',
            selection: 'static flex left-0 top-0 right-0 bottom-0 mt-0 mb-2 rounded-lg bg-gray-100'
          },
          repeater: {
            content: 'grow p-3 flex flex-col align-center',
            controlLabel: 'absolute opacity-0 pointer-events-none',
            controls: 'flex flex-col items-center justify-center bg-transparent p-2',
            fieldset: 'p-4',
            help: 'mb-2 mt-1.5',
            item: 'flex w-full mb-2 rounded-lg bg-black/20',
            items: 'w-full',
            moveDownIcon: 'block w-3',
            moveUpIcon: 'block w-3',
            removeIcon: 'block w-5',
            removeControl: 'hover:text-danger disabled:hover:text-inherit disabled:opacity-25 px-2',
            upControl: 'hover:text-primary disabled:hover:text-inherit disabled:opacity-25 px-2',
            downControl: 'hover:text-primary disabled:hover:text-inherit disabled:opacity-25 px-2'
          },
          toggle: {
            altLabel: 'block w-full mb-1 font-bold text-sm',
            inner: '$reset inline-block mr-2',
            input: 'peer absolute opacity-0 pointer-events-none',
            innerLabel: 'text-[10px] font-bold absolute left-full top-1/2 -translate-x-full -translate-y-1/2 px-1',
            thumb: 'relative left-0 aspect-square rounded-full transition-all w-5 bg-gray-100',
            track: 'p-0.5 min-w-[3em] relative rounded-full transition-all bg-black peer-checked:bg-primary peer-checked:[&>div:last-child]:left-full peer-checked:[&>div:last-child]:-translate-x-full peer-checked:[&>div:first-child:not(:last-child)]:left-0 peer-checked:[&>div:first-child:not(:last-child)]:translate-x-0',
            valueLabel: 'font-bold text-sm',
            wrapper: 'flex flex-wrap items-center mb-1'
          }
        }
      )
    }
  }
})
