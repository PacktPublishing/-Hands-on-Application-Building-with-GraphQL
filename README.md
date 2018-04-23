# Hands-on Application Building with GraphQL (and React)

This repository will contain the client and the server code.
Both will always fit together, when you navigate through the git history
for each section. 

---

## Section 1: GraphQL basics

### Video 1.4: Our basic GraphQL schema

```
type Board @model {
    id: ID! @isUnique
    lists: [List!]! @relation(name: "BoardOnList")
    name: String!
}
type List @model {
    board: Board @relation(name: "BoardOnList")
    cards: [Card!]! @relation(name: "CardOnList")
    id: ID! @isUnique
    name: String!
}
type Card @model {
    id: ID! @isUnique
    list: List @relation(name: "CardOnList")
    name: String!
}
```

## Section 2:

Running in Apollo launchpad:

2.1 [coolboard-lists-cards-simple](https://launchpad.graphql.com/nxmqnlj917)

2.2 [coolboard-lists-cards-simple-mocks](https://launchpad.graphql.com/w53zvlpxpz)

2.3 [Trello REST wrapper](https://launchpad.graphql.com/9jl8jr7v4r)
