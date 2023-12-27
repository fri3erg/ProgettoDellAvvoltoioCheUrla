// Updated services file with functions for API calls

// services.js

const BASE_API_URL = 'http://localhost:8000'; // Update with your backend URL

function buildQueryString(params) {
  const queryString = Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');
  return queryString;
}

// Function to make a GET request to the API
async function getData(endpoint, params = {}) {
  try {
    const queryString = buildQueryString(params);
    const response = await fetch(`${BASE_API_URL}${endpoint}?${queryString}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Function to make a POST request to the API
async function postData(endpoint, data = {}) {
  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
}
