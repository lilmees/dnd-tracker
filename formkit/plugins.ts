const legends = ['checkbox_multi', 'radio_multi', 'repeater', 'transferlist']

function createAsteriskPlugin(node: any) {
  if (['button', 'submit', 'hidden', 'group', 'list', 'meta'].includes(node.props.type)) {
    return
  }

  node.on('created', () => {
    const legendOrLabel = legends.includes(`${node.props.type}${node.props.options ? '_multi' : ''}`) ? 'legend' : 'label'

    if (node.props.definition.schemaMemoKey) {
      node.props.definition.schemaMemoKey += `${node.props.options ? '_multi' : ''}_add_asterisk`
    };

    const schemaFn = node.props.definition.schema
    node.props.definition.schema = (sectionsSchema = {}) => {
      sectionsSchema[legendOrLabel] = {
        children: ['$label', {
          $el: 'span',
          if: '$state.required',
          attrs: {
            class: 'text-secondary',
          },
          children: ['*'],
        }],
      }

      return schemaFn(sectionsSchema)
    }
  })
}

function createIconMessagePlugin(node) {
  const icon = `
    <span class="w-6 text-current-color">
      <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px">
        <path fill="currentColor" d="M50,19A31,31,0,1,0,81,50,31,31,0,0,0,50,19Zm0,56A25,25,0,1,1,75,50,25,25,0,0,1,50,75Z"></path>
        <rect fill="currentColor" x="47" y="34" width="6" height="19"></rect>
        <circle fill="currentColor" cx="50" cy="62" r="3"></circle>
      </svg>
    </span>
  `

  node.on('created', () => {
    const original = node.props.definition.schema
    node.context.warningIcon = icon
    node.props.definition.schema = (extensions) => {
      if (!extensions.message) {
        extensions.message = {
          attrs: {
            class: '$classes.message + \' flex items-center\'',
            innerHTML: '$warningIcon + " " + $message.value',
          },
          children: null,
        }
      }
      return original(extensions)
    }
  })
}

export { createIconMessagePlugin, createAsteriskPlugin }
