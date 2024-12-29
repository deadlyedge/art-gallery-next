// create a function that takes a URL of an image and use openai to describe the image

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export async function describeImage(imageUrl: string) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that describes images. You should describe the image in a way that is suitable for a social media post. You should also include a hashtag that describes the image.",
      },
      {
        role: "user",
        content: `Describe the image at this URL: ${imageUrl}`,
      },
    ],
  });