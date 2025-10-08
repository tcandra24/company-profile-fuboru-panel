<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import Swal from 'sweetalert2'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import SingleImage from '@/components/ui/images/SingleImage.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentTable from '@/components/tables/ComponentTable.vue'
import Button from '@/components/ui/Button.vue'
import { PlusIcon } from '@/icons'

import { ucwords } from '@/utils/helpers'

import { useCertificateStore } from '@/store/certificates'

const currentPageTitle = ref('Certificates')

const store = useCertificateStore()

const fetchProducts = async () => {
  try {
    await store.fetch()
  } catch (error) {
    console.log(error)
  }
}

const handleDestroy = async (id: string, image: string) => {
  const theme = document.documentElement.classList

  Swal.fire({
    title: 'Are you sure?',
    text: 'Delete This Data!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    theme: theme.contains('dark') ? 'dark' : 'light',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await store.destroy(id, image)
      await store.fetch()
    }
  })
}

onMounted(() => {
  fetchProducts()
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="List Certificates">
        <router-link :to="{ name: 'master.certificates.create' }">
          <Button size="md" :startIcon="PlusIcon" variant="primary"> Add </Button>
        </router-link>
        <ComponentTable class="my-5">
          <template v-slot:header>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left w-2/32 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
              </th>
              <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Image</p>
              </th>
              <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Slug</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Description ID
                </p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Description EN
                </p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</p>
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
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="h-3 bg-gray-300 rounded-sm dark:bg-gray-700 w-12 animate-pulse"></div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(certificate, index) in store.certificates"
              :key="certificate.id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <SingleImage
                  class="w-64 object-cover"
                  :image="`https://wzsfgaratnngbewlvmqf.supabase.co/storage/v1/object/public/certificate-bucket/${certificate.image}`"
                />
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                  {{ ucwords(certificate.name) }}
                </p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ certificate.slug }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                  {{ certificate.description_id }}
                </p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                  {{ certificate.description_en }}
                </p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <Menu as="div" class="relative inline-block">
                  <MenuButton
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-white/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-xs inset-ring-1 inset-ring-gray-300 dark:inset-ring-white/5 hover:bg-gray-50 dark:hover:bg-white/20"
                  >
                    <EllipsisVerticalIcon class="size-5 text-gray-400" aria-hidden="true" />
                  </MenuButton>

                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg outline-1 outline-black/5 dark:-outline-offset-1 dark:outline-white/10"
                    >
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                          <router-link
                            :to="{
                              name: 'master.certificates.edit',
                              params: { id: certificate.id },
                            }"
                            :class="[
                              active
                                ? 'bg-gray-100 dark:bg-white/5 dark:text-white text-gray-900 outline-hidden'
                                : 'text-gray-700 dark:text-gray-300',
                              'block px-4 py-2 text-sm',
                            ]"
                          >
                            Edit
                          </router-link>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button
                            @click="handleDestroy(certificate.id, certificate.image)"
                            :class="[
                              active
                                ? 'bg-gray-100 dark:bg-white/5 dark:text-white text-gray-900 outline-hidden'
                                : 'text-gray-700 dark:text-gray-300',
                              'block px-4 py-2 text-sm',
                            ]"
                          >
                            Delete
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </td>
            </tr>
          </template>
        </ComponentTable>
      </ComponentCard>
    </div>
  </admin-layout>
</template>
