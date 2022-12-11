// Referencing code from Module 21
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Card, Tooltip } from 'antd';

import Auth from '../../utils/auth';
import { searchBreweries } from '../../utils/API';
import { saveBreweryIds, getSavedBreweryIds } from '../../utils/localStorage';
// Import the `useMutation()` hook from Apollo Client
import { useMutation } from '@apollo/client';
import { SAVE_BREWERY } from '../../utils/mutations';
import './style.css';

const validateMessages = {
  required: '${label} is required!',
};

const SearchBreweries = () => {
  // create state for holding returned google api data
  const [searchedBreweries, setSearchedBreweries] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved breweryId values
  const [savedBreweryIds, setSavedBreweryIds] = useState(getSavedBreweryIds());

  // Set up our mutation, option for handling errors not needed
  const [saveBrewery] = useMutation(SAVE_BREWERY);

  const [form] = Form.useForm();

  // handleKeyUp reference: https://stackoverflow.com/questions/54885046/react-js-the-above-error-occurred-in-the-div-component-there-is-no-error-abov 
  const handleKeyUp = (event) => {
    // Enter
    if (event.keyCode === 13) {
      handleFormSubmit();
    }
  }

  const onFinish = (values) => {
    console.log(values);
  };

  // set up useEffect hook to save `savedBreweryIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBreweryIds(savedBreweryIds);
  });

    // update state based on form input changes
    const handleInputChange = (event) => {
      const inputFieldVal = event.target.value;
      setSearchInput(inputFieldVal);
    };

  // create method to search for breweries and set state on form submit
  const handleFormSubmit = async () => {
    // event.preventDefault();

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
    <div>
      <div className='jumbotron'>
        <Row>
          <Col className='mx-auto'>
            <p className='chalk white-text font-24'>ENTER IN A ZIP CODE!</p>
          </Col>
        </Row>
        <Row>
          <Col span={6} className='search-field ml-auto'>
            <Form
              onKeyUp={handleKeyUp}
              form={form} 
              onFinish={onFinish} 
              validateMessages={validateMessages}
            >
              <Form.Item
                name='zip code'
                rules={[
                  {
                    required: true,
                  },
                ]}
                className='hide'
              />
                <Input
                  onChange={handleInputChange}
                  type='text'
                />
              <Form.Item />
            </Form>
          </Col>
          <Col className='mr-auto'>
            <Button
                type='primary'
                onClick={handleFormSubmit}
                className='search-submit-btn btn-txt'
              >
                Submit
              </Button>
          </Col>
        </Row>
      </div>
      <div className='container'>
        <p className='instruction-container white-text font-24'>
            {searchedBreweries.length
              ? `VIEWING ${searchedBreweries.length} RESULTS(S):`
              : 'SEARCH FOR A BREWERY TO BEGIN'}
          </p>
      </div>
      <div className='container'>
        <Row>
          {searchedBreweries.map((brewery) => {
            return (
              <Col key={brewery.breweryId}>
                {/* headStyle and bodyStyle need to have inline styling object and not a string */}
                <Tooltip
                  placement='topRight'
                  title={brewery.name}
                >
                  <Card 
                    key={brewery.breweryId}
                    title={brewery.name}
                    extra={brewery.latitude ? (
                      <a
                        // https://www.google.com/maps/@LATITUDE,LONGITUDE,ZOOM
                        href={`https://www.google.com/maps/@${brewery.latitude},${brewery.longitude},20z`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <i style={{marginLeft:'20px'}} className="fa-solid fa-location-dot black-link"></i>
                      </a>
                    ) : (
                      <div style={{marginLeft:'20px', fontSize: '15px'}}>N/A</div>
                    )
                    }
                    className='card-style'
                    headStyle={{
                      backgroundColor: '#b76f20',
                      color: 'black',
                    }}
                    bodyStyle={{
                      backgroundColor: '#343a40',
                      color: '#FEDC56',
                      minHeight: '275px'
                    }}
                  >
                    <p className='chalk'>Type: {brewery.breweryType || 'N/A'}</p>
                    <p className='chalk'>Address: {brewery.street}, {brewery.city}, {brewery.state} {brewery.postal_code}</p>
                    <p className='chalk'>Phone: {brewery.phone || 'N/A'}</p>
                    {brewery.websiteUrl ? (
                        <p className= 'chalk'>
                          Website: 
                          <a 
                            href={brewery.websiteUrl}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <i style={{marginLeft:'5px', color: '#FEDC56'}} className="fa-regular fa-window-restore"></i>
                          </a>
                        </p>
                      ) : (
                        <p className='chalk'>Website: N/A</p>
                      )
                    }
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBreweryIds?.some((savedBreweryId) => savedBreweryId === brewery.breweryId)}
                        onClick={() => handleSaveBrewery(brewery.breweryId)}
                        className='btn-txt'
                      >
                        {savedBreweryIds?.some((savedBreweryId) => savedBreweryId === brewery.breweryId)
                          ? 'This brewery has already been saved!'
                          : 'Save this Brewery!'}
                      </Button>
                    )}
                  </Card>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default SearchBreweries;
