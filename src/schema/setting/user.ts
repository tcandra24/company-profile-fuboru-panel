import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const validationSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1, { message: 'This is required' }),
    email: zod.string().email().min(1, { message: 'This is required' }),
    password: zod.string().min(1, { message: 'This is required' }),
  }),
)
