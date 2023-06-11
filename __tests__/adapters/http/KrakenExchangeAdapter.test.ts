import 'reflect-metadata';
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { KrakenExchangeAdapter } from '../../../src/adapters/http/KrakenExchangeAdapter.js';


describe('KrakenExchangeAdapter Unit Test', () => {
    const sampleBids = [['25755.50', '4.474735', 1686494755], ['25752.66', '0.015128', 1686494755], ['25752.65', '0.155476', 1686494755]];
    const sampleAsks = [['25756.0', '0.111', 1686494755], ['25757.0', '0.01', 1686494755], ['25758.0', '0.111', 1686494755]];
    let krakenExchangeAdapter: KrakenExchangeAdapter;

    beforeEach(() => {
        krakenExchangeAdapter = new KrakenExchangeAdapter();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calculateMidPrice() should calculate the correct mid price', () => {
        const midPrice = krakenExchangeAdapter.calculateMidPrice(sampleBids as unknown as string[], sampleAsks as unknown as string[]);
        expect(midPrice).toEqual(25755.75);

    });

    test('getOrderBook() should handle successful response by returning order book', async () => {
        // Mock the successful response
        // const responseObject = await response.json() as {
        //     result?: { XXBTZUSD?: { bids?: string[], asks?: string[] } }
        //   };
        fetchMock.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                result: { XXBTZUSD: { bids: sampleBids, asks: sampleAsks } }
            }),
        } as unknown as Response);

        const [bids, asks] = await krakenExchangeAdapter.getOrderBook();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(bids).toEqual(sampleBids);
        expect(asks).toEqual(sampleAsks);
    });

    test('getOrderBook() should return null when either bids/asks are null', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                result: { XXBTZUSD: { bids: sampleBids, asks: null } }
            }),
        } as unknown as Response);

        const val = await krakenExchangeAdapter.getOrderBook();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(val).toEqual(null);
    });

    test('getOrderBook() should handle error response', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Failed to fetch order book data'));
        try {
            await krakenExchangeAdapter.getOrderBook();
        } catch (error) {
            expect(error.message).toBe('Failed to fetch order book data');
            return;
        }

        throw new Error('Error should be thrown');
    });

    test('getMidPrice() should handle successful response by returning midPrice', async () => {
        // Mock the successful response
        fetchMock.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                result: { XXBTZUSD: { bids: sampleBids, asks: sampleAsks } }
            }),
        } as unknown as Response);

        const midPrice = await krakenExchangeAdapter.getMidPrice();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(midPrice).toEqual(25755.75);

    });

    test('getMidPrice() should handle return null when orderbook is invalid', async () => {
        krakenExchangeAdapter.getOrderBook = jest.fn().mockResolvedValue(null);
        const midPrice = await krakenExchangeAdapter.getMidPrice();
        expect(midPrice).toEqual(null);

    });
});

