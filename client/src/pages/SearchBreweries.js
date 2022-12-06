// Referencing code from Module 21
import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchBreweries } from '../utils/API';
import { saveBreweryIds, getSavedBreweryIds } from '../utils/localStorage';
// Import the `useMutation()` hook from Apollo Client
import { useMutation } from '@apollo/client';
import { SAVE_BREWERY } from '../utils/mutations';

const SearchBreweries = () => {
  // create state for holding returned google api data
  const [searchedBreweries, setSearchedBreweries] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved breweryId values
  const [savedBreweryIds, setSavedBreweryIds] = useState(getSavedBreweryIds());

  // Set up our mutation, option for handling errors not needed
  const [saveBrewery] = useMutation(SAVE_BREWERY);

  // set up useEffect hook to save `savedBreweryIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBreweryIds(savedBreweryIds);
  });

  // create method to search for breweries and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchBreweries(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const items = await response.json();

      const breweryData = items.map((brewery) => ({
        breweryId: brewery.id,
        name: brewery.name,
        breweryType: brewery.brewery_type,
        street: brewery.street,
        city: brewery.city,
        state: brewery.state,
        postalCode: brewery.postal_code,
        country: brewery.country,
        longitude: brewery.longitude,
        latitude: brewery.latitude,
        phone: brewery.phone,
        websiteUrl: brewery.website_url,
      }));

      setSearchedBreweries(breweryData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a brewery to our database
  const handleSaveBrewery = async (breweryId) => {
    // find the breweries in `searchedBreweries` state by the matching id
    const breweryToSave = searchedBreweries.find((brewery) => brewery.breweryId === breweryId);

    try {
      await saveBrewery({ variables: { input: breweryToSave } });

      // if brewery successfully saves to user's account, save brewery id to state
      setSavedBreweryIds([...savedBreweryIds, breweryToSave.breweryId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Breweries!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Enter in a zipcode'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBreweries.length
            ? `Viewing ${searchedBreweries.length} results:`
            : 'Search for a brewery to begin'}
        </h2>
        <CardColumns>
          {searchedBreweries.map((brewery) => {
            return (
              <Card key={brewery.breweryId} border='dark'>
                <Card.Body>
                  <Card.Title>{brewery.name}</Card.Title>
                  <Card.Text>Type: {brewery.breweryType}</Card.Text>
                  <Card.Text>Address: {brewery.street}, {brewery.city}, {brewery.state} {brewery.postal_code}</Card.Text>
                  <Card.Text>Phone: {brewery.phone}</Card.Text>
                  <Card.Text>Latitude: {brewery.latitude || 'N/A'}</Card.Text>
                  <Card.Text>Longitude: {brewery.longitude || 'N/A'}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBreweryIds?.some((savedBreweryId) => savedBreweryId === brewery.breweryId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBrewery(brewery.breweryId)}>
                      {savedBreweryIds?.some((savedBreweryId) => savedBreweryId === brewery.breweryId)
                        ? 'This brewery has already been saved!'
                        : 'Save this Brewery!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBreweries;
