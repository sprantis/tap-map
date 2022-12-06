// Referencing code from Module 21
// route to get logged in user's info (needs the token)
export const getMe = (token) => {
    return fetch('/api/users/me', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
  };
  
  export const createUser = (userData) => {
    return fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  };
  
  // remove saved brewery data for a logged in user
  export const deleteBrewery = (breweryId, token) => {
    return fetch(`/api/users/breweries/${breweryId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };
  
  // make a search to open brewery db
  // https://api.openbrewerydb.org/breweries?by_postal=03820&per_page=10
  export const searchBreweries = (query) => {
    return fetch(`https://api.openbrewerydb.org/breweries?by_postal=${query}&per_page=10`);
  };
  