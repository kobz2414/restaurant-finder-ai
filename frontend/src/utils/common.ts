export const generateGoogleMapsLink = (lat: number, lng: number): string => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

export const separateCapitalizedWords = (openStatus: string): string => {
  if (!openStatus) return '';
  const formattedStatus = openStatus.replace(/([A-Z])/g, ' $1').trim();
  return formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1);
}

export const extractNextLinkHeader = (linkHeader: string): string | null =>{
  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}
