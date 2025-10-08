<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

// import { ucwords } from '@/utils/helpers'

import { useUserStore } from '@/store/users'

const store = useUserStore()

onMounted(() => {
  store.fetch()
})
</script>
<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12">
        <p>Ini Index User</p>
      </div>
    </div>
  </admin-layout>
</template>
