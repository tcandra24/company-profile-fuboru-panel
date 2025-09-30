<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import ComponentTextArea from '@/components/forms/ComponentTextArea.vue'
import ComponentFile from '@/components/forms/ComponentFile.vue'
import SingleImage from '@/components/ui/images/SingleImage.vue'
import Button from '@/components/ui/Button.vue'

import { useCertificateStore } from '@/store/certificates'

const currentPageTitle = ref('Edit Product')

const store = useCertificateStore()

const router = useRouter()
const route = useRoute()

const { id } = route.params

type Input = {
  name: string
  slug: string
  image: File | null
  description_id: string
  description_en: string
}

const form = reactive<Input>({
  name: '',
  slug: '',
  image: null,
  description_id: '',
  description_en: '',
})

const getCertificate = async (id: string) => {
  await store.show(id)

  form.name = store.certificate?.name ?? ''
  form.slug = store.certificate?.slug ?? ''
  form.description_id = store.certificate?.description_id ?? ''
  form.description_en = store.certificate?.description_en ?? ''
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
        description_id: form.description_id,
        description_en: form.description_en,
        image: store.certificate?.image,
      },
      { path: filePath, file: form.image },
    )

    router.push({ name: 'master.certificates.index' })
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
            <ComponentInput title="Name" v-model="form.name" />

            <ComponentInput title="Slug" v-model="form.slug" />

            <ComponentTextArea
              title="Description ID"
              v-model="form.description_id"
              placeholder="Enter a description ID.."
            />

            <ComponentTextArea
              title="Description EN"
              v-model="form.description_en"
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
            :image="`https://wzsfgaratnngbewlvmqf.supabase.co/storage/v1/object/public/certificate-bucket/${store.certificate?.image}`"
          />
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
