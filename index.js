// index.js
import dotenv from "dotenv";
import MezonSDK from "mezon-sdk";
import { readdir } from "fs/promises";
import path from "path";
import { join, dirname } from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";
import fs from "fs";


const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionPath = path.join(__dirname, "src", "data", "session.json");


function readSession() {
  if (!fs.existsSync(sessionPath)) return {};
  const raw = fs.readFileSync(sessionPath, "utf-8");
  return JSON.parse(raw || "{}");
}

function writeSession(data) {
  fs.writeFileSync(sessionPath, JSON.stringify(data, null, 2), "utf-8");
}

dotenv.config();
const { MezonClient } = MezonSDK;

const commands = {};

export async function loadCommands() {
  const commandsPath = join(__dirname, "src/commands");

  const folders = await readdir(commandsPath);
  for (const folder of folders) {
    const commandPath = join(commandsPath, folder);
    const command = await import(pathToFileURL(join(commandPath, "index.js")));
    commands[folder] = command;
  }

}

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN);
  await client.login();

  await loadCommands();

  client.onChannelMessage(async (event) => {
    const userId = event.sender_id;
    const content = event?.content?.t?.trim();
    if (!content?.startsWith("*")) return;
    const firstSpaceIdx = content.indexOf(" ");
    const cmd = content.slice(1, firstSpaceIdx > -1 ? firstSpaceIdx : undefined);
    const word = firstSpaceIdx > -1 ? content.slice(firstSpaceIdx + 1).trim() : "";
    if (commands[cmd]) {
      try {
        if(cmd == "add"){
            const wordEntries = word.split(";").map(entry => entry.trim());
            await commands[cmd].execute(client, event, wordEntries);

        }else if(cmd == "closet_word" || cmd == "look_alike" || cmd == "review" || cmd == "synonyms_word" || cmd == "for_example"){
          await commands[cmd].execute(client, event, word);
        }
        else if (content.startsWith("*review_quiz1") || content.startsWith("*review_quiz2")) {
        const n = parseInt(word) || 3;
        await commands[cmd].execute(client, event, n, userId, readSession, writeSession);
      
      }

        
      } catch (e) {
        console.error("Error executing", cmd, e);
      }
    } else {
      let content_new = content.startsWith("*") ? content.slice(1) : content;

    
      const session = readSession();
      const userSession = session[userId];

      const isInQuizMode = userSession && (userSession.quiz_mode === "quiz1" || userSession.quiz_mode === "quiz2");
      if (!isInQuizMode) return;

      if (!userSession.words || userSession.current_index >= userSession.words.length) return;

      const idx = userSession.current_index;
      const word = userSession.words[idx];


      const currentPrompt = userSession.quiz_mode === "quiz1"
        ? `MEANING: ${word.meaning}\nEXAMPLE: ${word.example}\nTYPE: ${word.type}\n->ENTER WORD:`
        : `NAME: ${word.name}\nEXAMPLE: ${word.example}\nTYPE: ${word.type}\n->ENTER MEANING:`;

      if (content_new.includes("->ENTER") || content_new.includes("Answer is:") || content_new.trim() === '') return;

      const isCorrect = userSession.quiz_mode === "quiz1"
        ? content_new.trim().toLowerCase() === word.name.trim().toLowerCase()
        : content_new.trim().toLowerCase() === word.meaning.trim().toLowerCase();

      const channel = await client.channels.fetch(event.channel_id);
      const messageFetch = await channel.messages.fetch(event.message_id);
      await messageFetch.reply({
        t: isCorrect
          ? ` Correct! (${userSession.quiz_mode === "quiz1" ? word.name : word.meaning})`
          : ` Wrong! Answer is: ${userSession.quiz_mode === "quiz1" ? word.name : word.meaning}`
      });

      userSession.current_index += 1;

      if (userSession.current_index >= userSession.words.length) {
        delete session[userId];
        writeSession(session);
        await messageFetch.reply({ t: "Finished quiz!" });
        return;
      }

      const next = userSession.words[userSession.current_index];
      const prompt = userSession.quiz_mode === "quiz1"
        ? `[${userSession.current_index + 1}/${userSession.words.length}]\nMEANING: ${next.meaning}\nEXAMPLE: ${next.example}\nTYPE: ${next.type}\n->ENTER WORD:`
        : `[${userSession.current_index + 1}/${userSession.words.length}]\nNAME: ${next.name}\nEXAMPLE: ${next.example}\nTYPE: ${next.type}\n->ENTER MEANING:`;

      writeSession(session);
      await messageFetch.reply({ t: prompt });
 
    }
  });


  console.log(" Bot started!");
}

main().catch(console.error);
