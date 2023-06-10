import { container } from 'tsyringe';
import { ExchangePort } from '../interfaces/ExchangePort.js';
import { GlobalPriceIndexUseCase } from '../core/useCases/GlobalPriceIndex.js';
import { PriceService } from '../core/services/PriceService.js';
import { HuobiExchangeAdapter } from '../adapters/exchanges/HuobiExchangeAdapter.js';
import { KrakenExchangeAdapter } from '../adapters/exchanges/KrakenExchangeAdapter.js';

// Register dependencies
container.register<ExchangePort>('ExchangePort', { useClass: HuobiExchangeAdapter });
container.register<ExchangePort>('ExchangePort', { useClass: KrakenExchangeAdapter });  
container.registerSingleton(GlobalPriceIndexUseCase);
container.registerSingleton(PriceService);
