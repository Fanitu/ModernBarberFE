import sirakIssak from '../src/assets/Sirak Issak.jpg'
import defaultImage from '../src/assets/default.jpg'

// utils/barberImages.js
const barberImages = {
  // Manually map each barber name to their image
  'Sirak Issak': sirakIssak,
  
  // Add all your barbers here
};

export const getBarberImage = (barberName) => {
  return barberImages[barberName] || defaultImage;
};

export default barberImages;