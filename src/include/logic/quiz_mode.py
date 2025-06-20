import json
import random
import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.normpath(os.path.join(BASE_DIR, '../../data/data_voca.json'))


def init_quiz(mode, n):
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    words = random.sample(data, min(n, len(data)))
    for w in words:
        w["frequency"] = w.get("frequency", 0) + 1

    result = {
        "quiz_mode": mode,
        "words": words,
        "current_index": 0
    }
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    mode = sys.argv[1]
    n = int(sys.argv[2])
    init_quiz(mode, n)
