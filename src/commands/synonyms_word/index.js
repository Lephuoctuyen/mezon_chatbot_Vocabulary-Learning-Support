import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../../data/synonyms.json');
const synonyms = JSON.parse(await readFile(filePath, 'utf8'));

export async function execute(client, event, word) {
  try{
    if (!event?.channel_id) {
      console.error(" Missing event.channel.id:", event);
      return;
    }
    const channel = await client.channels.fetch(event.channel_id);
    const messageFetch = await channel.messages.fetch(event.message_id);

    const entry = synonyms.find(item => item.word.toLowerCase() === word);

    if (entry) {
      await messageFetch.reply({
        t: ` **${entry.word}**\n\n Synonyms: ${entry.synonyms.join(", ")}\n Meanings: ${entry.meanings.join("; ")}`
      });
    } else {
      const baseURL = "https://api.datamuse.com/words";

      const lower = word.toLowerCase();
      const synRes = await fetch(`${baseURL}?rel_syn=${lower}`);
      const synJson = await synRes.json();
      const fetchedSynonyms = synJson.map(item => item.word);
      await messageFetch.reply({
        t: ` **${word}**\n\n Synonyms: ${fetchedSynonyms.join(", ")}\n`
      });
    }
  } catch (error) {
    console.error("ERROR", error);
    return;
  }
}


