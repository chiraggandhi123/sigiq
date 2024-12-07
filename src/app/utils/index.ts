
export const mockServer = (mode:string ) => {
  return fetch(`http://localhost:5005/${mode}`)  // API endpoint from your mock server
  .then((response) => response.json())  // Parse JSON data
  .then((data) => (data))      // Set the fetched data to state
  .catch((error) => console.error("Error fetching data:", error));
  };
  