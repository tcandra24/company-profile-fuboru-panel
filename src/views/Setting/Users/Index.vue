<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentTable from '@/components/tables/ComponentTable.vue'
import Button from '@/components/ui/Button.vue'
import { PlusIcon } from '@/icons'

import { useUserStore } from '@/store/users'
import { ucwords } from '@/utils/helpers'

const currentPageTitle = ref('Users')

const store = useUserStore()

const fetchUsers = async () => {
  try {
    await store.fetch()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="List Users">
        <router-link :to="{ name: 'setting.users.create' }">
          <Button size="md" :startIcon="PlusIcon" variant="primary"> Add </Button>
        </router-link>
        <ComponentTable class="my-5">
          <template v-slot:header>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left w-2/32 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
              </th>
              <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
              </th>
              <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</p>
              </th>
            </tr>
          </template>
          <template v-slot:body>
            <tr v-if="store.isLoading" v-for="index in 10" :key="index">
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(user, index) in store.users"
              :key="user.name"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                {{ user.email }}
              </td>
              <td class="px-5 py-4 sm:px-6">
                {{ ucwords(user.name) }}
              </td>
            </tr>
          </template>
        </ComponentTable>
      </ComponentCard>
    </div>
  </admin-layout>
</template>
