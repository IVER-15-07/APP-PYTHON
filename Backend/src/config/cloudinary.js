import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,  // tu cloud name
  api_key: process.env.CLOUDINARY_API_KEY,  // tu api key
  api_secret: process.env.CLOUDINARY_API_SECRET, // tu api secret
});

export default cloudinary;