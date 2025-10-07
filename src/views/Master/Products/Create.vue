<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import ComponentEditor from '@/components/forms/ComponentEditor.vue'
import ComponentFile from '@/components/forms/ComponentFile.vue'
import ComponentSelect from '@/components/forms/ComponentSelect.vue'
// import Youtube from '@/components/ui/Youtube.vue'

import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'

import { useCategoryStore } from '@/store/categories'
import { useProductStore } from '@/store/products'
import { ucwords } from '@/utils/helpers'

const currentPageTitle = ref('Create Product')

const storeCategory = useCategoryStore()
const store = useProductStore()

const router = useRouter()

type Social = {
  id: string
  name: string
  link: string
  embeded_code: string
}

type Input = {
  name: string
  slug: string
  image: File | null
  category_id: string
  description: string
  advantage: string
  socials: Social[]
}

type SocialMedia = {
  name: string
}

const form = reactive<Input>({
  name: '',
  slug: '',
  image: null,
  category_id: '',
  description: '',
  advantage: '',
  socials: [],
})

const selectedSocial = ref<string>('instagram')
const socialMedia = ref<string>('')
const isLink = ref(true)

const social_medias = ref<SocialMedia[]>([
  {
    name: 'instagram',
  },
  {
    name: 'youtube',
  },
])

const onSubmit = async () => {
  try {
    let filePath = ''
    if (form.image) {
      const extImage = form.image?.name.split('.').pop()
      filePath = `image_${Date.now()}.${extImage}`
    }

    await store.add(
      {
        name: form.name,
        slug: form.slug,
        category_id: form.category_id,
        description: form.description,
        advantage: form.advantage,
        socials: form.socials,
      },
      { path: filePath, file: form.image },
    )

    router.push({ name: 'master.products.index' })
  } catch (error) {
    console.log(error)
  }
}

const handleImageChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files && inputElement.files.length > 0) {
    form.image = inputElement.files[0]
  } else {
    form.image = null
  }
}

const addSocial = () => {
  form.socials = [
    ...form.socials,
    {
      id: Date.now() + '',
      name: selectedSocial.value,
      link: isLink.value ? socialMedia.value : '',
      embeded_code: !isLink.value ? socialMedia.value : '',
    },
  ]

  selectedSocial.value = 'instagram'
  socialMedia.value = ''
  isLink.value = true
}

const removeSocial = (id: string) => {
  form.socials = [...form.socials.filter((element) => element.id !== id)]
}

onMounted(() => {
  storeCategory.fetch()
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Create Product">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Name" v-model="form.name" />

            <ComponentSelect title="Category" v-model="form.category_id">
              <template v-for="category of storeCategory.categories" :key="category.id">
                <option :value="category.id">{{ ucwords(category.name) }}</option>
              </template>
            </ComponentSelect>

            <ComponentInput title="Slug" v-model="form.slug" />

            <ComponentEditor title="Description" v-model="form.description" />

            <ComponentEditor title="Advantage" v-model="form.advantage" />

            <ComponentFile title="Upload Image" @input="handleImageChange" />

            <Button size="md" variant="primary"> Save </Button>
          </form>
        </ComponentCard>
      </div>
      <div class="col-span-6 flex flex-col gap-4">
        <ComponentCard title="Socials">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Social Media
            </label>
            <div class="relative">
              <div class="absolute">
                <select
                  v-model="selectedSocial"
                  class="appearance-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
                >
                  <option
                    v-for="social_media in social_medias"
                    :key="social_media.name"
                    :value="social_media.name"
                  >
                    {{ social_media.name }}
                  </option>
                </select>
                <div
                  class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400"
                >
                  <svg
                    class="stroke-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                      stroke=""
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <input
                v-model="socialMedia"
                placeholder="Enter Social Media"
                type="text"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[130px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          <div>
            <label
              for="checkboxLabelTwo"
              class="flex items-center text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400"
            >
              <div class="relative">
                <input type="checkbox" id="checkboxLabelTwo" v-model="isLink" class="sr-only" />
                <div
                  :class="
                    isLink
                      ? 'border-brand-500 bg-brand-500'
                      : 'bg-transparent border-gray-300 dark:border-gray-700'
                  "
                  class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500"
                >
                  <span :class="isLink ? '' : 'opacity-0'">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="white"
                        stroke-width="1.94437"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              Link
            </label>
          </div>

          <Button size="md" variant="primary" @click="addSocial"> Add </Button>
        </ComponentCard>
        <ComponentCard title="List Social">
          <ul
            v-if="form.socials.length > 0"
            role="list"
            class="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <li v-for="(social, index) in form.socials" :key="index" class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {{ social.name }}
                  </p>
                  <div class="my-5" v-if="social.link">
                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                      {{ social.link }}
                    </p>
                  </div>
                  <div class="my-5" v-else>
                    <!-- <Youtube v-if="social.name === 'youtube'" :code="social.embeded_code" />
                    <div v-else v-html="social.embeded_code"></div> -->
                    {{ social.embeded_code }}
                  </div>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white p-5"
                >
                  <Button size="sm" variant="outline" @click="removeSocial(social.id)">
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          </ul>
          <div v-else>
            <Alert variant="info" title="Empty" message="Social Data is Empty" :showLink="false" />
          </div>
        </ComponentCard>
      </div>
    </div>
  </admin-layout>
</template>
