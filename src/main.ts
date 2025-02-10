import OpenAI from "openai";
import { getInput, debug, setOutput, setFailed } from "@actions/core";
import { chatSchema } from "./schemas";

export async function run() {
  try {
    const apiKey = getInput("openai-api-key");
    const client = new OpenAI({ apiKey });

    // Debug mode
    debug(`Running chat completion mode`);

    const params = JSON.parse(getInput("openai-params"));
    debug(`With params: ${JSON.stringify(params)}`);

    const paramsSafeParseResult = chatSchema.safeParse(params);
    if (!paramsSafeParseResult.success) {
      setFailed(`Invalid params for chat mode: ${paramsSafeParseResult.error}`);
      return;
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      store: true,
      messages: paramsSafeParseResult.data.messages,
    });

    const completion = response.choices[0].message?.content ?? "";
    setOutput("completion", completion.trim());
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
