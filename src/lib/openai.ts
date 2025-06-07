"use server"
// create a function that takes a URL of an image and use openai to describe the image

import OpenAI from "openai"

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY || "my-openai-key", // This is the default and can be omitted
})

export async function describeImage(imageUrl: string) {
	const params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
		model: "gpt-4o-mini",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "You are a Art Connoisseur, use at most 16 words to describe this image.",
					},
					{
						type: "image_url",
						image_url: {
							url: imageUrl,
							detail: "low",
						},
					},
				],
			},
		],
	}
	const response = await client.chat.completions.create(params)
	// console.log(response.choices[0].message)
	return response.choices[0].message.content
}
