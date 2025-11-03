import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

interface User {
  name: string
  email: string
}

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const isLoading = ref<boolean>(false)

  const fetch = async () => {
    const { data, error } = await supabase.from('profiles').select()

    if (error) {
      throw error
    }

    users.value = data
  }

  const add = async (payload: { name: string; email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
        },
      },
    })

    if (error) {
      throw error
    }

    return data
  }

  return {
    users,
    isLoading,
    fetch,
    add,
  }
})
