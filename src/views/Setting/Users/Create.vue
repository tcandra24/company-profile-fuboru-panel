<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import Button from '@/components/ui/Button.vue'

import { validationSchema } from '@/schema/setting/user'

import { useUserStore } from '@/store/users'

const currentPageTitle = ref('Create User')

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    name: '',
    password: '',
  },
})

const { value: email } = useField<string>('email')
const { value: name } = useField<string>('name')
const { value: password } = useField<string>('password')

const store = useUserStore()
const router = useRouter()

const onSubmit = handleSubmit(async (value, { resetForm }) => {
  try {
    await store.add({ name: value.name, email: value.email, password: value.password })

    router.push({ name: 'setting.users.index' })
  } catch (error) {
    console.log(error)
  } finally {
    resetForm()
  }
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Create User">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Email" v-model="email" :error="errors.email" />

            <ComponentInput title="Name" v-model="name" :error="errors.name" />

            <ComponentInput
              title="Password"
              type="password"
              v-model="password"
              :error="errors.password"
            />

            <Button size="md" variant="primary"> Save </Button>
          </form>
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
