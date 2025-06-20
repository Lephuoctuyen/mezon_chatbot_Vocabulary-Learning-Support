## Description
This project supports learning English vocabulary through taking notes on new words and reviewing them on the Mezon platform.
## Create your Mezon application

Visit the [Developers Portal](https://dev-developers.nccsoft.vn/) to create your application.

## Add bot to your clan

Use your install link in a browser to add your bot to your desired clan.

## Installation
1. Clone the repository: 
```bash
$ git clone https://github.com/Lephuoctuyen/mezon_chatbot_Vocabulary-Learning-Support.git
```
2. Navigate to the project directory: 
```bash
cd mezon_chatbot_Vocabulary-Learning-Support
```
3. Copy MEZON_API_KEY in your bot to `.env` and replace it with your bot token.
```bash
MEZON_API_KEY=your_bot_token
OPENAI_API_KEY=your_token
```
## Running the app

```bash
# development
$ npm install
$ npm run start
```
## Usage
1. Add a new word:\
`*add <name>|<meaning>|<example>|<type>`
2. Add many new word:\
`*add <name>|<meaning>|<example>|<type>; *add <name>|<meaning>|<example>|<type>; ...`
The new words are separated by a semicolon.
3. Review all the words that have been added to the list:\
`*review all`
4. Vocabulary guessing practice:\
`*review_quiz1 n`
with n is number of word 
5. Meaning guessing practive:\
`*review_quiz2 n` with n is number of word
6. Support find accuary word\
`*closet_word <wrong_word>`
7. Lookup look-alike word\
`*closet_word <wrong_word>`
8. Lookup synonyms word\
`*synonyms_word <name >`
9. For example from GPT model\
`*for_example <name >`

## Dependencies

### JavaScript (Node.js)

You can install all dependencies with:

```bash
npm install
```

Or manually, if needed:

```bash
npm install dotenv mezon-sdk fastest-levenshtein openai node-fetch express cors node-cron
```

> Dev dependency:

```bash
npm install --save-dev nodemon
```

---

### Python 

Create a `requirements.txt` file with:

```txt
python-dotenv
```

Install via pip:

```bash
pip install -r requirements.txt
```

---


## Project Structure (partial)
```
src/
├── commands/ 
│   ├── add/
│   │   └── index.js
│   ├── closet_word/
│   │   └── index.js
│   ├── for_example/
│   │   └── index.js
│   ├── look_alike/
│   │   └── index.js
│   ├── review/
│   │   └── index.js
│   ├── review_quiz1/
│   │   └── index.js
│   ├── review_quiz2/
│   │   └── index.js
│   └── synonyms_word/
│       └── index.js
├── data/
│   ├── data_voca.json
│   ├── Look-alike.json
│   ├── session.json
│   └── synonyms.json
├── include\logic/
│   ├── add_word.py
│   ├── quiz_mode.py
│   └── review_all.py
.env
.env.example
.gitignore
index.js
package.json
package-lock.json
README.md
tempCodeRunnerFile.js
yarn.lock
```
