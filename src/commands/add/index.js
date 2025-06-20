import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file_path = join(__dirname, '../../../src/include/logic/add_word.py');


export async function execute(client, event, wordEntries) {
  try {
    if (!event?.channel_id) {
      console.error(" Missing event.channel_id:", event);
      return;
    }

    const channel = await client.channels.fetch(event.channel_id);
    const messageFetch = await channel.messages.fetch(event.message_id);

      for (const entry of wordEntries) {
        const parts = entry.split("|");
        if (parts.length !== 4) {
          await messageFetch.reply({ t: `Wrong Form: ${entry}` });
          continue;
        }

        const [name, meaning, example, type] = parts;
     
        exec(`set PYTHONIOENCODING=utf-8 && py ${file_path} "${name}" "${meaning}" "${example}" "${type}"`,
          { shell: true },
          (err, stdout, stderr) => {
            if (stderr || err) {
              messageFetch.reply({ t: `Error add '${name}': ${stderr || err.message}` });
            } else {
              messageFetch.reply({ t: `Added: ${name}` });
            }
          });
      }

  } catch (error) {
    console.error(" ERROR !", error);
    return;
  }
}