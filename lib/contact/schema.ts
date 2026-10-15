import { z } from "zod";
import {
  contactContent as copy,
  contactPolicy as policy,
} from "@/data/contact";

export const contactFields = z.object({
  name: z
    .string()
    .trim()
    .min(2, copy.errors.name)
    .max(policy.maxName, copy.errors.name)
    .regex(/^[^\x00-\x1f\x7f]+$/, copy.errors.name),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(policy.maxEmail, copy.errors.email)
    .email(copy.errors.email),
  message: z
    .string()
    .trim()
    .min(policy.minMessage, copy.errors.message)
    .max(policy.maxMessage, copy.errors.message),
});
export const contactSchema = contactFields
  .extend({
    website: z.string().max(200).default(""),
    turnstileToken: z.string().max(2048).default(""),
  })
  .strict();
export type ContactFields = z.infer<typeof contactFields>;
export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      (key === "name" || key === "email" || key === "message") &&
      !result[key]
    )
      result[key] = issue.message;
  }
  return result;
}
