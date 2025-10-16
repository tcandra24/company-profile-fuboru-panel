<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import ComponentTextArea from '@/components/forms/ComponentTextArea.vue'
import ComponentFile from '@/components/forms/ComponentFile.vue'
import SingleImage from '@/components/ui/images/SingleImage.vue'
import Button from '@/components/ui/Button.vue'

import { validationSchema } from '@/schema/master/certificate'

import { useCertificateStore } from '@/store/certificates'

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    slug: '',
    image: null,
    description_id: '',
    description_en: '',
  },
})

const router = useRouter()
const route = useRoute()

const { id } = route.params as { id: string }

const { value: name } = useField<string>('name')
const { value: slug } = useField<string>('slug')
const { value: image } = useField<File | null>('image')
const { value: description_id } = useField<string>('description_id')
const { value: description_en } = useField<string>('description_en')

const getCertificate = async (id: string) => {
  await store.show(id)

  name.value = store.certificate?.name ?? ''
  slug.value = store.certificate?.slug ?? ''
  description_id.value = store.certificate?.description_id ?? ''
  description_en.value = store.certificate?.description_en ?? ''
}

const currentPageTitle = ref('Edit Product')
const store = useCertificateStore()

const onSubmit = handleSubmit(async (value, { resetForm }) => {
  try {
    let filePath = ''
    if (image.value) {
      const extImage = image.value?.name.split('.').pop()
      filePath = `image_${Date.now()}.${extImage}`
    }

    await store.update(
      id,
      {
        name: name.value,
        slug: slug.value,
        description_id: description_id.value,
        description_en: description_en.value,
        image: store.certificate?.image ?? null,
      },
      { path: filePath, file: image.value },
    )

    router.push({ name: 'master.certificates.index' })
  } catch (error) {
    console.log(error)
  } finally {
    resetForm()
  }
})

const handleImageChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files && inputElement.files.length > 0) {
    image.value = inputElement.files[0]
  } else {
    image.value = null
  }
}

onMounted(() => {
  getCertificate(id)
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Edit Product">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Name" v-model="name" :error="errors.name" />

            <ComponentInput title="Slug" v-model="slug" :error="errors.slug" />

            <ComponentTextArea
              title="Description ID"
              v-model="description_id"
              :error="errors.description_id"
              placeholder="Enter a description ID.."
            />

            <ComponentTextArea
              title="Description EN"
              v-model="description_en"
              :error="errors.description_en"
              placeholder="Enter a description EN.."
            />

            <ComponentFile title="Upload Image" @input="handleImageChange" />

            <Button size="md" variant="primary"> Save </Button>
          </form>
        </ComponentCard>
      </div>
      <div class="col-span-6">
        <ComponentCard title="Image">
          <SingleImage
            :image="`https://wzsfgaratnngbewlvmqf.supabase.co/storage/v1/object/public/certificate-bucket/${store.certificate?.image ? store.certificate?.image : 'default.webp'}`"
          />
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
