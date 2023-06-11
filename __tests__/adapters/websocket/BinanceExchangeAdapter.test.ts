import 'reflect-metadata';
import { container } from 'tsyringe';
import { BinanceExchangeAdapter } from '../../../src/adapters/websocket/BinanceExchangeAdapter.js';
import { ExchangePort } from '../../../src/interfaces/ExchangePort.js';
import { WebSocket } from 'mock-socket';
global.WebSocket = WebSocket;

describe('BinanceExchangeAdapter', () => {
  let binanceAdapter: BinanceExchangeAdapter;

  beforeEach(() => {
    jest.mock('ws');
    container.registerSingleton<ExchangePort>('Exchanges', BinanceExchangeAdapter);
    binanceAdapter = container.resolve(BinanceExchangeAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the correct mid price', async () => {
    // Mock the WebSocket connection
    jest.spyOn(binanceAdapter.socket, 'on');

    // Simulate the 'message' event with sample data
    const mockMessageData = {
      b: ['25756.0'],
      a: ['25758.0']
    };
    binanceAdapter.socket.on.mockImplementation((event: string, callback: (...args: any[]) => void) => {
      if (event === 'message') {
        callback(JSON.stringify(mockMessageData));
      }
    });

    const midPrice = await binanceAdapter.getMidPrice();

    expect(midPrice).toEqual(25757.0);
  });

  test('getMidPrice() should return null when the WebSocket connection is closed', async () => {
    // Mock the WebSocket connection
    jest.spyOn(binanceAdapter.socket, 'readyState', 'get').mockReturnValue(WebSocket.CLOSED);

    const midPrice = await binanceAdapter.getMidPrice();

    expect(midPrice).toBeNull();
  });

});
