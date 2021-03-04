#!/usr/bin/python3

import json
import sys

fileName=sys.argv[1]

fileContent=json.loads(open(fileName,"r").read())

with open(fileName,'w') as f:
    f.write(json.dumps(fileContent,sort_keys=True, indent=4,ensure_ascii=False))

