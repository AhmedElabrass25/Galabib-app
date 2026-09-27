import { z } from 'zod';

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جدًا'),
  phone: z
    .string()
    .min(8, 'رقم الهاتف غير صالح')
    .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط'),
  notes: z.string().max(500, 'الملاحظات طويلة جدًا').or(z.literal('')).optional(),
});

export const orderSchema = z.object({
  customer_id: z.string().min(1, 'يجب اختيار عميل'),
  garment_type: z.enum(['balady', 'afrangy', 'saudi'], {
    errorMap: () => ({ message: 'يجب اختيار نوع الجلابية' }),
  }),
  quantity: z
    .number({ invalid_type_error: 'يجب إدخال عدد صحيح' })
    .min(1, 'العدد يجب أن يكون 1 على الأقل')
    .max(100, 'العدد كبير جدًا'),
  sadary_count: z
    .number({ invalid_type_error: 'يجب إدخال عدد صحيح' })
    .min(0, 'العدد لا يمكن أن يكون سالبًا')
    .default(0),
  delivery_date: z.string().min(1, 'يجب اختيار تاريخ التسليم'),
  notes: z.string().max(500, 'الملاحظات طويلة جدًا').or(z.literal('')).optional(),
});

export const measurementValueSchema = z
  .number({ invalid_type_error: 'يجب إدخال رقم' })
  .positive('القيمة يجب أن تكون أكبر من صفر')
  .max(999, 'القيمة كبيرة جدًا');

export type CustomerFormData = z.infer<typeof customerSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
