import 'reflect-metadata';
import './config/DependencyInjection.js'
import express from 'express';
import { getGlobalPriceIndex } from './api/PriceController.js';
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(express.json());

app.get('/v1/global-price-index', getGlobalPriceIndex);
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});