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
  compatible: Compatible[]
}

type BrandType = {
  id: string
  type: string
}

type Brand = {
  id: string
  name: string
}

type ProductBrand = {
  brand_types: BrandType[]
  brands: Brand
}

type Category = {
  name: string
}

interface Compatible {
  id: string
  brand_id: string
  types: string
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

interface ProductBrandInput extends Omit<Compatible, 'id' | 'types'> {
  product_id: string
}

interface BrandTypeInput {
  product_brand_id: string
  type: string
}

const TABLE_NAME = 'products'
const SOCIAL_TABLE_NAME = 'socials'
const PRODUCT_BRAND_TABLE_NAME = 'product_brands'
const BRAND_TYPES_TABLE_NAME = 'brand_types'
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
      .select(
        '*, socials(id, name, link, embeded_code), product_brands( brands ( id, name ), brand_types( id, type ) )',
      )
      .eq('id', id)
      .limit(1)
      .single()

    if (error) {
      throw error
    }

    data.compatible = data.product_brands.map((element: ProductBrand) => {
      const types = element.brand_types.map((type) => type.type)

      return {
        id: element.brands.id + Date.now() + '',
        brand_id: element.brands.id,
        types: types.join(','),
      }
    })

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
      compatibles: Compatible[]
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

    // Social Media
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

    // Product Brand * Brand Type
    let inputProductBrand: ProductBrandInput[] = []
    for (const compatible of payload.compatibles) {
      inputProductBrand = [
        ...inputProductBrand,
        {
          product_id: data?.id,
          brand_id: compatible.brand_id,
        },
      ]
    }

    const { data: dataProductBrands } = await supabase
      .from(PRODUCT_BRAND_TABLE_NAME)
      .insert(inputProductBrand)
      .select()

    const compatibleMap = new Map(payload.compatibles.map((c) => [c.brand_id, c.types.split(',')]))

    const inputBrandType: BrandTypeInput[] = []
    for (const productBrand of dataProductBrands ?? []) {
      const types = compatibleMap.get(productBrand.brand_id)
      if (types) {
        for (const type of types) {
          inputBrandType.push({
            product_brand_id: productBrand.id,
            type,
          })
        }
      }
    }

    await supabase.from(BRAND_TYPES_TABLE_NAME).insert(inputBrandType).select()
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
      compatibles: Compatible[]
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
    // Delete Social Media
    await supabase.from(SOCIAL_TABLE_NAME).delete().eq('product_id', id)

    // Delete Product Brand * Brand Type
    const { data: getProductBrands } = await supabase
      .from(PRODUCT_BRAND_TABLE_NAME)
      .select()
      .eq('product_id', id)

    const productBrandIds = getProductBrands?.map((element) => element.id) ?? []

    await supabase.from(BRAND_TYPES_TABLE_NAME).delete().in('product_brand_id', productBrandIds)
    await supabase.from(PRODUCT_BRAND_TABLE_NAME).delete().eq('product_id', id)

    // Social Media
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

    // Product Brand * Brand Type
    let inputProductBrand: ProductBrandInput[] = []
    for (const compatible of payload.compatibles) {
      inputProductBrand = [
        ...inputProductBrand,
        {
          product_id: id,
          brand_id: compatible.brand_id,
        },
      ]
    }

    const { data: dataProductBrands } = await supabase
      .from(PRODUCT_BRAND_TABLE_NAME)
      .insert(inputProductBrand)
      .select()

    const compatibleMap = new Map(payload.compatibles.map((c) => [c.brand_id, c.types.split(',')]))

    const inputBrandType: BrandTypeInput[] = []
    for (const productBrand of dataProductBrands ?? []) {
      const types = compatibleMap.get(productBrand.brand_id)
      if (types) {
        for (const type of types) {
          inputBrandType.push({
            product_brand_id: productBrand.id,
            type,
          })
        }
      }
    }

    await supabase.from(BRAND_TYPES_TABLE_NAME).insert(inputBrandType).select()
  }

  const destroy = async (id: string, image: string) => {
    const { data: dataProductBrands } = await supabase
      .from(PRODUCT_BRAND_TABLE_NAME)
      .select()
      .eq('product_id', id)

    const productBrandIds = dataProductBrands?.map((element) => element.id) ?? []

    await supabase.storage.from(BUCKET_NAME).remove([image])
    await supabase.from(TABLE_NAME).delete().eq('id', id)

    // Social Media
    await supabase.from(SOCIAL_TABLE_NAME).delete().eq('product_id', id)

    // Product Brand * Brand Type
    await supabase.from(BRAND_TYPES_TABLE_NAME).delete().in('product_brand_id', productBrandIds)
    await supabase.from(PRODUCT_BRAND_TABLE_NAME).delete().eq('product_id', id)
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
