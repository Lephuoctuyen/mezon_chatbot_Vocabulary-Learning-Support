import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file_path = join(__dirname, '../../../src/include/logic/review_all.py');

export async function execute(client, event) {
  try {
    if (!event?.channel_id) {
      console.error("Missing event.channel_id:", event);
      return;
    }
    
    const channel = await client.channels.fetch(event.channel_id);
    const messageFetch = await channel.messages.fetch(event.message_id);

    exec(`set PYTHONIOENCODING=utf-8 && py ${file_path}`,
        { shell: true },
        (err, stdout, stderr) => {
          if (stderr || err) {
            messageFetch.reply({ t: `Error: ${stderr || err.message}` });
          } else {
            messageFetch.reply({ t: stdout || "No Data!" });
          }
        });

  } catch (error) {
    console.error("ERROR!", error);
    return;
  }
}