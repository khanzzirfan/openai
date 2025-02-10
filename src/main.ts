import OpenAI from "openai";
import { getInput, debug, setOutput, setFailed } from "@actions/core";
import { chatSchema, modeSchema } from "./schemas";

export async function run() {
  try {
    const apiKey = getInput("openai-api-key");
    const client = new OpenAI({ apiKey });

    // debug mode
    const inputMode = getInput("openai-mode");
    debug(`Running with mode: ${inputMode}`);

    const modeSafeParseResult = modeSchema.safeParse(inputMode);
    if (!modeSafeParseResult.success) {
      setFailed(`Invalid mode: ${modeSafeParseResult.error}`);
      return;
    }

    const mode = modeSafeParseResult.data;
    debug(`Running in ${mode} mode`);

    const params = JSON.parse(getInput("openai-params"));
    debug(`With params: ${JSON.stringify(params)}`);

    const paramsSafeParseResult = chatSchema.safeParse(params);
    if (!paramsSafeParseResult.success) {
      setFailed(`Invalid params for chat mode: ${paramsSafeParseResult.error}`);
      return;
    }

    const response = await client.chat.completions.create(
      paramsSafeParseResult.data
    );

    const completion = response.choices[0].message?.content ?? "";
    setOutput("completion", completion.trim());
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
