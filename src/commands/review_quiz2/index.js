import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file_path = join(__dirname, '../../../src/include/logic/quiz_mode.py');

export async function execute(client, event, n, userId, readSession, writeSession) {
  try {
    if (!event?.channel_id) {
      console.error("Missing event.channel_id:", event);
      return;
    }
    
    const channel = await client.channels.fetch(event.channel_id);
    const messageFetch = await channel.messages.fetch(event.message_id);

    exec(`set PYTHONIOENCODING=utf-8 && py ${file_path} quiz2 ${n}`,
        { shell: true },
        (err, stdout, stderr) => {
        if (stderr || err) {
            messageFetch.reply({ t: `Error init quiz2: ${stderr || err.message}` });
            return;
        }

        const data = JSON.parse(stdout);
        const session = readSession();
        session[userId] = data;
        writeSession(session);
        console.log(`Session for user ${userId}:`, session[userId]);
        const first = data.words[0];
        messageFetch.reply({
            t: `[1/${data.words.length}]\nNAME: ${first.name}\nEXAMPLE: ${first.example}\nTYPE: ${first.type}\n->ENTER MEANING:`
        });
        });

  } catch (error) {
    console.error("ERROR !", error);
    return;
  }
}