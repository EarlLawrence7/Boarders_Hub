const cloudinary = require('cloudinary').v2;

// Set your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dxbkzby8x', // Replace with your Cloudinary cloud name
  api_key: '933198517426599',       // Replace with your API key
  api_secret: 'Nd7uMV7FX5yu91LzbQy8aai6viY', // Replace with your API secret
});

module.exports = cloudinary;
