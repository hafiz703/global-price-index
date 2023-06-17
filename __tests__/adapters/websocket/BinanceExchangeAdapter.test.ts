import 'reflect-metadata';
import { BinanceExchangeAdapter } from '../../../src/adapters/websocket/BinanceExchangeAdapter.js';
import *  as WebSocket from 'ws';

jest.mock('ws', () => {
  const mockWebSocket = jest.fn().mockImplementation(() => ({
    readyState: WebSocket.CLOSED,
    send: jest.fn(),
    on: jest.fn(),
    close: jest.fn(),
  }));
  return mockWebSocket;
});

describe('BinanceExchangeAdapter', () => {
  let mockWebSocket: jest.Mocked<WebSocket>;
  let binanceExchangeAdapter: BinanceExchangeAdapter;

  beforeEach(() => {
    mockWebSocket = new WebSocket() as jest.Mocked<WebSocket>;
    binanceExchangeAdapter = new BinanceExchangeAdapter(mockWebSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('constructor() should initialize WebSocket on construction', () => {
    expect(mockWebSocket.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockWebSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
  });

  test('constructor() should subscribe to depth stream on WebSocket open', () => {
    const openCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'open')[1];
    const sendSpy = jest.spyOn(mockWebSocket, 'send');

    openCallback();

    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({ method: 'SUBSCRIBE', params: ['btcusdt@depth'], id: 1 }));
  });

  test('socket.on(msg) should update best bid and best ask on WebSocket message', () => {
    const mockData = JSON.stringify({ b: [1.23], a: [4.56] });
    const messageCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'message')[1];

    messageCallback(mockData);

    expect(binanceExchangeAdapter.getBestBid()).toBe(1.23);
    expect(binanceExchangeAdapter.getBestAsk()).toBe(4.56);
  });

  test('should reset best bid and best ask on WebSocket close', () => {
    const closeCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'close')[1];

    const mockData = JSON.stringify({ b: [10000.23], a: [10000.56] });
    const messageCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'message')[1];
    messageCallback(mockData);

    closeCallback();

    expect(binanceExchangeAdapter.getBestBid()).toBe(0);
    expect(binanceExchangeAdapter.getBestAsk()).toBe(0);
  });

  test('socket.on(error) should handle errors on WebSocket', () => {
    const mockError = new Error('WebSocket error');
    const errorCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'error')[1];
    const consoleErrorSpy = jest.spyOn(console, 'error');

    errorCallback(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('WebSocket error:', mockError);
  });

  test('getMidPrice() should reinitialize WebSocket when getMidPrice is called and WebSocket is closed', async () => {
    // Initialize with random data
    const mockData = JSON.stringify({ b: [10000.23], a: [10000.56] });
    const messageCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'message')[1];
    messageCallback(mockData);
    expect(binanceExchangeAdapter.getBestBid()).toEqual(10000.23)
    expect(binanceExchangeAdapter.getBestAsk()).toEqual(10000.56)

    // Simulate the 'close' event
    const closeCallback = binanceExchangeAdapter.getSocket().on.mock.calls.find(([eventName]) => eventName === 'close')[1];
    binanceExchangeAdapter.getSocket().readyState = jest.fn().mockReturnValue(WebSocket.CLOSED);
    closeCallback();
    expect(binanceExchangeAdapter.getBestBid()).toEqual(0)
    expect(binanceExchangeAdapter.getBestAsk()).toEqual(0)
    await binanceExchangeAdapter.getMidPrice();
    expect(mockWebSocket.on).toHaveBeenCalledWith('open', expect.any(Function));
    // expect(mockWebSocketConstructor).toHaveBeenCalledTimes(1);
  });

  test('getMidPrice() should return null when latest best bid or best ask is 0', async () => {
    binanceExchangeAdapter.getBestBid = jest.fn().mockReturnValue(0);
    binanceExchangeAdapter.getBestAsk = jest.fn().mockReturnValue(0);

    const midPrice = await binanceExchangeAdapter.getMidPrice();

    expect(midPrice).toBeNull();
  });

  test('getMidPrice() should calculate and return the mid price', async () => {
    const mockData = JSON.stringify({ b: [10000.23, 10000.22, 10000.21], a: [10000.56, 10000.57, 10000.58] });
    const messageCallback = mockWebSocket.on.mock.calls.find(([eventName]) => eventName === 'message')[1];
    messageCallback(mockData);

    const midPrice = await binanceExchangeAdapter.getMidPrice();

    expect(midPrice).toBe(10000.395);
  });
});