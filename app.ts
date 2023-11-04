// app.ts
import express, { Request, Response } from 'express';
import router from './src/routes/api.routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;
import dotenv from 'dotenv';

dotenv.config();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
  useTempFiles:true

}))

const MONGODB_URI=process.env.MONGODB_URI||'';
mongoose.connect(MONGODB_URI, {
  });
  
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });


app.use('/api', router);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// .