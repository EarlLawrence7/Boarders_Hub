const cloudinary = require('cloudinary').v2;

// Set your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dxbkzby8x', // Your Cloudinary cloud name
  api_key: '933198517426599', // Your Cloudinary API key
  api_secret: 'Nd7uMV7FX5yu91LzbQy8aai6viY', // Your Cloudinary API secret
});

// Export the function to be used in your routes
module.exports = {
  cloudinary,
};
