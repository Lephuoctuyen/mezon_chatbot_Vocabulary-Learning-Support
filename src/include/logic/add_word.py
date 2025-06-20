# src/include/logic/add_word.py
import json
import sys
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

file_path = os.path.normpath(os.path.join(BASE_DIR, '../../data/data_voca.json'))

def add_word(name, meaning, example, word_type, path=file_path):
    new_word = {
        "name": name,
        "meaning": meaning,
        "example": example,
        "type": word_type,
        "frequency": 0
    }
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        data = []

    data.append(new_word)

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Added: {name} ")
    

if __name__ == "__main__":
    # if len(sys.argv) != 5:
    #     print("❌ Cần đủ 4 tham số: name, meaning, example, type")
    #     sys.exit(1)
    add_word(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
