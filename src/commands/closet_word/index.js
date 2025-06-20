import { closest } from 'fastest-levenshtein';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


// Tra cứu từ hỗn trợ tìm kiếm chính xác: 
// (Thông thường tra cứu sẽ gõ từ đúng hoàn toàn, nhưng trường hợp khi gõ thì bị sai một vài ký tự 
// thì thuật toán levenshtein distance sẽ cho ra đúng hoàn toàn)
export async function execute(client, event, word) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../../data/data_voca.json');
  const rawDict = JSON.parse(await readFile(filePath, 'utf8'));
  try {
    if (!event?.channel_id) {
      console.error("Missing event.channel_id:", event);
      return;
    }

    const channel = await client.channels.fetch(event.channel_id);
    const messageFetch = await channel.messages.fetch(event.message_id);
    
    const vocabList = rawDict.map(entry => entry.name?.trim()).filter(Boolean);
    const suggestion = closest(word, vocabList);
    
    await messageFetch.reply({
      t: ` Closest word to '${word}': **${suggestion}**`,
    });

  } catch (error) {
    console.error(" ERROR !", error);
  }
}
