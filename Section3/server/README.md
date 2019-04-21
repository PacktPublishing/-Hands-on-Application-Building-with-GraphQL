# Local GraphQL server based on Prisma

To run you local server, you will have to run these commands in a
terminal in this sub-folder (after a `cd server`).

First, you can startup the local database prisma server with `docker-compose up`.

After the usual `npm install` or `yarn`, the prisma tooling is available and can be used with `npx prisma ...`:

`npx prisma deploy`


After having docker started on you local machine and running `docker-compose up`,
you then run `npx prisma deploy` to deploy the schema to the dockerized (mysql) database.

Check it by opening this page in your browser: [http://localhost:4466/](http://localhost:4466/)
