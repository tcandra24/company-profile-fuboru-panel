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
  advantage: string
  category: Category
  socials: Social[]
}

type Category = {
  name: string
}

interface Social {
  id: string
  name: string
  link: string
  embeded_code: string
}

interface SocialInput extends Omit<Social, 'id'> {
  product_id: string
}

const TABLE_NAME = 'products'
const SOCIAL_TABLE_NAME = 'socials'
const BUCKET_NAME = 'product-bucket'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const product = ref<Product>()
  const isLoading = ref<boolean>(false)

  const fetch = async () => {
    isLoading.value = true
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, category:category_id(name)')
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    products.value = data
    isLoading.value = false
  }

  const show = async (id: string) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, socials(id, name, link, embeded_code)')
      .eq('id', id)
      .limit(1)
      .single()

    if (error) {
      throw error
    }

    product.value = data
  }

  const add = async (
    payload: {
      name: string
      slug: string
      category_id: string
      description: string
      advantage: string
      socials: Social[]
    },
    file: { path: string; file: File | null },
  ) => {
    const input = {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      advantage: payload.advantage,
      category_id: payload.category_id,
      image: '',
    }

    if (file.file) {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(file.path, file.file)

      if (error) {
        throw error
      }

      input.image = data.path
    }

    const { data } = await supabase.from(TABLE_NAME).insert(input).select('id').single()

    let inputSocial: SocialInput[] = []
    for (const social of payload.socials) {
      inputSocial = [
        ...inputSocial,
        {
          product_id: data?.id,
          name: social.name,
          link: social.link,
          embeded_code: social.embeded_code,
        },
      ]
    }

    await supabase.from(SOCIAL_TABLE_NAME).insert(inputSocial)
  }

  const update = async (
    id: string,
    payload: {
      name: string
      slug: string
      category_id: string
      description: string
      advantage: string
      image: string | null
      socials: Social[]
    },
    file: { path: string; file: File | null },
  ) => {
    const input = {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      advantage: payload.advantage,
      category_id: payload.category_id,
      image: payload.image,
    }

    if (file.file) {
      if (payload.image) {
        await supabase.storage.from(BUCKET_NAME).remove([payload.image])
      }

      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(file.path, file.file)

      if (error) {
        throw error
      }

      input.image = data.path
    }

    await supabase.from(TABLE_NAME).update(input).eq('id', id)
    await supabase.from(SOCIAL_TABLE_NAME).delete().eq('product_id', id)

    let inputSocial: SocialInput[] = []
    for (const social of payload.socials) {
      inputSocial = [
        ...inputSocial,
        {
          product_id: id,
          name: social.name,
          link: social.link,
          embeded_code: social.embeded_code,
        },
      ]
    }

    await supabase.from(SOCIAL_TABLE_NAME).insert(inputSocial)
  }

  const destroy = async (id: string, image: string) => {
    await supabase.storage.from(BUCKET_NAME).remove([image])
    await supabase.from(TABLE_NAME).delete().eq('id', id)

    await supabase.from(SOCIAL_TABLE_NAME).delete().eq('product_id', id)
  }

  return {
    products,
    product,
    isLoading,
    fetch,
    show,
    add,
    update,
    destroy,
  }
})
