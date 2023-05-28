import {
  FormKitSchemaNode,
  FormKitSchemaComponent,
  FormKitSchemaProps,
  FormKitSchemaCondition
} from '@formkit/core'

export const useI18nForm = (schema: FormKitSchemaNode[]): FormKitSchemaNode[] => {
  const form: FormKitSchemaNode[] = []

  schema.forEach((cmp: FormKitSchemaNode) => {
    form.push(translateLabels(cmp))
  })

  return form
}

function translateLabels (cmp: FormKitSchemaNode): FormKitSchemaNode {
  const { $i18n } = useNuxtApp()

  if (isSchemaComponent(cmp as Obj)) {
    const component = cmp as FormKitSchemaComponent

    if (component.props?.label) {
      if (typeof component.props.label !== 'object' && !component.props.label?.includes('$')) {
        component.props.label = $i18n.t(component.props.label)
      } else {
        component.props.label = translateConditional(component.props.label)
      }
    }

    if (component.props?.placeholder) {
      if (typeof component.props.label !== 'object' && !component.props.placeholder?.includes('$')) {
        component.props.placeholder = $i18n.t(component.props.placeholder)
      } else {
        component.props.placeholder = translateConditional(component.props.placeholder)
      }
    }
  } else {
    const component = cmp as FormKitSchemaProps

    if (component?.children && Array.isArray(component.children)) {
      const children: FormKitSchemaNode[] = []

      component.children.forEach((child: FormKitSchemaNode) => {
        if (typeof child === 'string') {
          children.push($i18n.t(child))
        } else {
          children.push(translateLabels(child))
        }
      })

      component.children = children
    }
  }

  return cmp
}

function translateConditional (obj: FormKitSchemaCondition): FormKitSchemaCondition {
  const { $i18n } = useNuxtApp()

  if (obj.then) {
    obj.then = $i18n.t(obj.then as string)
  }

  if (obj.else) {
    translateConditional(obj.else as FormKitSchemaCondition)
  }

  return obj
}

function isSchemaComponent (obj: Obj): obj is FormKitSchemaComponent {
  return 'props' in obj
}
