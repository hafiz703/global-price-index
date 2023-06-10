import { inject, injectable } from 'tsyringe';
import { ExchangePort } from '../../interfaces/ExchangePort.js';
import { HuobiExchangeAdapter } from '../../adapters/exchanges/HuobiExchangeAdapter.js';

@injectable()
export class GlobalPriceIndexUseCase {
  constructor(
    @inject(HuobiExchangeAdapter) private huobi: ExchangePort
  ) {}

  async execute(): Promise<number> {
    const huobiPrice = await this.huobi.getMidPrice();
    return huobiPrice;
  }

}
