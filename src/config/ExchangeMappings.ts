import { HuobiExchangeAdapter } from "../adapters/http/HuobiExchangeAdapter.js";
import { KrakenExchangeAdapter } from "../adapters/http/KrakenExchangeAdapter.js";
import { BinanceExchangeAdapter } from "../adapters/websocket/BinanceExchangeAdapter.js";
import { ExchangePort } from "../interfaces/ExchangePort.js";

export const ExchangeMappings: Record<string, new () => ExchangePort> = {
  Binance: BinanceExchangeAdapter,
  Kraken: KrakenExchangeAdapter,
  Huobi: HuobiExchangeAdapter
};