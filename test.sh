#!/bin/bash

# curl -H "Content-Type: text/html" `#-H -> header, json data` \
#     --data '{"body":"mybody","title":"mytitle"}' `#--data -> request body -> implies POST method` \
#     http://localhost:3000/api/cs144/3
#
curl -H "Content-Type: application/json" `#-H -> header, json data` \
    --data '{"body":"mybody","title":"mytitle"}' `#--data -> request body -> implies POST method` \
    http://localhost:3000/api/cs144/3

# curl -H "Content-Type: application/json" `#-H -> header, json data` \
#     --data '' `#--data -> request body -> implies POST method` \
#     http://localhost:3000/api/cs144/3
