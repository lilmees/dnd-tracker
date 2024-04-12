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
      classes:
      generateClasses(
        {
          global: {
            fieldset: 'border-4 border-black rounded-lg px-2 pb-1 bg-tracker/50',
            help: 'text-xs text-gray-300',
            inner: 'formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none transition-all duration-200',
            input: 'outline-none text-white bg-tracker/50 disabled:cursor-not-allowed placeholder:text-gray-400',
            legend: 'block mb-1 font-bold body-small',
            loaderIcon: 'inline-flex items-center w-4 text-gray-300 animate-spin',
            label: 'block mb-1 font-bold body-small',
            messages: 'list-none p-0 mt-1 mb-0',
            message: 'text-danger text-xs mt-1',
            outer: 'mb-4 formkit-disabled:opacity-50',
            prefixIcon: 'bg-tracker/50 cursor-pointer w-10 flex self-stretch grow-0 shrink-0 rounded-tl rounded-bl [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            suffixIcon: 'bg-tracker/50 cursor-pointer w-10 flex border-l-4 border-black self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto'
          },
          'family:box': {
            decorator: 'block relative h-5 w-5 mr-2 rounded-lg bg-transparant border-4 border-black peer-checked:border-primary peer-checked:bg-primary/50',
            decoratorIcon: 'hidden',
            help: 'mb-2 mt-1.5',
            input: 'absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none peer',
            label: 'mt-1 select-none',
            wrapper: 'flex items-center mb-1 cursor-pointer'
          },
          'family:button': {
            input: '$remove:bg-tracker/50 btn-black',
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
            inner: 'flex items-center border-4 border-black focus-within:border-primary [&>label:first-child]:focus-within:text-primary rounded-lg',
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
            inner: '$reset flex items-center',
            input: '$reset w-full mb-1 h-2 p-0 rounded-full',
            prefixIcon: '$reset w-4 mr-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            suffixIcon: '$reset w-4 ml-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto'
          },
          select: {
            inner: 'flex relative items-center rounded-lg mb-1 border-4 border-black focus-within:border-primary [&>span:first-child]:focus-within:text-primary',
            input: '!bg-tracker/50 w-full pl-3 pr-8 py-2 h-10 border-none placeholder:text-gray-400 formkit-multiple:p-0 data-[placeholder="true"]:text-gray-400 formkit-multiple:data-[placeholder="true"]:text-inherit',
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
          file: {
            fileItem: 'flex items-center text-white mb-1 last:mb-0',
            fileItemIcon: 'w-4 mr-2 shrink-0',
            fileList:
              'shrink grow peer px-3 py-2 formkit-multiple:data-[has-multiple="true"]:mb-6',
            fileName: 'break-all grow text-ellipsis',
            fileRemove:
              'relative z-[2] ml-auto text-[0px] hover:text-danger pl-2 peer-data-[has-multiple=true]:text-sm peer-data-[has-multiple=true]:text-primary peer-data-[has-multiple=true]:ml-3 peer-data-[has-multiple=true]:mb-2 formkit-multiple:bottom-[0.15em] formkit-multiple:pl-0 formkit-multiple:ml-0 formkit-multiple:left-[1em] formkit-multiple:formkit-prefix-icon:left-[3.75em]',
            fileRemoveIcon: 'block text-base w-3 relative z-[2]',
            inner:
              'relative max-w-md cursor-pointer formkit-multiple:[&>button]:absolute',
            input:
              'cursor-pointer text-transparent absolute top-0 right-0 left-0 bottom-0 opacity-0 z-[2]',
            noFiles: 'flex w-full items-center px-3 py-2 text-slate-300',
            noFilesIcon: 'w-4 mr-2'
          },
          toggle: {
            altLabel: 'block w-full mb-1 font-bold text-sm',
            inner: '$reset inline-block mr-2',
            input: 'peer absolute opacity-0 pointer-events-none',
            innerLabel: 'text-[10px] font-bold absolute left-full top-1/2 -translate-x-full -translate-y-1/2 px-1',
            thumb: 'relative left-0 aspect-square rounded-full transition-all w-5 bg-gray-100',
            track: 'cursor-pointer p-0.5 min-w-[3em] relative rounded-full transition-all bg-black peer-checked:bg-primary peer-checked:[&>div:last-child]:left-full peer-checked:[&>div:last-child]:-translate-x-full peer-checked:[&>div:first-child:not(:last-child)]:left-0 peer-checked:[&>div:first-child:not(:last-child)]:translate-x-0',
            valueLabel: 'font-bold text-sm',
            wrapper: 'flex flex-wrap items-center mb-1 disabled:!cursor-not-allowed disabled:!opacity-50',
            label: 'cursor-pointer'
          },
          slider: {
            outer: 'max-w-md',
            help: 'mt-0 mb-1',
            sliderInner:
              'flex items-center py-1 [&>.formkit-max-value]:mb-0 [&>.formkit-max-value]:ml-8 [&>.formkit-max-value]:shrink [&>.formkit-max-value]:grow-0 [&>.formkit-icon]:bg-none [&>.formkit-icon]:border-none [&>.formkit-icon]:p-0 [&>.formkit-icon]:w-4 [&>.formkit-prefix-icon]:mr-2 [&>.formkit-suffix-icon]:ml-2 [&[data-has-mark-labels="true"]_.formkit-track]:mb-4',
            track: 'grow relative z-[3] py-1 user-select-none',
            trackWrapper: 'px-[2px] rounded-full bg-slate-700',
            trackInner: 'h-[6px] mx-[2px] relative',
            fill: 'h-full rounded-full absolute top-0 mx-[-4px] bg-primary',
            marks: 'absolute pointer-events-none left-0 right-0 top-0 bottom-0',
            mark: 'absolute top-1/2 w-[3px] h-[3px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-slate-700 data-[active="true"]:bg-white',
            markLabel:
              'absolute top-[calc(100%+0.5em)] left-1/2 text-white text-[0.66em] -translate-x-1/2',
            handles: 'm-0 p-0 list-none',
            handle:
              'group w-4 h-4 rounded-full bg-white absolute top-1/2 left-0 z-[2] -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.8)] focus-visible:outline-0 focus-visible:ring-2 ring-white data-[is-target="true"]:z-[3]',
            tooltip:
              'absolute font-bold bottom-full left-1/2 -translate-x-1/2 -translate-y-[4px] bg-primary text-white py-1 px-2 text-xs leading-none whitespace-nowrap rounded-sm opacity-0 pointer-events-none transition-opacity after:content-[""] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:-translate-y-[1px] after:border-4 after:border-transparent after:border-t-primary group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[show-tooltip="true"]:opacity-100',
            linkedValues: 'flex items-start justify-between',
            minValue:
              'grow max-w-[45%] mb-0 relative [&_.formkit-inner::after]:content-[""] [&_.formkit-inner::after]:absolute [&_.formkit-inner::after]:left-[105%] [&_.formkit-inner::after]:-translate-y-1/2 [&_.formkit-inner::after]:w-[10%] [&_.formkit-inner::after]:h-[1px] [&_.formkit-inner::after]:bg-slate-700',
            maxValue: 'grow max-w-[45%] mb-0 relative',
            chart:
              'relative z-[2] mb-2 flex justify-between items-center w-full aspect-[3/1]',
            chartBar:
              'absolute bottom-0 h-full bg-slate-700 opacity-[.66] data-[active="false"]:opacity-[.25]'
          },
          togglebuttons: {
            wrapper: 'flex flex-col',
            options: 'flex gap-2',
            input: 'ring-0 aria-pressed:border-primary focus-within:border-primary'
          },
          colorpicker: {
            outer: 'group formkit-disabled:cursor-not-allowed',
            help: 'group-[[data-inline]]:-mt-1 group-[[data-inline]]:mb-2',
            inner: 'w-full relative inline-flex group-[[data-inline]]:shadow-none group-[[data-inline]]:border-4 group-[[data-inline]]:border-black',
            swatchPreview: 'w-full flex justify-start items-center p-3 rounded-lg text-sm cursor-pointer outline-none',
            canvasSwatchPreviewWrapper: `
              relative
              before:content-['']
              before:absolute
              before:top-0
              before:left-0
              before:w-full
              before:h-full
              before:rounded-sm
              before:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]
              before:z-[2]
            `,
            canvasSwatchPreview: `
              rounded
              aspect-[2/1]
              w-10
            `,
            valueString: `
              inline-block
              ml-2
              mr-1
            `,
            panel: `
              grow
              flex
              flex-col
              p-2
              rounded
              bg-black/30
              touch-manipulation
              absolute
              w-[100vw]
              top-full
              left-0
              z-10
              group-[[data-inline]]:static
              group-[[data-inline]]:w-auto
              group-[[data-inline]]:shadow-none
              group-[[data-inline]]:z-auto
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:!fixed
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:top-auto
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:max-w-none
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:bottom-0
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:left-0
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:rounded-none
              [@media(max-width:431px)_and_(hover:none)]:group-[&:not([data-inline])]:w-full
            `,
            panelClose: `
              flex
              justify-end
              items-center
              mb-1
              -mt-1
              border-none
              bg-none
              border-b
              w-[calc(100%+1rem)]
              -ml-2
              pt-0
              pr-2
              pb-1
              pl-2
            `,
            closeIcon: `
              w-[2rem]
              aspect-square
              p-1
              rounded-full
              border
              [&>svg]:w-full
              [&>svg]:aspect-square
              [&>svg]:max-w-none
              [&>svg]:max-h-none
            `,
            controlGroup: `
              grid
              [grid-template-areas:'a_a_a'_'b_c_e'_'b_d_e']
              mb-2
            `,
            canvas: `
              block
              w-full
            `,
            canvasLS: `
              aspect-[2/1]
              cursor-pointer
              rounded-sm
            `,
            LS: `
              [grid-area:a]
              relative
              mb-2
            `,
            preview: `
              [grid-area:b]
              w-8
              inline-flex
              relative
              rounded
              overflow-hidden
              aspect-square
              rounded-sm
              after:content-['']
              after:absolute
              after:top-0
              after:left-0
              after:w-full
              after:h-full
              after:rounded-sm
              after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]
            `,
            hue: `
              [grid-area:c]
              relative
              inline-flex
              h-3/4
              ml-2
            `,
            alpha: `
              [grid-area:d]
              relative
              inline-flex
              h-3/4
              ml-2
            `,
            eyeDropper: `
              [grid-area:e]
              p-1.5
              ml-2
              inline-flex
              self-center
              justify-self-center
              aspect-square
              rounded-lg
              border-4
              border-tracker
              cursor-pointer
              content-center
              items-center
            `,
            eyeDropperIcon: `
              w-auto
              [&>svg]:w-5
            `,
            control: `
              absolute
              bg-white
              shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_3px_rgba(0,0,0,0.2)]
              -translate-x-1/2
              -translate-y-1/2
              pointer-events-none
              data-[prevent-focus-style]:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_3px_rgba(0,0,0,0.2)]
              focus-visible:outline-none
              focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_3px_rgba(0,0,0,0.2),0_0_0_4px_rgba(59,130,246,1),0_0_0_5px_rgba(0,0,0,1)]
            `,
            controlLS: `
              w-[10px]
              h-[10px]
              rounded-full
            `,
            controlHue: `
              w-[4px]
              h-[calc(100%-2px)]
              top-1/2
              rounded-[1px]
            `,
            controlAlpha: `
              w-[4px]
              h-[calc(100%-2px)]
              top-1/2
              rounded-[1px]
            `,
            formatField: `
              flex
              items-center
              justify-center
              grow
            `,
            colorInputGroup: `
              flex
              items-center
              justify-center
              grow
            `,
            colorField: `
              bg-transparent
              border-tracker
              !border-4
              !rounded-lg
            `,
            fieldGroup: `
              flex
              flex-col
              items-center
              justify-center
              w-full
              mr-1
              [&>input]:p-1
              [&>input]:body-small
              [&>input]:font-bold
              [&>input]:m-0
              [&>input]:grow
              [&>input]:shrink
              [&>input]:w-full
              [&>input]:border
              [&>input]:rounded-sm
              [&>input]:text-center
              [&>input]:appearance-none
              [&>input::-webkit-outer-spin-button]:appearance-none 
              [&>input::-webkit-inner-spin-button]:appearance-none
              [&>input::-webkit-inner-spin-button]:m-0
              [&>input:focus]:outline-none
              [&>input:focus]:ring
              [&>input:focus]:ring-primary
              max-[431px]:[&>input]:text-base
            `,
            fieldLabel: 'mb-1 font-bold body-small opacity-50',
            formatSwitcher: `
              flex
              justify-end
              self-start
              mt-1
              uppercase
              shrink-0
              p-1
              rounded-sm
              select-none
            `,
            switchIcon: `
              [&>svg]:w-3
            `,
            swatches: `
              flex
              flex-wrap
              w[calc(100%+0.5rem)]
              -ml-1
              pt-2
              pb-2
              mt-2
              -mb-2
              border-t
              border-tracker
              overflow-auto
              max-h-[200px]
              select-none
              first:-mt-2
              first:border-t-0
            `,
            swatchGroup: `
              flex
              flex-wrap
              w-full
              mb-2
              last:mb-0
            `,
            swatchGroupLabel: `
              block
              w-full
              text-sm
              opacity-50
            `,
            swatch: `
              relative
              w-full
              max-w-[calc((100%/10)-0.5rem)]
              aspect-square
              m-1
              cursor-pointer
              before:content-['']
              before:absolute
              before:top-0
              before:left-0
              before:w-full
              before:h-full
              before:rounded-sm
              before:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]
              before:pointer-events-none
              before:z-[2]
              data-[active='true']:after:content-['']
              data-[active='true']:after:block
              data-[active='true']:after:absolute
              data-[active='true']:after:w-1.5
              data-[active='true']:after:h-1.5
              data-[active='true']:after:top-1/2
              data-[active='true']:after:left-1/2
              data-[active='true']:after:pointer-events-none
              data-[active='true']:after:rounded-full
              data-[active='true']:after:-translate-x-1/2
              data-[active='true']:after:-translate-y-1/2
              data-[active='true']:after:bg-white
              data-[active='true']:after:z-[2]
              data-[active='true']:after:ring-1
              data-[active='true']:after:ring-[rgba(0,0,0,0.33)]
              [&>canvas]:block
              [&>canvas]:w-full
              [&>canvas]:aspect-square
              [&>canvas]:rounded-sm
              [&>canvas:focus-visible]:outline-none
              [&>canvas:focus-visible]:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(59,130,246,1)]
            `
          }
        }
      )
    }
  }
})
