<script setup lang="ts">
defineProps<{ cards: InfoCard[] }>()

const { $md } = useNuxtApp()
const table = useTableStore()

const open = ref<number | null>(null)

async function removePin(info: InfoCard): Promise<void> {
  if (!table.encounter) {
    return
  }

  let update = table.encounter.info_cards

  update = update.filter((i: InfoCard) => i.slug !== info.slug)
  open.value = null

  await table.encounterUpdate({ info_cards: update })
}
</script>

<template>
  <div>
    <p class="font-bold text-white body-small mb-1">
      {{ $t('components.infoDropdown.title') }}
    </p>
    <div
      v-for="(card, index) in cards"
      :key="card.slug"
      class="rounded-lg p-4 bg-tracker/50 space-y-4 border-4 border-tracker mb-1"
    >
      <button
        class="flex w-full justify-between items-center outline-none"
        @click="open = open === index ? null : index"
        @keydown.escape="open = null"
      >
        <p class="head-2 ">
          {{ card.name }}
        </p>
        <Icon
          name="tabler:chevron-down"
          class="duration-200 h-6 w-6 stroke-2"
          :class="{ 'rotate-180': open === index }"
          aria-hidden="true"
        />
      </button>
      <div
        v-if="open === index"
        class="text-slate-300"
      >
        <div
          v-if="card.desc"
          class="mt-4 html-richtext"
          v-html="$md.render(card.desc)"
        />
        <p
          v-if="card.category"
          class="mt-4"
        >
          <span class="font-bold text-white">Category:</span> {{ card.category }}
        </p>
        <p
          v-if="card.ac_string"
          class="mt-1"
        >
          <span class="font-bold text-white">AC:</span> {{ card.ac_string }}
        </p>
        <p
          v-if="card.strength_requirement"
          class="mt-1"
        >
          <span class="font-bold text-white">Strength requirement:</span> {{ card.strength_requirement }}
        </p>
        <p
          v-if="card.stealth_disadvantage"
          class="mt-1 font-bold"
        >
          Stealth disadvantage
        </p>
        <p
          v-if="card.cost"
          class="mt-1"
        >
          <span class="font-bold text-white">Cost:</span> {{ card.cost }}
        </p>
        <p
          v-if="card.damage_dice"
          class="mt-1"
        >
          <span class="font-bold text-white">Damage dice:</span> {{ card.damage_dice }}
        </p>
        <p
          v-if="card.damage_type"
          class="mt-1"
        >
          <span class="font-bold text-white">Damage type:</span> {{ card.damage_type }}
        </p>
        <p
          v-if="card.weight"
          class="mt-1"
        >
          <span class="font-bold text-white">Weight:</span> {{ card.weight }}
        </p>
        <div
          v-if="card.properties"
          class="mt-1"
        >
          <p class="font-bold text-white">
            Properties
          </p>
          <ul class="list-disc list-outside ml-5 mb-5">
            <li
              v-for="property in card.properties"
              :key="property"
            >
              {{ property }}
            </li>
          </ul>
        </div>
        <p
          v-if="card.type"
          class="mt-4"
        >
          <span class="font-bold text-white">Type:</span> {{ card.type }}
        </p>
        <p
          v-if="card.rarity"
          class="mt-1"
        >
          <span class="font-bold text-white">Rarity:</span> {{ card.rarity }}
        </p>
        <p
          v-if="card.requires_attunement"
          class="mt-1 font-bold"
        >
          Requires attunement
        </p>
        <p
          v-if="card.skill_proficiencies"
          class="mt-4"
        >
          <span class="font-bold text-white">Skill proficiencies:</span> {{ card.skill_proficiencies }}
        </p>
        <p
          v-if="card.tool_proficiencies"
          class="mt-1"
        >
          <span class="font-bold text-white">Tool proficiencies:</span> {{ card.tool_proficiencies }}
        </p>
        <p
          v-if="card.languages"
          class="mt-1"
        >
          <span class="font-bold text-white">Languages:</span> {{ card.languages }}
        </p>
        <p
          v-if="card.equipment"
          class="mt-1"
        >
          <span class="font-bold text-white">Equipment:</span> {{ card.equipment }}
        </p>
        <p
          v-if="card.feature"
          class="mt-4 font-bold"
        >
          {{ card.feature }}
        </p>
        <p
          v-if="card.feature_desc"
          class="mt-1"
        >
          {{ card.feature_desc }}
        </p>
        <p
          v-if="card.level"
          class="mt-4"
        >
          <span class="font-bold text-white">Level:</span> {{ card.level }}
        </p>
        <p
          v-if="card.higher_level"
          class="mt-1"
        >
          <span class="font-bold text-white">Higher level:</span> {{ card.higher_level }}
        </p>
        <p
          v-if="card.casting_time"
          class="mt-1"
        >
          <span class="font-bold text-white">Casting time:</span> {{ card.casting_time }}
        </p>
        <p
          v-if="card.range"
          class="mt-1"
        >
          <span class="font-bold text-white">Range:</span> {{ card.range }}
        </p>
        <p
          v-if="card.duration"
          class="mt-1"
        >
          <span class="font-bold text-white">Duration:</span>
          {{ card.duration }}
        </p>
        <p
          v-if="card.concentration"
          class="mt-1"
        >
          <span class="font-bold text-white">Concentration:</span>
          {{ card.concentration }}
        </p>
        <p
          v-if="card.ritual"
          class="mt-1"
        >
          <span class="font-bold text-white">Ritual:</span>
          {{ card.ritual }}
          <span class="ml-2 body-extra-small">can be cast as ritual</span>
        </p>
        <p
          v-if="card.components"
          class="mt-1"
        >
          <span class="font-bold text-white">Components:</span> {{ card.components }}
        </p>
        <p
          v-if="card.material"
          class="mt-1"
        >
          <span class="font-bold text-white">Material:</span> {{ card.material }}
        </p>
        <p
          v-if="card.school"
          class="mt-1"
        >
          <span class="font-bold text-white">School:</span> {{ card.school }}
        </p>
        <p
          v-if="card.dnd_class"
          class="mt-1"
        >
          <span class="font-bold text-white">Classes that can use this spell:</span> {{ card.dnd_class }}
        </p>
        <div
          v-if="card.prerequisite"
          class="mt-4"
        >
          <p class="font-bold text-white">
            Prerequisite
          </p>
          <p>
            {{ card.prerequisite }}
          </p>
        </div>
        <div
          v-if="card.effects_desc?.length"
          class="mt-4"
        >
          <p class="font-bold text-white">
            Effects
          </p>
          <ul class="list-disc list-outside ml-5 mb-5">
            <li
              v-for="effect in card.effects_desc"
              :key="effect"
            >
              {{ effect }}
            </li>
          </ul>
        </div>
        <div class="flex justify-end">
          <button
            v-tippy="{
              content: $t('components.infoCard.remove'),
              placement: 'left',
            }"
            @click="removePin(card)"
          >
            <Icon
              name="iconoir:remove-pin"
              class="w-6 h-6 text-danger"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="cards && !cards.length"
      class="rounded-lg p-4 bg-tracker/50 space-y-4 border-4 border-tracker mb-1 text-slate-300 body-small"
    >
      {{ $t('components.infoDropdown.cta') }}
    </div>
  </div>
</template>
