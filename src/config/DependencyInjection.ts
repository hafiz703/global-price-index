import * as dotenv from 'dotenv'
dotenv.config()
import { container } from 'tsyringe';
import { ExchangePort } from '../interfaces/ExchangePort.js';
import { GlobalPriceIndexUseCase } from '../core/useCases/GlobalPriceIndex.js';
import { PriceService } from '../core/services/PriceService.js';
import { ExchangeMappings } from './ExchangeMappings.js';

// Register dependencies
const supportedExchanges = process.env.SUPPORTED_EXCHANGES.split(",");
console.info(`Env Exchanges: ${supportedExchanges}`);
supportedExchanges.forEach((exchange) => {
  const adapterClass = ExchangeMappings[exchange];
  if (adapterClass) {
    container.registerSingleton<ExchangePort>('Exchanges', adapterClass);
  } else {
    console.warn(`Unsupported exchange: ${exchange}`);
  }
});

container.registerSingleton(GlobalPriceIndexUseCase);
container.registerSingleton(PriceService);
