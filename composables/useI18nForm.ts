import { FormKitSchemaNode, FormKitSchemaComponent } from '@formkit/core'

export const useI18nForm = (schema: FormKitSchemaNode[]): FormKitSchemaNode[] => {
  const { $i18n } = useNuxtApp()

  const form: FormKitSchemaNode[] = []
  schema.forEach((cmp: FormKitSchemaNode) => {
    if (isSchemaComponent(cmp as Obj)) {
      const component = cmp as FormKitSchemaComponent
      if (component.props) {
        component.props.label = $i18n.t(component.props.label)
      }
    }
    form.push(cmp)
  })

  return form
}

function isSchemaComponent (obj: Obj): obj is FormKitSchemaComponent {
  return 'props' in obj
}
