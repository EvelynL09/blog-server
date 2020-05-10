#!/bin/bash

# curl -H "Content-Type: text/html" `#-H -> header, json data` \
#     --data '{"body":"mybody","title":"mytitle"}' `#--data -> request body -> implies POST method` \
#     http://localhost:3000/api/cs144/3
#
curl -H "Content-Type: application/json" `#-H -> header, json data` \
    --data '{"body":"- Db - x 1.x 2.**sd**","title":"### mytitle"}' `#--data -> request body -> implies POST method` \
    http://localhost:3000/api/cs144/3
# curl -X POST http://localhost:3000/login?username=cs144&password=password
# curl -H "Content-Type: application/json" `#-H -> header, json data` \
#     -c cookiejar \
#     --data '{"username":"cs144","password":"password"}' `#--data -> request body -> implies POST method` \
#     http://localhost:3000/login \
# && curl -X DELETE `#-X -> delete method` \
#     -c cookiejar \
#     -u cs144:password http://localhost:3000/api/cs144/1
#
# curl -X DELETE `#-X -> delete method` \
#     http://localhost:3000/api/cs144/1

# curl -H "Content-Type: application/json" `#-H -> header, json data` \
#     --data '' `#--data -> request body -> implies POST method` \
#     http://localhost:3000/api/cs144/3

# curl -X PUT \
#     -H "Content-Type: application/json" `#-H -> header, json data` \
#     --data '{"body":"mybody","title":"mytitle"}' `#--data -> request body -> implies POST method` \
#     http://localhost:3000/api/cs144/3
