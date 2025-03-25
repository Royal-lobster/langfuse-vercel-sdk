import { openai } from "@ai-sdk/openai";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { generateText } from "ai";
import dotenv from "dotenv";
import { LangfuseExporter } from "langfuse-vercel";

dotenv.config();

const sdk = new NodeSDK({
	traceExporter: new LangfuseExporter(),
	instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

async function main() {
	const result = await generateText({
		model: openai("gpt-3.5-turbo"),
		maxTokens: 50,
		prompt: "Invent a new holiday and describe its traditions.",
		experimental_telemetry: {
			isEnabled: true,
			functionId: "my-awesome-function",
			metadata: {
				something: "custom",
				someOtherThing: "other-value",
			},
		},
	});

	console.log(result.text);

	await sdk.shutdown(); // Flushes the trace to Langfuse
}

main().catch(console.error);
