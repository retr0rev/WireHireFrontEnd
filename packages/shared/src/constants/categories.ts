export const JOB_CATEGORIES = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Support',
  'Data',
  'Finance',
  'People',
  'Other',
] as const

export type JobCategory = (typeof JOB_CATEGORIES)[number]
