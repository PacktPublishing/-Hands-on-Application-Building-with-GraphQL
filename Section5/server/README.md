  # Local GraphQL server based on Prisma

To run you local server, you will have to run these commands in a
terminal in this sub-folder (after a `cd server`):

* After having docker running on you local machine, 
you can **start up** the prisma server with `docker-compose up -d`.

* By running `npm install` or `yarn`, the prisma tooling will be installed and available in the next step:

* You then run `npx prisma deploy` to **deploy the schema**.

* Finally, **check** it by opening this page: [http://localhost:4466/](http://localhost:4466/) which shows the graphiql or graphql playground.
---
* Later, you can **stop** the prisma server via `docker-compose stop` , 
`docker-compose kill` ,
  
* For **completely removing** these docker containers you will need to run `docker-compose kill` and `docker-compose rm` which will destroy all its stored data!  
