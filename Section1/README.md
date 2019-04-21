# Hands-on Application Building with GraphQL

## Section 1: GraphQL basics / Getting Started with GraphQL

### Videos

1. The Course Overview - 00:06:25
1. Comparing GraphQL to REST: Trello Rest API - 00:16:48
1. Starting a Project on Graphcool - 00:03:57
1. Building GraphQL Schema for the project - 00:07:21
1. Working with GraphQL Queries and Types - 00:08:24

### Addons:

Video 1.4: Our basic GraphQL schema

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
