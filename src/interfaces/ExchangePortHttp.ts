import { ExchangePort } from "./ExchangePort.js";

export interface ExchangePortHttp extends ExchangePort {
    calculateMidPrice(bids: string[],asks: string[]) : number;
    getOrderBook() : Promise<[string[], string[]]>;
  }