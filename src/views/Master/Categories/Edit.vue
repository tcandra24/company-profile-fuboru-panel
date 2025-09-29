<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import Button from '@/components/ui/Button.vue'

import { useCategoryStore } from '@/store/categories'

const currentPageTitle = ref('Update Category')

const form = reactive({
  name: '',
  slug: '',
})

const store = useCategoryStore()
const router = useRouter()
const route = useRoute()

const { id } = route.params

const onSubmit = async () => {
  try {
    await store.update(id, form)

    router.push({ name: 'master.categories.index' })
  } catch (error) {
    console.log(error)
  }
}

const getCategory = async (id: string) => {
  await store.show(id)

  form.name = store.category.name
  form.slug = store.category.slug
}

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
            <ComponentInput title="Name" v-model="form.name" />

            <ComponentInput title="Slug" v-model="form.slug" />

            <Button size="md" variant="primary"> Update </Button>
          </form>
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
