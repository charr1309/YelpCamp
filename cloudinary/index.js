const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//Begin by setting config on cloudinary--using the variables declared in the env file, assign their values in the config--the variable names in the env file are up to you, in the config, however, cloud_name, api_key, and api_secret are mandatory, they must be those variable names--the config is basically associating the accounts with this cloudinary instance

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//next step is to instantiate an instance of cloudinary storage which is imported at the top of this file

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    //need to use params to tell cloudinary to save the files in the yelpcamp folder
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
