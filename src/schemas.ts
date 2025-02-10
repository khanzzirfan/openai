import { z } from "zod";

export const modeSchema = z.enum(["chat", "completion"]);

export const chatSchema = z.object({
  model: z.string().default("gpt-4o"),
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
      name: z.string().optional(),
    })
  ),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  n: z.number().optional(),
  stop: z.string().optional(),
  max_tokens: z.number().optional(),
  presence_penalty: z.number().optional(),
  frequency_penalty: z.number().optional(),
  logit_bias: z.record(z.string(), z.number()).optional(),
  user: z.string().optional(),
});
