// Referencing code from Module 21
import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { removeBreweryId } from '../utils/localStorage';
// Import the `useQuery()` and `useMutation()` hooks from Apollo Client
import { useQuery, useMutation } from '@apollo/client';
// Import the query we are going to execute from its file
import { GET_ME } from '../utils/queries';
import { REMOVE_BREWERY } from '../utils/mutations';

const SavedBreweries = () => {
  // Execute the query on component load
  const { loading, data } = useQuery(GET_ME);
  // Use optional chaining to check if data exists and if it has a me property. If not, return an empty array to use.
  const userData = data?.me || [];

  // Set up our mutation, option for handling errors not needed
  const [removeBrewery] = useMutation(REMOVE_BREWERY);

  // create function that accepts the breweryId value and deletes the brewery from the database
  // On brewery delete, perform mutation and pass in breweryId as argument
  // It is important that the object fields are match the defined parameters in `REMOVE_BREWERY` mutation
  const handleDeleteBrewery = async (breweryId) => {
    try {
      // Pass the `breweryId` URL parameter into query to retrieve this brewery's data
      await removeBrewery({ variables: { breweryId } });
      // upon success, remove brewery's id from localStorage
      removeBreweryId(breweryId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved breweries!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBreweries.length
            ? `Viewing ${userData.savedBreweries.length} saved ${userData.savedBreweries.length === 1 ? 'brewery' : 'breweries'}:`
            : 'You have no saved breweries!'}
        </h2>
        <CardColumns>
          {userData.savedBreweries.map((brewery) => {
            return (
              <Card key={brewery.breweryId} border='dark'>
                <Card.Body>
                  <Card.Title>{brewery.name}</Card.Title>
                  <Card.Text>Type: {brewery.breweryType}</Card.Text>
                  <Card.Text>Address: {brewery.street}, {brewery.city}, {brewery.state} {brewery.postal_code}</Card.Text>
                  <Card.Text>Phone: {brewery.phone}</Card.Text>
                  <Card.Text>Latitude: {brewery.latitude || 'N/A'}</Card.Text>
                  <Card.Text>Longitude: {brewery.longitude || 'N/A'}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBrewery(brewery.breweryId)}>
                    Delete this brewery!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBreweries;
