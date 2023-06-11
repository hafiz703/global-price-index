import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { ExchangePortHttp } from '../../interfaces/ExchangePortHttp.js';

@injectable()
export class KrakenExchangeAdapter implements ExchangePortHttp {
  private readonly requestString: string = 'https://api.kraken.com/0/public/Depth?count=1&pair=XBTUSD';

  async getOrderBook(): Promise<[string[], string[]]> {
    const response = await fetch(this.requestString);
    if (!response.ok) {
      console.error('Failed to fetch order book data');
      return null;
    }
    try {
      const responseObject = await response.json() as {
        result?: { XXBTZUSD?: { bids?: string[], asks?: string[] } }
      };
      const bids = responseObject?.result?.XXBTZUSD?.bids ?? null;
      const asks = responseObject?.result?.XXBTZUSD?.asks ?? null;
      return bids && asks ? [bids, asks] : null;

    } catch (error) {
      console.error('Error parsing order book data:', error);
    }


    return null;
  }

  calculateMidPrice(bids: string[], asks: string[]): number {
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
