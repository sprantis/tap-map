// Referencing code from Module 21
import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        breweryCount
        savedBreweries {
          breweryId
          name
          breweryType
          street
          city
          state
          postalCode
          country
          longitude
          latitude
          phone
          websiteUrl
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        breweryCount
        savedBreweries {
          breweryId
          name
          breweryType
          street
          city
          state
          postalCode
          country
          longitude
          latitude
          phone
          websiteUrl
        }
      }
    }
  }
`;

export const SAVE_BREWERY = gql`
  mutation saveBrewery($input: BreweryInput) {
    saveBrewery(input: $input) {
      _id
      username
      email
      breweryCount
      savedBreweries {
        breweryId
        name
        breweryType
        street
        city
        state
        postalCode
        country
        longitude
        latitude
        phone
        websiteUrl
      }
    }
  }
`;

export const REMOVE_BREWERY = gql`
  mutation removeBrewery($breweryId: ID!) {
    removeBrewery(breweryId: $breweryId) {
      _id
      username
      email
      breweryCount
      savedBreweries {
        breweryId
        name
        breweryType
        street
        city
        state
        postalCode
        country
        longitude
        latitude
        phone
        websiteUrl
      }
    }
  }
`;
