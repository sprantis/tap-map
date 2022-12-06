// Referencing code from Module 21
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Input reference: https://graphql.org/graphql-js/mutations-and-input-types/
  input BreweryInput {
    breweryId: ID!
    name: String
    breweryType: String
    street: String
    city: String
    state: String
    postalCode: String
    country: String
    longitude: String
    latitude: String
    phone: String
    websiteUrl: String
  }

  # Define which fields are accessible from the User model
  type User {
    _id: ID
    username: String
    email: String
    breweryCount: Int
    savedBreweries: [Brewery]
  }

  # Define which fields are accessible from the Brewery model
  type Brewery {
    breweryId: ID!
    name: String
    breweryType: String
    street: String
    city: String
    state: String
    postalCode: String
    country: String
    longitude: String
    latitude: String
    phone: String
    websiteUrl: String
  }

  type Auth {
    token: ID!
    user: User
  }

  # Define which queries the front end is allowed to make and what data is returned
  type Query {
    me: User
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBrewery(input: BreweryInput): User
    removeBrewery(breweryId: ID!): User
  }
`;

module.exports = typeDefs;
