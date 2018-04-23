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
