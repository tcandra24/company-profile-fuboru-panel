<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ComponentInput from '@/components/forms/ComponentInput.vue'
import ComponentEditor from '@/components/forms/ComponentEditor.vue'
import ComponentFile from '@/components/forms/ComponentFile.vue'
import ComponentSelect from '@/components/forms/ComponentSelect.vue'
import ComponentTextArea from '@/components/forms/ComponentTextArea.vue'
import ComponentTable from '@/components/tables/ComponentTable.vue'
// import Youtube from '@/components/ui/Youtube.vue'

import { validationSchema } from '@/schema/master/product'

import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'

import { useCategoryStore } from '@/store/categories'
import { useProductStore } from '@/store/products'
import { useBrandStore } from '@/store/brands'
import { ucwords } from '@/utils/helpers'

type Social = {
  id: string
  name: string
  link: string
  embeded_code: string
}

type Compatible = {
  id: string
  brand_id: string
  types: string
}

type SocialMedia = {
  name: string
}

const currentPageTitle = ref('Create Product')

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    slug: '',
    image: null,
    category_id: '',
    description: '',
    advantage: '',
    socials: [],
    compatibles: [],
  },
})

const { value: name } = useField<string>('name')
const { value: slug } = useField<string>('slug')
const { value: image } = useField<File | null>('image')
const { value: category_id } = useField<string>('category_id')
const { value: description } = useField<string>('description')
const { value: advantage } = useField<string>('advantage')
const { value: socials } = useField<Social[]>('socials')
const { value: compatibles } = useField<Compatible[]>('compatibles')

const storeCategory = useCategoryStore()
const storeBrand = useBrandStore()
const store = useProductStore()

const router = useRouter()

// Social Media
const selectedSocial = ref<string>('instagram')
const socialMedia = ref<string>('')
const isLink = ref(true)

// Compatible Input
const selectedBrand = ref<string>('')
const productType = ref<string>('')

const social_medias = ref<SocialMedia[]>([
  {
    name: 'instagram',
  },
  {
    name: 'youtube',
  },
])

const onSubmit = handleSubmit(async (value, { resetForm }) => {
  try {
    let filePath = ''
    if (value.image) {
      const extImage = value.image?.name.split('.').pop()
      filePath = `image_${Date.now()}.${extImage}`
    }

    await store.add(
      {
        name: value.name,
        slug: value.slug,
        category_id: value.category_id,
        description: value.description,
        advantage: value.advantage,
        socials: value.socials,
        compatibles: value.compatibles,
      },
      { path: filePath, file: image.value },
    )

    router.push({ name: 'master.products.index' })
  } catch (error) {
    console.log(error)
  } finally {
    resetForm()
  }
})

const handleImageChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  if (inputElement.files && inputElement.files.length > 0) {
    image.value = inputElement.files[0]
  } else {
    image.value = null
  }
}

const addSocial = () => {
  socials.value = [
    ...socials.value,
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

const addCompatible = () => {
  compatibles.value = [
    ...compatibles.value,
    {
      id: Date.now() + '',
      brand_id: selectedBrand.value,
      types: productType.value,
    },
  ]

  selectedBrand.value = ''
  productType.value = ''
}

const removeSocial = (id: string) => {
  socials.value = [...socials.value.filter((element) => element.id !== id)]
}

const removeCompatible = (id: string) => {
  compatibles.value = [...compatibles.value.filter((element) => element.id !== id)]
}

onMounted(() => {
  storeCategory.fetch()
  storeBrand.fetch()
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-6">
        <ComponentCard title="Create Product">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <ComponentInput title="Name" v-model="name" :error="errors.name" />

            <ComponentSelect title="Category" v-model="category_id" :error="errors.category_id">
              <template v-for="category of storeCategory.categories" :key="category.id">
                <option :value="category.id">{{ ucwords(category.name) }}</option>
              </template>
            </ComponentSelect>

            <ComponentInput title="Slug" v-model="slug" :error="errors.slug" />

            <ComponentEditor
              title="Description"
              v-model="description"
              :error="errors.description"
            />

            <ComponentEditor title="Advantage" v-model="advantage" :error="errors.advantage" />

            <ComponentFile title="Upload Image" @input="handleImageChange" />

            <Button size="md" variant="primary"> Save </Button>
          </form>
        </ComponentCard>
      </div>
      <div class="col-span-6 flex flex-col gap-4">
        <ComponentCard title="Compatible">
          <div class="flex gap-5">
            <div class="w-1/4">
              <ComponentSelect title="Brand" v-model="selectedBrand" error="">
                <template v-for="brand of storeBrand.brands" :key="brand.id">
                  <option :value="brand.id">{{ ucwords(brand.name) }}</option>
                </template>
              </ComponentSelect>
            </div>
            <div class="w-3/4">
              <ComponentTextArea
                title="Types"
                v-model="productType"
                error=""
                placeholder="e.g Vario,Mio,Ninja"
              />
            </div>
          </div>

          <Button size="md" variant="primary" @click="addCompatible"> Add </Button>

          <div class="my-5">
            <ComponentTable class="my-5">
              <template v-slot:header>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-2/32 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">#</p>
                  </th>
                  <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Brand</p>
                  </th>
                  <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Types</p>
                  </th>
                  <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</p>
                  </th>
                </tr>
              </template>
              <template v-slot:body>
                <tr
                  v-if="compatibles.length > 0"
                  v-for="(compatible, index) in compatibles"
                  :key="compatible.id"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ index + 1 }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                      {{
                        ucwords(
                          storeBrand.brands.find((element) => element.id === compatible.brand_id)!
                            .name,
                        )
                      }}
                    </p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                      {{ compatible.types }}
                    </p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <Button size="sm" variant="outline" @click="removeCompatible(compatible.id)">
                      Delete
                    </Button>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="4" class="px-5 py-4 sm:px-6">
                    <Alert
                      variant="info"
                      title="Empty"
                      message="Compatibles Data is Empty"
                      :showLink="false"
                    />
                  </td>
                </tr>
              </template>
            </ComponentTable>
          </div>
        </ComponentCard>
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
            v-if="socials.length > 0"
            role="list"
            class="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <li v-for="(social, index) in socials" :key="index" class="py-3 sm:py-4">
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
