# Local GraphQL server based on Prisma

To run you local server, you will have to run these commands in a
terminal in this sub-folder (after a `cd server`).

Then you will first need to install this library **global** via 
`npm install -g prisma@1.5.3` or 
`yarn global add prisma@1.5.3`.

After having docker started on you local machine and running `prisma local start`,
you then run `prisma deploy` and deploy it _locally_.

Check it by opening this page in your browser: [http://localhost:4466/CoolBoardDB/dev](http://localhost:4466/CoolBoardDB/dev)


# Trello-REST-Api wrapper - quick start

To run you local server, you will have to run these commands in a
terminal in this sub-folder (after a `cd server`).

Then you will first to install all libraries per `npm install` or `yarn`.

## run apollo-express-server

```bash
yarn run start
```
and [open graphiql](http://localhost:3000/graphiql?query=%7B%0A%20%20Member(username%3A%22taco%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20url%0A%20%20%20%20username%0A%20%20%20%20boards%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)

## run express-graphql

```bash
yarn run start-express
```
and [open graphiql](http://localhost:4000/?query=%7B%0A%20%20Member(username%3A%22taco%22)%20%0A%20%20%7B%0A%20%20%20%20id%0A%20%20%20%20username%0A%20%20%20%20url%0A%20%20%20%20boards%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A)
   
## run graphql-yoga
```bash
yarn run start-yoga
```
and [open graphcool playground](http://localhost:4000/)

You can for example run this query:
```
{
  Member(username:"taco") 
  {
    id
    username
    url
    boards {
      id
      name
    }
  }
}
```

