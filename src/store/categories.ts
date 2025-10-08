import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

type Category = {
  id: string
  name: string
  slug: string
}

const TABLE_NAME = 'categories'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const category = ref<Category>()
  const isLoading = ref<boolean>(false)

  const fetch = async () => {
    isLoading.value = true
    const { data, error } = await supabase.from(TABLE_NAME).select()

    if (error) {
      throw error
    }

    categories.value = data
    isLoading.value = false
  }

  const show = async (id: string) => {
    const { data, error } = await supabase.from(TABLE_NAME).select().eq('id', id).limit(1).single()

    if (error) {
      throw error
    }

    category.value = data
  }

  const add = async (name: string, slug: string) => {
    await supabase.from(TABLE_NAME).insert({
      name,
      slug,
    })
  }

  const update = async (id: string, payload: { name: string; slug: string }) => {
    await supabase
      .from(TABLE_NAME)
      .update({
        name: payload.name,
        slug: payload.slug,
      })
      .eq('id', id)
  }

  const destroy = async (id: string) => {
    await supabase.from(TABLE_NAME).delete().eq('id', id)
  }

  return {
    categories,
    category,
    isLoading,
    fetch,
    show,
    add,
    update,
    destroy,
  }
})
