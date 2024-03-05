// Assuming the JSON data is served from /api/config on your server

// Function to fetch data
export const fetchData = async () => {
  try {
    const response = await fetch('/api/config'); // Adjust the URL as needed
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch data:", error);
    throw error; // Rethrow to let the caller handle it
  }
};
