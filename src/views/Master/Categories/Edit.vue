<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import Button from '@/components/ui/Button.vue'

import { validationSchema } from '@/schema/master/category'

import { useCategoryStore } from '@/store/categories'

const currentPageTitle = ref('Update Category')

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    slug: '',
  },
})

const { value: name } = useField<string>('name')
const { value: slug } = useField<string>('slug')

const store = useCategoryStore()
const router = useRouter()
const route = useRoute()

const { id } = route.params as { id: string }

const getCategory = async (id: string) => {
  await store.show(id)

  name.value = store.category?.name ?? ''
  slug.value = store.category?.slug ?? ''
}

const onSubmit = handleSubmit(async (value, { resetForm }) => {
  try {
    await store.update(id, { name: value.name, slug: value.slug })

    router.push({ name: 'master.categories.index' })
  } catch (error) {
    console.log(error)
  } finally {
    resetForm()
  }
})

onMounted(() => {
  getCategory(id)
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Update Category">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Name" v-model="name" :error="errors.name" />

            <ComponentInput title="Slug" v-model="slug" :error="errors.slug" />

            <Button size="md" variant="primary"> Update </Button>
          </form>
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
