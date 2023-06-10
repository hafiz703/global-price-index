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

    // Aggregate the prices from different exchanges (e.g., taking an average)
    const aggregatedPrice = this.aggregatePrices(prices);

    return aggregatedPrice;
  }
  private aggregatePrices(prices: number[]): number {
    // Perform the aggregation logic here (e.g., taking an average)
    const total = prices.reduce((sum, price) => sum + price, 0);
    const average = total / prices.length;
    return parseFloat(average.toFixed(2));
  }

}
