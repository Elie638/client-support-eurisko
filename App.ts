import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import userRoutes from './user/routes';


const app = express();

app.use(bodyParser.json());

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017');
        console.log('Connected to the Database');
    } catch (error) {
        console.error("Error while connecting to the database: ", error);
    }
}

connectDB();

app.use(userRoutes);

app.listen(8080);