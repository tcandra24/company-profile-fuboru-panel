import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

type Brand = {
  id: string
  name: string
}

const TABLE_NAME = 'brands'

export const useBrandStore = defineStore('brand', () => {
  const brands = ref<Brand[]>([])
  const isLoading = ref<boolean>(false)

  const fetch = async () => {
    isLoading.value = true
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select()
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    brands.value = data
    isLoading.value = false
  }

  return {
    brands,
    isLoading,
    fetch,
  }
})
