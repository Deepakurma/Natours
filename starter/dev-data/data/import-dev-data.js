import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { Tour } from '../../../model/tourModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // Add this option
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

//read json fiile
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//importing data into the database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tour created successfully');
    process.exit(); // Exit the application
  } catch (err) {
    console.log(err);
  }
};

//deleting all data from collection
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('data deleted successfully');
        process.exit(); // Exit the application if MongoDB connection fails
    }catch(err){
        console.log(err);
    }
};

if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
   deleteData();
}

console.log(process.argv);