import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../../data/Look-alike.json');
const confusingWords = JSON.parse(await readFile(filePath, 'utf8'));

export async function execute(client, event, word) {
  try {
    if (!event?.channel_id) {
      console.error(" Missing event.channel_id:", event);
      return;
    }

    const channel = await client.channels.fetch(event.channel_id);
    const messageFetch = await channel.messages.fetch(event.message_id);

    for (const group of confusingWords) {
      if (group.includes(word)) {
        const related = group.filter(w => w !== word).join(", ");
        return await messageFetch.reply({
          t: ` Words that look like '${word}': ${related}`
        });
      }
    }
    await channel.send({
      t: `Not found '${word}'`
    });

  } catch (error) {
    console.error(" ERROR !", error);
    return;
  }

}
