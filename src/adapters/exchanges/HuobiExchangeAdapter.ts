import { ExchangePort } from '../../interfaces/ExchangePort.js';
import fetch from 'node-fetch';
import { injectable, registry } from 'tsyringe';

@injectable()
@registry([{ token: 'Exchanges', useClass: HuobiExchangeAdapter }])
export class HuobiExchangeAdapter implements ExchangePort {
  private readonly apiBaseUrl: string = 'https://api.huobi.pro/market/depth?&depth=5&type=step0&symbol=';
  private pair = "btcusdt";

  async getMidPrice(): Promise<number> {
    const requestString = `${this.apiBaseUrl}${this.pair}`;
    const response = await fetch(requestString);
    const responseObject = await response.json();

    if (responseObject !== null &&  responseObject['tick'] !== null ) {
        const bids = responseObject['tick']['bids'];
        const asks = responseObject['tick']['asks'];
        const bestBid = parseFloat(bids[0]);
        const bestAsk = parseFloat(asks[0]);
        const midPrice = (bestBid + bestAsk) / 2.0;
        return midPrice;
      }

    return null;
  } 

}
