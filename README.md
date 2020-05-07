# Blogging-Server
Web Application Project3: Blogging Server on NodeJS and MongoDB
Using NodeJS, Express and MongoDB to implement the website for our markdown-based blogging service that
 1. lets anyone read blogs written by our users through public URLs and
 2. lets our registered users create and update their own blogs after password authentication.

## Files

- Following files are generated with command `express -e blog-server` in given docker container

        blog-server
         +- bin
         +- public
         +- routes
         +- views
         +- package.json
         +- app.js
- `$cd blog-server`
- `$npm install`
- `$DEBUG=blog-server:* npm start`
- Open http://localhost:3000/ in web browser

## Other Files
- db.sh
    - Usage: `$mongo < db.sh`
    - includes the sequence of mongodb shell commands that load the following documents into the two collections, “Posts” and “Users”, in the “BlogServer” database

