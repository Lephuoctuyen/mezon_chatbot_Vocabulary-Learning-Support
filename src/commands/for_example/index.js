import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: "https://api.chatanywhere.tech/v1" 
});


async function getLLMResponse(word) {
  const prompt = `I'm trying to learn how to use the word ${word} in english.
  Please give 2 examples of this word in a sentence to provide better context.
  Do not explain, just give the examples.`;


  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function execute(client, event, word){
    try {
        if(!event?.channel_id){
            console.error("Missing event.channel_id:", event);
            return;
        }

        const channel = await client.channels.fetch(event.channel_id);
        const messageFetch = await channel.messages.fetch(event.message_id);

        const response = await getLLMResponse(word);

        await messageFetch.reply({
            t: `🔍 **Word:** ${word}\n\n **Response:**\n${response}`
        });

    } catch (error) {
        console.error(" Error executing command:", error);
        return;
    }
}
