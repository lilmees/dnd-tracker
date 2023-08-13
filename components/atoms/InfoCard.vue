<script setup lang="ts">
defineEmits(['pin'])
defineProps<{
  hit: InfoCard,
  pinned: boolean,
  sandbox: boolean
}>()

const { $md } = useNuxtApp()
</script>

<template>
  <div class="border-4 border-primary rounded-lg p-4 sm:p-8 relative">
    <button
      v-if="!sandbox"
      v-tippy="{
        content: $t(`components.infoCard.${pinned ? 'remove' : 'add'}`),
        placement: 'left'
      }"
      class="absolute right-2 top-2"
      @click="$emit('pin', { info: hit, remove: pinned })"
    >
      <Icon
        :name="pinned ? 'iconoir:remove-pin' : 'iconoir:pin'"
        class="w-6 h-6"
        :class="[pinned ? 'text-danger' : 'text-warning']"
      />
    </button>
    <p class="head-2">
      {{ hit.name }}
    </p>
    <div
      v-if="hit.desc"
      class="mt-4 html-richtext"
      v-html="$md.render(hit.desc)"
    />
    <p v-if="hit.category" class="mt-4">
      <span class="font-bold">Category:</span> {{ hit.category }}
    </p>
    <p v-if="hit.ac_string" class="mt-1">
      <span class="font-bold">AC:</span> {{ hit.ac_string }}
    </p>
    <p v-if="hit.strength_requirement" class="mt-1">
      <span class="font-bold">Strength requirement:</span> {{ hit.strength_requirement }}
    </p>
    <p v-if="hit.stealth_disadvantage" class="mt-1 font-bold">
      Stealth disadvantage
    </p>
    <p v-if="hit.cost" class="mt-1">
      <span class="font-bold">Cost:</span> {{ hit.cost }}
    </p>
    <p v-if="hit.damage_dice" class="mt-1">
      <span class="font-bold">Damage dice:</span> {{ hit.damage_dice }}
    </p>
    <p v-if="hit.damage_type" class="mt-1">
      <span class="font-bold">Damage type:</span> {{ hit.damage_type }}
    </p>
    <p v-if="hit.weight" class="mt-1">
      <span class="font-bold">Weight:</span> {{ hit.weight }}
    </p>
    <div v-if="hit.properties" class="mt-1">
      <p class="font-bold">
        Properties
      </p>
      <ul class="list-disc list-outside ml-5 mb-5">
        <li v-for="property in hit.properties" :key="property">
          {{ property }}
        </li>
      </ul>
    </div>
    <p v-if="hit.type" class="mt-4">
      <span class="font-bold">Type:</span> {{ hit.type }}
    </p>
    <p v-if="hit.rarity" class="mt-1">
      <span class="font-bold">Rarity:</span> {{ hit.rarity }}
    </p>
    <p v-if="hit.requires_attunement" class="mt-1 font-bold">
      Requires attunement
    </p>
    <p v-if="hit.skill_proficiencies" class="mt-4">
      <span class="font-bold">Skill proficiencies:</span> {{ hit.skill_proficiencies }}
    </p>
    <p v-if="hit.tool_proficiencies" class="mt-1">
      <span class="font-bold">Tool proficiencies:</span> {{ hit.tool_proficiencies }}
    </p>
    <p v-if="hit.languages" class="mt-1">
      <span class="font-bold">Languages:</span> {{ hit.languages }}
    </p>
    <p v-if="hit.equipment" class="mt-1">
      <span class="font-bold">Equipment:</span> {{ hit.equipment }}
    </p>
    <p v-if="hit.feature" class="mt-4 font-bold">
      {{ hit.feature }}
    </p>
    <p v-if="hit.feature_desc" class="mt-1">
      {{ hit.feature_desc }}
    </p>
    <p v-if="hit.level" class="mt-4">
      <span class="font-bold">Level:</span> {{ hit.level }}
    </p>
    <p v-if="hit.higher_level" class="mt-1">
      <span class="font-bold">Higher level:</span> {{ hit.higher_level }}
    </p>
    <p v-if="hit.casting_time" class="mt-1">
      <span class="font-bold">Casting time:</span> {{ hit.casting_time }}
    </p>
    <p v-if="hit.range" class="mt-1">
      <span class="font-bold">Range:</span> {{ hit.range }}
    </p>
    <p v-if="hit.duration" class="mt-1">
      <span class="font-bold">Duration:</span>
      {{ hit.duration }}
    </p>
    <p v-if="hit.concentration" class="mt-1">
      <span class="font-bold">Concentration:</span>
      {{ hit.concentration }}
    </p>
    <p v-if="hit.ritual" class="mt-1">
      <span class="font-bold">Ritual:</span>
      {{ hit.ritual }}
      <span class="ml-2 body-extra-small">can be cast as ritual</span>
    </p>
    <p v-if="hit.components" class="mt-1">
      <span class="font-bold">Components:</span> {{ hit.components }}
    </p>
    <p v-if="hit.material" class="mt-1">
      <span class="font-bold">Material:</span> {{ hit.material }}
    </p>
    <p v-if="hit.school" class="mt-1">
      <span class="font-bold">School:</span> {{ hit.school }}
    </p>
    <p v-if="hit.dnd_class" class="mt-1">
      <span class="font-bold">Classes that can use this spell:</span> {{ hit.dnd_class }}
    </p>
    <div v-if="hit.prerequisite" class="mt-4">
      <p class="font-bold">
        Prerequisite
      </p>
      <p>
        {{ hit.prerequisite }}
      </p>
    </div>
    <div v-if="hit.effects_desc?.length" class="mt-4">
      <p class="font-bold">
        Effects
      </p>
      <ul class="list-disc list-outside ml-5 mb-5">
        <li v-for="effect in hit.effects_desc" :key="effect">
          {{ effect }}
        </li>
      </ul>
    </div>
  </div>
</template>
