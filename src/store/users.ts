import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
// import { ref } from 'vue'

export const useUserStore = defineStore('users', () => {
  const fetch = async () => {
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers()

    if (error) {
      throw error
    }

    console.log(users)
  }

  const add = async (payload: { name: string; email: string; password: string }) => {
    await supabase.auth.admin.createUser({
      email: payload.name,
      password: payload.email,
      user_metadata: { name: payload.name },
    })
  }

  const destroy = async (id: string) => {
    await supabase.auth.admin.deleteUser(id)
  }

  return {
    fetch,
    add,
    destroy,
  }
})
