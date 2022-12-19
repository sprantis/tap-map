// Referencing code from Module 21
import React from 'react';
import { Button, Row, Col, Card, Tooltip } from 'antd';

import { removeBreweryId } from '../../utils/localStorage';
// Import the `useQuery()` and `useMutation()` hooks from Apollo Client
import { useQuery, useMutation } from '@apollo/client';
// Import the query we are going to execute from its file
import { GET_ME } from '../../utils/queries';
import { REMOVE_BREWERY } from '../../utils/mutations';
import './style.css';
import App from './rating';
import { createRoot } from 'react-dom/client';


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
      <br />
      <br />
      <div className='container'>
        <p className='instruction-container white-text font-24'>
          {userData.savedBreweries.length
            ? `VIEWING ${userData.savedBreweries.length} SAVED ${userData.savedBreweries.length === 1 ? 'BREWERY' : 'BREWERIES'}:`
            : 'YOU HAVE NO SAVED BREWERIES!'}
        </p>
      </div>
      <div className='container'>
        <Row>
          {userData.savedBreweries.map((brewery) => {
            return (
              <Col key={brewery.breweryId}>
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
                    <div id="star">
                    (<App />)
                    </div>
                    
                    
                    <Button 
                      onClick={() => handleDeleteBrewery(brewery.breweryId)}
                      className='btn-txt'
                    >
                      DELETE THIS BREWERY!
                    </Button>
                  </Card>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};

export default SavedBreweries;
