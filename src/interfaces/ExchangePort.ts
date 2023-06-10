export interface ExchangePort {
  getMidPrice(): Promise<number>;
  calculateMidPrice(bids: Object,asks: Object) : number;
}