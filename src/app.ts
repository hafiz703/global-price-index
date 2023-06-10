import express from 'express';
import 'reflect-metadata';
import { getPriceIndex } from './api/PriceController.js';
import './config/DependencyInjection.js'

const app = express();
app.use(express.json());

app.get('/priceIndex', getPriceIndex);

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});