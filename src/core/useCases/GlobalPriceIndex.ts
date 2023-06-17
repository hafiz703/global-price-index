import { injectAll, injectable } from 'tsyringe';
import { ExchangePort } from '../../interfaces/ExchangePort.js';

@injectable()
export class GlobalPriceIndexUseCase {
  constructor(
    @injectAll('Exchanges') private exchanges: ExchangePort[]
  ) {}

  async execute(): Promise<number> {
    const promises: Promise<number | null>[] = [];

    for (const exchange of this.exchanges) {
      promises.push(exchange.getMidPrice());
    }
  
    const prices = await Promise.all(promises);
    const validPrices = prices.filter(price => price !== null) as number[];

    return this.aggregatePrices(validPrices);
  }
  aggregatePrices(prices: number[]): number {
    const total = prices.reduce((sum, price) => sum + price, 0);
    console.info(`Getting average from ${prices.length} exchanges`)
    const average = total / prices.length;
    return parseFloat(average.toFixed(2));
  }

}
