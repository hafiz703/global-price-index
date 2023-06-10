import { ExchangePort } from '../../interfaces/ExchangePort.js';
import fetch from 'node-fetch';
import { injectable, registry } from 'tsyringe';

@injectable()
@registry([{ token: 'Exchanges', useClass: KrakenExchangeAdapter }])
export class KrakenExchangeAdapter implements ExchangePort {
  private readonly requestString: string = 'https://api.kraken.com/0/public/Depth?count=1&pair=XBTUSD';

  async getMidPrice(): Promise<number> {
    const response = await fetch(this.requestString);
    const responseObject = await response.json();
    console.log(responseObject);
    if (responseObject !== null &&  responseObject['result'] !== null && responseObject['XXBTZUSD'] !== null) {
        const bids = responseObject['result']['XXBTZUSD']['bids'];
        const asks = responseObject['result']['XXBTZUSD']['asks'];
        return this.calculateMidPrice(bids,asks);
      }

    return null;
  }

  calculateMidPrice(bids:[string, string, string], asks: [string, string, string]){
        const bestBid = parseFloat(bids[0]);
        const bestAsk = parseFloat(asks[0]);
        const midPrice = (bestBid + bestAsk) / 2.0;
        return midPrice;

  }

}
