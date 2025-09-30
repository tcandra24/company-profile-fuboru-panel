<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import ComponentTextArea from '@/components/forms/ComponentTextArea.vue'
import ComponentFile from '@/components/forms/ComponentFile.vue'
import ComponentSelect from '@/components/forms/ComponentSelect.vue'
import SingleImage from '@/components/ui/images/SingleImage.vue'
import Button from '@/components/ui/Button.vue'

import { useCategoryStore } from '@/store/categories'
import { useProductStore } from '@/store/products'
import { ucwords } from '@/utils/helpers'

const currentPageTitle = ref('Edit Product')

const storeCategory = useCategoryStore()
const store = useProductStore()

const router = useRouter()
const route = useRoute()

const { id } = route.params

type Input = {
  name: string
  slug: string
  image: File | null
  category_id: string
  description: string
}

const form = reactive<Input>({
  name: '',
  slug: '',
  image: null,
  category_id: '',
  description: '',
})

const getProduct = async (id: string) => {
  await store.show(id)

  form.name = store.product?.name ?? ''
  form.slug = store.product?.slug ?? ''
  form.category_id = store.product?.category_id ?? ''
  form.description = store.product?.description ?? ''
}

const onSubmit = async () => {
  try {
    let filePath = ''
    if (form.image) {
      const extImage = form.image?.name.split('.').pop()
      filePath = `image_${Date.now()}.${extImage}`
    }

    await store.update(
      id,
      {
        name: form.name,
        slug: form.slug,
        category_id: form.category_id,
        description: form.description,
        image: store.product?.image,
      },
      { path: filePath, file: form.image },
    )

    router.push({ name: 'master.products.index' })
  } catch (error) {
    console.log(error)
  }
}

const handleImageChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files && inputElement.files.length > 0) {
    form.image = inputElement.files[0]
  } else {
    form.image = null
  }
}

onMounted(async () => {
  await storeCategory.fetch()
  await getProduct(id)
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Edit Product">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Name" v-model="form.name" />

            <ComponentSelect title="Category" v-model="form.category_id">
              <template v-for="category of storeCategory.categories" :key="category.id">
                <option :value="category.id">{{ ucwords(category.name) }}</option>
              </template>
            </ComponentSelect>

            <ComponentInput title="Slug" v-model="form.slug" />

            <ComponentTextArea
              title="Description"
              v-model="form.description"
              placeholder="Enter a description.."
            />

            <ComponentFile title="Upload Image" @input="handleImageChange" />

            <Button size="md" variant="primary"> Save </Button>
          </form>
        </ComponentCard>
      </div>
      <div class="col-span-6">
        <ComponentCard title="Image">
          <SingleImage
            :image="`https://wzsfgaratnngbewlvmqf.supabase.co/storage/v1/object/public/product-bucket/${store.product?.image}`"
          />
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
