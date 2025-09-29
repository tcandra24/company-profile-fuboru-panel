<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12">
        <Alert
          variant="info"
          title="Welcome"
          :message="`Hi ${storeAuth.user?.name} Welcome`"
          :showLink="false"
        />
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Alert from '@/components/ui/Alert.vue'

import { useAuthStore } from '@/store/auth'

const storeAuth = useAuthStore()
</script>
