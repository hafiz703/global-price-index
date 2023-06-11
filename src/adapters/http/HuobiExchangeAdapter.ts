import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { ExchangePortHttp } from '../../interfaces/ExchangePortHttp.js';

@injectable()
export class HuobiExchangeAdapter implements ExchangePortHttp {
  private readonly requestString: string = 'https://api.huobi.pro/market/depth?&depth=5&type=step0&symbol=btcusdt';

  async getOrderBook(): Promise<[string[], string[]]> {
    const response = await fetch(this.requestString);
    if (!response.ok) {
      console.error('Failed to fetch order book data');
      return null;
    }
    try {
      const responseObject = await response.json() as { tick?: { bids?: string[]; asks?: string[] } };

      const bids = responseObject?.tick?.bids;
      const asks = responseObject?.tick?.asks;

      return bids && asks ? [bids, asks] : null;

    } catch (error) {
      console.error('Error parsing order book data:', error);
    }

    return null;
  }

  calculateMidPrice(bids: string[], asks: string[]) {
    const bestBid = parseFloat(bids[0]);
    const bestAsk = parseFloat(asks[0]);
    const midPrice = (bestBid + bestAsk) / 2.0;
    return midPrice;

  }

  async getMidPrice(): Promise<number> {
    const orders = await this.getOrderBook();
    if (orders === null){
      return null;
    }
    const [bids, asks] = orders;
    return this.calculateMidPrice(bids, asks);
  }

}
