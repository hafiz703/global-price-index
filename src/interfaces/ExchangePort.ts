export interface ExchangePort {
  getMidPrice(): Promise<number>;
}