import 'reflect-metadata';
import { container } from 'tsyringe';
import { PriceService } from '../../src/core/services/PriceService.js';
import { GlobalPriceIndexUseCase } from '../../src/core/useCases/GlobalPriceIndex.js';
import { ExchangePort } from '../../src/interfaces/ExchangePort.js';

describe('PriceController Unit Test', () => {
    class MockExchange1 implements ExchangePort {
        async getMidPrice(): Promise<number> {
            return 10;
        }
    }
    
    class MockExchange2 implements ExchangePort {
        async getMidPrice(): Promise<number> {
            return 20;
        }
    }
    
    beforeEach(() => {
        container.reset()
    });
    
    test('getGlobalPriceIndex() in priceController should return the value from getGlobalPriceIndex', async () => {
        container.registerSingleton<ExchangePort>('Exchanges', MockExchange1);
        const mockGlobalPriceIndexUseCase = container.resolve(GlobalPriceIndexUseCase);
        mockGlobalPriceIndexUseCase.execute = jest.fn().mockResolvedValue(10);
        const priceService = container.resolve(PriceService);
        const result = await priceService.getGlobalPriceIndex();
        expect(result).toEqual(10);
    });
    
    
    test('getGlobalPriceIndex() in priceController should return the value from getGlobalPriceIndex', async () => {
        container.registerSingleton<ExchangePort>('Exchanges', MockExchange1);
        container.registerSingleton<ExchangePort>('Exchanges', MockExchange2);
        const mockGlobalPriceIndexUseCase = container.resolve(GlobalPriceIndexUseCase);
        mockGlobalPriceIndexUseCase.execute = jest.fn().mockResolvedValue(15);
        const priceService = container.resolve(PriceService);
        const result = await priceService.getGlobalPriceIndex();
        expect(result).toEqual(15);
    });
})





