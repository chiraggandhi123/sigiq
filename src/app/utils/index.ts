

const apiUrl = process.env.REACT_APP_MOCK_SERVER_URL;
console.log('api', apiUrl)
export const mockServer = (mode:string ) => {
  
  return fetch(`${apiUrl}/${mode}`)  // API endpoint from your mock server
  .then((response) => response.json())  // Parse JSON data
  .then((data) => (data))      // Set the fetched data to state
  .catch((error) => console.error("Error fetching data:", error));
  };
  