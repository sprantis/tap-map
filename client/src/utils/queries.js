// Referencing code from Module 21
import { gql } from '@apollo/client';

export const GET_ME = gql`
  # create a GraphQL query to be executed by Apollo Client which returns the logged in user and all their saved breweries
  {
    me {
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
