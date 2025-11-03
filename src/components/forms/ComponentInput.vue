<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ title }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="onInput"
      class="dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      :class="[
        error
          ? 'border-error-300 focus:border-error-300 dark:border-error-700 dark:focus:border-error-800'
          : 'border-gray-300 focus:border-brand-300 dark:border-gray-700 dark:focus:border-brand-800',
      ]"
    />
    <p class="mt-1.5 text-theme-xs text-error-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

defineProps({
  modelValue: String,
  title: String,
  error: String,
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
