import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

type Certificate = {
  id: string
  name: string
  image: string
  description_id: string
  description_en: string
  slug: string
}

const TABLE_NAME = 'certificates'
const BUCKET_NAME = 'certificate-bucket'

export const useCertificateStore = defineStore('certificates', () => {
  const certificates = ref<Certificate[]>([])
  const certificate = ref<Certificate>()
  const isLoading = ref<boolean>(false)

  const fetch = async () => {
    isLoading.value = true
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    certificates.value = data
    isLoading.value = false
  }

  const show = async (id: string) => {
    const { data, error } = await supabase.from(TABLE_NAME).select().eq('id', id).limit(1).single()

    if (error) {
      throw error
    }

    certificate.value = data
  }

  const add = async (
    payload: {
      name: string
      slug: string
      description_id: string
      description_en: string
    },
    file: { path: string; file: File | null },
  ) => {
    const input = {
      name: payload.name,
      slug: payload.slug,
      description_id: payload.description_id,
      description_en: payload.description_en,
      image: '',
    }

    if (file.file) {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(file.path, file.file)

      if (error) {
        throw error
      }

      input.image = data.path
    }

    await supabase.from(TABLE_NAME).insert(input)
  }

  const update = async (
    id: string,
    payload: {
      name: string
      slug: string
      description_id: string
      description_en: string
      image: string | null
    },
    file: { path: string; file: File | null },
  ) => {
    const input = {
      name: payload.name,
      slug: payload.slug,
      description_id: payload.description_id,
      description_en: payload.description_en,
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
  }

  const destroy = async (id: string, image: string) => {
    await supabase.storage.from(BUCKET_NAME).remove([image])
    await supabase.from(TABLE_NAME).delete().eq('id', id)
  }

  return {
    certificates,
    certificate,
    isLoading,
    fetch,
    show,
    add,
    update,
    destroy,
  }
})
