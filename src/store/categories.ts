import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

type Category = {
  id: string
  name: string
  slug: string
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const category = ref<Category>({})

  const fetch = async () => {
    const { data, error } = await supabase.from('categories').select()

    if (error) {
      throw error
    }

    categories.value = data
  }

  const show = async (id: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select()
      .eq('id', id)
      .limit(1)
      .single()

    if (error) {
      throw error
    }

    category.value = data
  }

  const add = async (name: string, slug: string) => {
    await supabase.from('categories').insert({
      name,
      slug,
    })
  }

  const update = async (id: string, payload: { name: string; slug: string }) => {
    await supabase
      .from('categories')
      .update({
        name: payload.name,
        slug: payload.slug,
      })
      .eq('id', id)
  }

  const destroy = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id)
  }

  return {
    categories,
    category,
    fetch,
    show,
    add,
    update,
    destroy,
  }
})
