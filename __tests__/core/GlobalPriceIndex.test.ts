import 'reflect-metadata';
import { GlobalPriceIndexUseCase } from '../../src/core/useCases/GlobalPriceIndex.js';
import { ExchangePort } from '../../src/interfaces/ExchangePort.js';
import { container } from 'tsyringe';

describe('GlobalPriceIndex Unit Test', () => {
    class MockExchange1 implements ExchangePort {
        async getMidPrice(): Promise<number> {
            return 10000.1;
        }
    }
    
    class MockExchange2 implements ExchangePort {
        async getMidPrice(): Promise<number> {
            return 10000.2;
        }
    }
    
    class MockExchange3 implements ExchangePort {
        async getMidPrice(): Promise<number> {
            return 10000.5;
        }
    }
    beforeEach(() => {
        container.reset()
    });

    test('aggregatePrices() should return the average price in its argument list', async () => {
        const mockExchange1 = container.resolve(MockExchange1);
        container.register<ExchangePort>('Exchanges', { useValue: mockExchange1 });
        const globalPriceIndexUseCase = container.resolve(GlobalPriceIndexUseCase);
        const test1 = [];
        const test2 = [100.3,100.4,100.8,101,105];
        const test3 = [100];
        const result1 = globalPriceIndexUseCase.aggregatePrices(test1);
        const result2 = globalPriceIndexUseCase.aggregatePrices(test2);
        const result3 = globalPriceIndexUseCase.aggregatePrices(test3);
        expect(result1).toEqual(NaN);
        expect(result2).toEqual(101.5);
        expect(result3).toEqual(100);
        
    });
    
    test('execute() should return the average price from exchanges', async () => {
        const mockExchange1 = container.resolve(MockExchange1);
        const mockExchange2 = container.resolve(MockExchange2);
        const mockExchange3 = container.resolve(MockExchange3);
    
        container.register<ExchangePort>('Exchanges', { useValue: mockExchange1 });
        container.register<ExchangePort>('Exchanges', { useValue: mockExchange2 });
        container.register<ExchangePort>('Exchanges', { useValue: mockExchange3 });
    
        const globalPriceIndexUseCase = container.resolve(GlobalPriceIndexUseCase);
        const result = await globalPriceIndexUseCase.execute();
    
        expect(result).toEqual(10000.27);
    });
})






