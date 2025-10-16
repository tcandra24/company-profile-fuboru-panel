import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

const socialSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  link: zod.string(),
  embeded_code: zod.string(),
})

export const validationSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1, { message: 'This is required' }),
    slug: zod.string().min(1, { message: 'This is required' }),
    image: zod.instanceof(File).nullable(),
    category_id: zod.string().min(1, { message: 'This is required' }),
    description: zod.string().min(1, { message: 'This is required' }),
    advantage: zod.string().min(1, { message: 'This is required' }),
    socials: zod.array(socialSchema),
  }),
)
