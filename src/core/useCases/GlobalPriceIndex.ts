import { injectAll, injectable } from 'tsyringe';
import { ExchangePort } from '../../interfaces/ExchangePort.js';

@injectable()
export class GlobalPriceIndexUseCase {
  constructor(
    @injectAll('Exchanges') private exchanges: ExchangePort[]
  ) {}

  async execute(): Promise<number> {
    const prices: number[] = [];

    for (const exchange of this.exchanges) {
      const price= await exchange.getMidPrice();
      if (price !== null) {
        prices.push(price);
      }
    }

    return this.aggregatePrices(prices);
  }
  aggregatePrices(prices: number[]): number {
    const total = prices.reduce((sum, price) => sum + price, 0);
    console.log(prices.length)
    const average = total / prices.length;
    return parseFloat(average.toFixed(2));
  }

}
