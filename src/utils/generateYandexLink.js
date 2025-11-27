export const generateLink = (lat, long) => {
    const baseUrl = "https://yandex.com/maps/";
    const query = encodeURIComponent(`${lat},${long}`);
    return `${baseUrl}?text=${query}`;
  };