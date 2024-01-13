import { z } from 'zod';

//define the schema for the body contents
export const SendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
