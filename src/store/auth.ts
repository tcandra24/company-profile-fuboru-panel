import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

type User = {
  email: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | User>(null)

  const loadSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user
      ? { email: session.user.email!, name: session.user.user_metadata.name! }
      : null
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      throw error
    }

    await loadSession
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user
      ? { email: session.user.email!, name: session.user.user_metadata.name! }
      : null
  })
  loadSession()
  return {
    user,
    login,
    logout,
    loadSession,
  }
})
