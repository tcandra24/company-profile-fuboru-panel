import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const validationSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1, { message: 'This is required' }),
    slug: zod.string().min(1, { message: 'This is required' }),
    image: zod.instanceof(File).nullable(),
    description_id: zod.string().min(1, { message: 'This is required' }),
    description_en: zod.string().min(1, { message: 'This is required' }),
  }),
)
