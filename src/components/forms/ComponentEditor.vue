<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = defineProps({
  modelValue: String,
  title: String,
  error: String,
})

const editor = ref<Editor>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return

    const isSame = editor.value.getHTML() === value

    if (isSame) {
      return
    }

    editor.value.commands.setContent(value ?? '')
  },
)

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit],
    content: props.modelValue || '<p></p>',
    onUpdate: () => {
      emit('update:modelValue', editor.value!.getHTML())
    },
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ title }}
    </label>
    <div
      class="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
    >
      <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
        <div class="flex flex-wrap items-center">
          <div class="flex items-center space-x-1 rtl:space-x-reverse flex-wrap">
            <button
              id="toggleBoldButton"
              data-tooltip-target="tooltip-bold"
              type="button"
              @click="editor?.chain().focus().toggleBold().run()"
              :class="{ 'bg-gray-100 dark:hover:bg-gray-600': editor?.isActive('bold') }"
              class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"
                />
              </svg>
              <span class="sr-only">Bold</span>
            </button>
            <div
              id="tooltip-bold"
              role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Toggle bold
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <button
              id="toggleItalicButton"
              data-tooltip-target="tooltip-italic"
              type="button"
              @click="editor?.chain().focus().toggleItalic().run()"
              :class="{ 'bg-gray-100 dark:hover:bg-gray-600': editor?.isActive('italic') }"
              class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"
                />
              </svg>
              <span class="sr-only">Italic</span>
            </button>
            <button
              id="toggleListButton"
              type="button"
              @click="editor?.chain().focus().toggleBulletList().run()"
              :class="{ 'bg-gray-100 dark:hover:bg-gray-600': editor?.isActive('bulletList') }"
              data-tooltip-target="tooltip-list"
              class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                />
              </svg>
              <span class="sr-only">Toggle list</span>
            </button>
            <div
              id="tooltip-list"
              role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Toggle list
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <button
              id="toggleOrderedListButton"
              type="button"
              @click="editor?.chain().focus().toggleOrderedList().run()"
              :class="{ 'bg-gray-100 dark:hover:bg-gray-600': editor?.isActive('orderedList') }"
              data-tooltip-target="tooltip-ordered-list"
              class="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4"
                />
              </svg>
              <span class="sr-only">Toggle ordered list</span>
            </button>
            <div
              id="tooltip-ordered-list"
              role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
              Toggle ordered list
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
        <label for="wysiwyg-alignment-example" class="sr-only">{{ title }}</label>
        <editor-content
          class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          :class="[
            error
              ? 'border-error-300 focus:border-error-300 dark:border-error-700 dark:focus:border-error-800'
              : 'border-gray-300 focus:border-brand-300 dark:border-gray-700 dark:focus:border-brand-800',
          ]"
          v-if="editor"
          :editor="editor"
        />
        <p class="mt-1.5 text-theme-xs text-error-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ProseMirror) {
  min-height: 150px; /* Minimum height for the editor */
  max-height: 400px; /* Maximum height before scrolling */
  overflow-y: auto; /* Example border */
}

/* Basic editor styles */
:deep(.ProseMirror:focus) {
  outline: none;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
}
</style>
