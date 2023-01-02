<script setup>
import Info from '~/assets/icons/info.svg'
import { useToastStore } from '@/store/toast'

const props = defineProps({ actions: { type: Array, required: true } })

const toast = useToastStore()

const attackHeaders = ref(['Name', 'Range', 'To hit', 'Damage', 'Damage type', 'Notes', 'Info'])
const spellHeaders = ref(['Name', 'DC', 'Damage', 'Success', 'Usage', 'Info'])
const actionTypes = computed(() => {
  const actionsObj = { attacks: [], spells: [], multi_attacks: [], multi: [] }
  props.actions.forEach(action => {
    if (action.damage && !action.dc) actionsObj.attacks.push(action)
    else if (action.dc) actionsObj.spells.push(action)
    else if (action.name === 'Multiattack') {
      if (action?.action_options?.from?.options) actionsObj.multi_attacks.push(action.action_options.from.options)
      else if (action?.actions) actionsObj.multi.push(action.actions)
    }
  })
  return actionsObj
})
</script>

<template>
  <section v-if="actions.length">
    <p class="font-bold text-center border-x border-t border-slate-700 rounded-t-md">Actions</p>
    <div class="border border-slate-700 rounded-b-md p-4">
      <table v-if="actionTypes.attacks.length" class="w-full overflow-x-auto">
        <thead>
          <tr>
            <th v-for="header in attackHeaders" :key="header" class="uppercase p-1 body-extra-small text-start">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="body-extra-small sm:body-small">
          <template v-for="action in actionTypes.attacks" :key="action">
            <template v-if="action.damage?.length && action.damage[0]?.choose">
              <tr v-for="damage in action.damage[0]?.from?.options">
                <td>
                  {{ action.name || '' }}
                </td>
                <td>
                  {{
                    action.description.en.includes('reach')
                      ? action.description.en.split('reach')[1].split('.')[0]
                      : action.description.en.includes('range')
                      ? action.description.en.split('range')[1].split('.')[0]
                      : ''
                  }}
                </td>
                <td>
                  {{ action.attack_bonus ? '+ ' + action.attack_bonus : '' }}
                </td>
                <td>
                  {{ damage.damage_dice || '' }}
                </td>
                <td>
                  {{ damage.damage_type?.name || '' }}
                </td>
                <td>
                  {{ damage.notes || '' }}
                </td>
                <td>
                  <Info
                    v-tooltip="$t('actions.info')"
                    class="text-info w-4 h-4 hover:scale-110 cursor-pointer"
                    @click="toast.info({ text: action.description.en, timed: false })"
                  />
                </td>
              </tr>
            </template>
            <tr v-else>
              <td>
                {{ action.name || '' }}
              </td>
              <td>
                {{
                  action.description.en.includes('reach')
                    ? action.description.en.split('reach')[1].split('.')[0]
                    : action.description.en.includes('range')
                    ? action.description.en.split('range')[1].split('.')[0]
                    : ''
                }}
              </td>
              <td>
                {{ action.attack_bonus ? '+ ' + action.attack_bonus : '' }}
              </td>
              <td v-if="action?.damage?.length">
                {{ action.damage[0].damage_dice || '' }}
              </td>
              <td v-if="action?.damage?.length">
                {{ action.damage[0].damage_type?.name || '' }}
              </td>
              <td v-if="action?.damage?.length">
                {{ action.damage[0].notes || '' }}
              </td>
              <td>
                <Info
                  v-tooltip="$t('actions.info')"
                  class="text-info w-4 h-4 hover:scale-110 cursor-pointer"
                  @click="toast.info({ text: action.description.en, timed: false })"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <table v-if="actionTypes.spells.length" class="min-w-full" :class="{ 'mt-4': actionTypes.attacks.length }">
        <thead>
          <tr>
            <th v-for="header in spellHeaders" :key="header" class="uppercase p-1 body-extra-small text-start">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="body-extra-small sm:body-small">
          <tr v-for="action in actionTypes.spells" :key="action">
            <td>
              {{ action.name || '' }}
            </td>
            <td>{{ action.dc.dc_type.name || '' }} {{ action.dc.dc_value || '' }}</td>
            <td v-if="action.damage?.length">
              {{ action.damage[0]?.damage_dice || '' }} {{ action.damage[0]?.damage_type?.name || '' }}
            </td>
            <td v-else></td>
            <td>
              {{ action.dc.success_type || '' }}
            </td>
            <td class="flex flex-col">
              <p>{{ action.usage?.type || '' }}</p>
              <p>{{ action.usage?.dice ? `Dice: ${action.usage?.dice}` : '' }}</p>
              <p>{{ action.usage?.min_value ? `Min value: ${action.usage?.min_value}` : '' }}</p>
            </td>
            <td>
              <Info
                v-tooltip="$t('actions.info')"
                class="text-info w-4 h-4 hover:scale-110 cursor-pointer"
                @click="toast.info({ text: action.description.en, timed: false })"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="actionTypes.multi_attacks.length || actionTypes.multi.length">
        <p class="font-bold">Multiattacks</p>
        <template v-if="actionTypes.multi_attacks.length">
          <template v-for="multi in actionTypes.multi_attacks" :key="multi">
            <p v-for="option in multi" :key="option">
              <span v-for="(attack, index) in option.items" :key="attack">
                <span class="font-bold">{{ attack.count }}</span> {{ attack.action_name }}
                {{ index < option.items.length - 1 ? '& ' : '' }}
              </span>
            </p>
          </template>
        </template>
        <template v-if="actionTypes.multi?.length">
          <template v-for="multi in actionTypes.multi" :key="multi">
            <span v-for="(option, index) in multi" :key="option">
              <span class="font-bold">{{ option.count }}</span> {{ option.action_name }}
              {{ index < multi.length - 1 ? '& ' : '' }}
            </span>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>
