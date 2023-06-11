import fetch from 'node-fetch';
import { injectable, registry } from 'tsyringe';
import { ExchangePortHttp } from '../../interfaces/ExchangePortHttp.js';

@injectable()
@registry([{ token: 'Exchanges', useClass: HuobiExchangeAdapter }])
export class HuobiExchangeAdapter implements ExchangePortHttp {
  private readonly requestString: string = 'https://api.huobi.pro/market/depth?&depth=5&type=step0&symbol=btcusdt';
  
  async getOrderBook(): Promise<[string[], string[]]> {
    const response = await fetch(this.requestString);
    const responseObject = await response.json() as { tick?: { bids?: string[]; asks?: string[] } };
  
    const bids = responseObject?.tick?.bids;
    const asks = responseObject?.tick?.asks;
    
    return bids && asks ? [bids, asks] : null;

  }

  calculateMidPrice(bids: string[], asks: string[]){
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
