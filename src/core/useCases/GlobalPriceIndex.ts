import { inject, injectable } from 'tsyringe';
import { ExchangePort } from '../../interfaces/ExchangePort.js';
import { HuobiExchangeAdapter } from '../../adapters/exchanges/HuobiExchangeAdapter.js';
import { KrakenExchangeAdapter } from '../../adapters/exchanges/KrakenExchangeAdapter.js';

@injectable()
export class GlobalPriceIndexUseCase {
  constructor(
    @inject(HuobiExchangeAdapter) private exchange: ExchangePort
    // @inject(KrakenExchangeAdapter) private exchange: ExchangePort
  ) {}

  async execute(): Promise<number> {
    const exchangePrice = await this.exchange.getMidPrice();
    return exchangePrice;
  }

}
