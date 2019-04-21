# Trello-REST-Api wrapper - quick start

To run you local server, you will have to run these commands in a
terminal in this sub-folder (after a `cd server`).

You will first need to install all libraries per `npm install` or `yarn`.

## run apollo-express-server

```bash
yarn run start
```
and open [http://localhost:3000/graphiql](http://localhost:3000/graphiql?query=%7B%0A%20%20Member(username%3A%22taco%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20url%0A%20%20%20%20username%0A%20%20%20%20boards%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)
for this query:
```
{
  Member(username:"taco") {
    id
    url
    username
    boards {
      id
      name
    }
  }
}
```

## run express-graphql

```bash
yarn run start-express
```
and open [http://localhost:4000/?query graphiql](http://localhost:4000/?query=%7B%0A%20%20Member(username%3A%22taco%22)%20%0A%20%20%7B%0A%20%20%20%20id%0A%20%20%20%20username%0A%20%20%20%20url%0A%20%20%20%20boards%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A)
   
## run graphql-yoga
```bash
yarn run start-yoga
```
and open [http://localhost:4000/ playground](http://localhost:4000/)

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

