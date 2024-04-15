export default {
  global: {
    fieldset: 'border-4 border-black rounded-lg px-2 pb-1 bg-background/50',
    help: 'text-xs text-slate-300',
    inner: 'formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none transition-all duration-200',
    input: 'outline-none text-white bg-background/50 disabled:cursor-not-allowed placeholder:text-slate-300',
    legend: 'block mb-1 font-bold body-small',
    loaderIcon: 'inline-flex items-center w-4 text-slate-300 animate-spin',
    label: 'block mb-1 font-bold body-small',
    messages: 'list-none p-0 mt-1 mb-0',
    message: 'text-danger text-xs mt-1',
    outer: 'mb-4 formkit-disabled:opacity-50',
    prefixIcon: 'flex items-center -mr-1 ml-2 w-5 shrink-0 [&>svg]:max-w-[1rem] [&>svg]:max-h-[1rem]',
    suffixIcon: 'flex items-center -ml-1 mr-2 w-5 shrink-0 [&>svg]:max-w-[1rem] [&>svg]:max-h-[1rem]'
  },
  'family:box': {
    decorator: 'block relative h-5 w-5 mr-2 rounded-lg bg-transparent border-4 border-black peer-checked:border-primary peer-checked:bg-primary/50',
    decoratorIcon: 'hidden',
    help: 'mb-2 mt-1.5',
    input: 'absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none peer',
    label: 'mt-1 select-none',
    wrapper: 'flex items-center mb-1 cursor-pointer'
  },
  'family:button': {
    input: '$remove:bg-background/50 btn-black',
    wrapper: 'flex justify-end'
  },
  'family:dropdown': {
    dropdownWrapper: 'my-2 w-full rounded-lg [&::-webkit-scrollbar]:hidden',
    emptyMessageInner: 'flex items-center justify-center text-sm p-2 text-center w-full text-slate-300 [&>span]:mr-3 [&>span]:ml-0',
    inner: 'relative flex border-4 border-black focus-within:border-primary rounded-lg mb-1',
    input: 'w-full px-3 py-2 rounded overflow-hidden border-none outline-none',
    listbox: 'bg-black/50 border-4 border-black rounded-lg overflow-hidden backdrop-blur',
    listboxButton: 'flex w-12 self-stretch justify-center mx-auto',
    listitem: 'pl-5 body-small cursor-pointer relative data-[is-active="true"]:text-primary data-[is-active="true"]:aria-selected:text-primary aria-selected:text-primary aria-selected:text-primary',
    loaderIcon: 'ml-auto',
    loadMoreInner: 'flex items-center justify-center text-sm p-2 text-center w-full text-blue-500 formkit-loading:text-slate-300 cursor-pointer [&>span]:mr-3 [&>span]:ml-0',
    option: 'p-2.5',
    optionLoading: 'text-slate-300',
    placeholder: 'p-2.5 text-slate-300',
    selector: 'flex w-full justify-between items-center max-h-[40px] [&u]',
    selectedIcon: 'block absolute top-1/2 left-2 w-3 -translate-y-1/2',
    selectIcon: 'flex box-content w-4 px-2 self-stretch grow-0 shrink-0 [&>svg]:w-[1em]'
  },
  'family:text': {
    inner: 'bg-background/50 flex items-center border-4 border-black focus-within:border-primary rounded-lg',
    input: 'bg-background/50 bg-transparent w-full px-3 py-2 border-none placeholder:text-slate-300'
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
    inner: 'flex relative items-center rounded-lg mb-1 border-4 border-black focus-within:border-primary',
    input: 'w-full px-3 py-2 h-10 border-none placeholder:text-slate-300 formkit-multiple:p-0 data-[placeholder="true"]:text-slate-300 formkit-multiple:data-[placeholder="true"]:text-inherit',
    selectIcon: 'flex p-[3px] shrink-0 w-5 mr-2 -ml-[1.5em] h-full pointer-events-none [&>svg]:w-[1em]',
    option: 'formkit-multiple:p-3 formkit-multiple:text-sm',
    icon: 'hidden'
  },
  textarea: {
    inner: 'flex rounded-lg mb-1 border-4 border-black focus-within:border-primary',
    input: 'block w-full min-h-[40px] h-32 px-3 py-3 border-none text-base placeholder:text-slate-300'
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
    item: 'flex w-full mb-2 rounded-lg border-4 border-black',
    items: 'w-full',
    moveDownIcon: 'block w-3',
    moveUpIcon: 'block w-3',
    removeIcon: 'block w-5',
    removeControl: 'hover:text-danger disabled:hover:text-inherit disabled:opacity-25 px-2 transition-colors duration-200',
    upControl: 'hover:text-secondary disabled:hover:text-inherit disabled:opacity-25 px-2 transition-colors duration-200',
    downControl: 'hover:text-secondary disabled:hover:text-inherit disabled:opacity-25 px-2 transition-colors duration-200'
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
        'relative cursor-pointer formkit-multiple:[&>button]:absolute bg-background/50',
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
    label: '$reset !mb-0 cursor-pointer body-small font-bold'
  },
  togglebuttons: {
    wrapper: 'flex flex-col',
    options: 'flex gap-2',
    input: 'ring-0 aria-pressed:border-primary focus-within:border-primary'
  }
}
