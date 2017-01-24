#! /bin/bash
netstat -ao | grep 27020 | grep -v grep |awk '{print $5}' | xargs kill -f
mkdir -p data/db
"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath "C:\projects\giving-grid\data\db" --port 27020