import sirakIssak from '../src/assets/Sirak Issak.jpg'

// utils/barberImages.js
const barberImages = {
  // Manually map each barber name to their image
  'Sirak Issak': sirakIssak,
  
  // Add all your barbers here
};

export const getBarberImage = (barberName) => {
  return barberImages[barberName] || require('../src/assets/default.jpg');
};

export default barberImages;