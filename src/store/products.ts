import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

type Product = {
  id: string
  name: string
  image: string
  category_id: string
  slug: string
  description: string
  category: Category
}

type Category = {
  name: string
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])

  const fetch = async () => {
    const { data, error } = await supabase.from('products').select('*, category:category_id(name)')

    if (error) {
      throw error
    }

    products.value = data
  }

  const add = async (
    payload: {
      name: string
      slug: string
      category_id: string
      description: string
    },
    file: { path: string; file: File | null },
  ) => {
    const input = {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      category_id: payload.category_id,
      image: '',
    }

    if (file.file) {
      const { data, error } = await supabase.storage
        .from('product-bucket')
        .upload(file.path, file.file)

      if (error) {
        throw error
      }

      input.image = data.path
    }

    await supabase.from('products').insert(input)
  }

  const destroy = async (id: string, image: string) => {
    await supabase.storage.from('product-bucket').remove([image])
    await supabase.from('products').delete().eq('id', id)
  }

  return {
    products,
    fetch,
    add,
    destroy,
  }
})
