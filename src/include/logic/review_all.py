# src/include/logic/review_all.py
import json
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

file_path = os.path.normpath(os.path.join(BASE_DIR, '../../data/data_voca.json'))

def review_all(path=file_path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            words = json.load(f)
    except:
        print("Not find file.")
        return

    if not words:
        print("List no member.")
        return

    output = []

    for word in words:
        # output.append(f"{word['name']} ({word['type']}): {word['meaning']} \t\t\t\t VD: {word['example']} \nFre: {word['frequency']} ")
        name = word['name']
        word_type = word['type']
        meaning = word['meaning']
        example = word['example']
        freq = str(word.get('frequency', 0))
        print(f"- {name} ({word_type}) : {meaning} - {example} \nTần suất: {freq}")
    # print("\n".join(output))

if __name__ == "__main__":
    review_all()
