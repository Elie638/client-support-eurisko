import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import userRoutes from './user/routes';
import categoryRoutes from './complaint-category/routes';
import complaintRoutes from './complaint/routes'
import { dbURL } from './configs/configs';


const app = express();

app.use(bodyParser.json());

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('Connected to the Database');
    } catch (error) {
        console.error("Error while connecting to the database: ", error);
    }
}

connectDB();

app.use(userRoutes);
app.use('/category', categoryRoutes);
app.use('/complaint', complaintRoutes);

app.listen(8080);