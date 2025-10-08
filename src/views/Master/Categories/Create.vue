<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
// import { useField, useForm } from 'vee-validate'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import Button from '@/components/ui/Button.vue'

// import { validationSchema } from '@/schema/master/category'

import { useCategoryStore } from '@/store/categories'

const currentPageTitle = ref('Create Category')

// const { handleSubmit, errors } = useForm({
//   validationSchema,
// })

const form = reactive({
  name: '',
  slug: '',
})

// const { value: name } = useField('name')
// const { value: slug } = useField('slug')

const store = useCategoryStore()
const router = useRouter()

const onSubmit = async () => {
  try {
    await store.add(form.name, form.slug)

    router.push({ name: 'master.categories.index' })
  } catch (error) {
    console.log(error)
  }
}
// const onSubmit = handleSubmit(async (value, { resetForm }) => {
//   try {
//     await store.add(value.name, value.slug)

//     router.push({ name: 'master.categories.index' })
//   } catch (error) {
//     console.log(error)
//   } finally {
//     resetForm()
//   }
// })
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Create Category">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Name" v-model="form.name" />

            <ComponentInput title="Slug" v-model="form.slug" />

            <Button size="md" variant="primary"> Save </Button>
          </form>
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
