#!/usr/bin/python3

import json
import sys

fileName=sys.argv[1]
fileNameEN=""
fileContentEN=""
if len(sys.argv) > 2:
    fileNameEN=sys.argv[2]
fileContent=json.loads(open(fileName,"r").read())
with open(fileName,'w') as f:
    f.write(json.dumps(fileContent,sort_keys=True, indent=4,ensure_ascii=False))

if fileNameEN != "":
    fileContentEN=json.loads(open(fileNameEN,"r").read())
    for key in fileContent:
        print(key)
        if key not in fileContentEN:
            fileContentEN[key]=key
    with open(fileNameEN,'w') as f:
        f.write(json.dumps(fileContentEN,sort_keys=True, indent=4,ensure_ascii=False))

