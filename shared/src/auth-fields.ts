export const authAdditionalFields = {
  user: {
    role: {
      type: 'string',
      input: true,
      defaultValue: 'viewer',
    },
  },
  session: {
    allowedMutationKinds: {
      type: 'string',
      required: false,
    },
  },
} as const
