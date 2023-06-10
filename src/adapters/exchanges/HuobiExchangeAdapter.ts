import { ExchangePort } from '../../interfaces/ExchangePort.js';
import fetch from 'node-fetch';
import { injectable, registry } from 'tsyringe';

@injectable()
@registry([{ token: 'Exchanges', useClass: HuobiExchangeAdapter }])
export class HuobiExchangeAdapter implements ExchangePort {
  private readonly requestString: string = 'https://api.huobi.pro/market/depth?&depth=5&type=step0&symbol=btcusd';

  async getMidPrice(): Promise<number> {
    const response = await fetch(this.requestString);
    const responseObject = await response.json();

    if (responseObject !== null &&  responseObject['tick'] !== null ) {
        const bids = responseObject['tick']['bids'];
        const asks = responseObject['tick']['asks'];
        return this.calculateMidPrice(bids,asks);
      }

    return null;
  } 

  calculateMidPrice(bids:[string, string], asks: [string, string]){
    const bestBid = parseFloat(bids[0]);
    const bestAsk = parseFloat(asks[0]);
    const midPrice = (bestBid + bestAsk) / 2.0;
    return midPrice;

}

}
