export const searchLocation = async (query) => {
  try {
    const response = await fetch(
      `${process.env.API_SEARCH_URL}?q=${query}&limit=5&appid=${process.env.API_KEY}`
    );

    return await response.json();
  } catch (error) {
    return error;
  }
};
