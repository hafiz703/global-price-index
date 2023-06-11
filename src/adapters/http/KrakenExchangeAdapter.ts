import fetch from 'node-fetch';
import { injectable, registry } from 'tsyringe';
import { ExchangePortHttp } from '../../interfaces/ExchangePortHttp.js';

@injectable()
@registry([{ token: 'Exchanges', useClass: KrakenExchangeAdapter }])
export class KrakenExchangeAdapter implements ExchangePortHttp {
  private readonly requestString: string = 'https://api.kraken.com/0/public/Depth?count=1&pair=XBTUSD';

  async getOrderBook(): Promise<[string[], string[]]> {
    const response = await fetch(this.requestString);
    const responseObject = await response.json() as {
      result?: { XXBTZUSD?: { bids?: string[], asks?: string[] } }
    };
    const bids = responseObject?.result?.XXBTZUSD?.bids ?? null;
    const asks = responseObject?.result?.XXBTZUSD?.asks ?? null;

    return bids && asks ? [bids, asks] : null;
  }

  calculateMidPrice(bids: string[], asks: string[]): number {
    const bestBid = parseFloat(bids[0]);
    const bestAsk = parseFloat(asks[0]);
    const midPrice = (bestBid + bestAsk) / 2.0;
    return midPrice;

  }

  async getMidPrice(): Promise<number> {
    const [bids, asks] = await this.getOrderBook();
    return bids && asks ? this.calculateMidPrice(bids, asks) : null;
  }

}
