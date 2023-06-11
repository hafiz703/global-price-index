import 'reflect-metadata';
import { GlobalPriceIndexUseCase } from '../../src/core/useCases/GlobalPriceIndex.js';
import { ExchangePort } from '../../src/interfaces/ExchangePort.js';
import { PriceService } from '../../src/core/services/PriceService.js';
import { container } from 'tsyringe';
import { getGlobalPriceIndex } from '../../src/api/PriceController.js';


describe('PriceController Unit Test', () => {
    let req: Request;
    let res: Response;
    const priceIndex = 10000;

    class MockExchange implements ExchangePort {
        async getMidPrice(): Promise<number> {
            // Implement a mock behavior here for testing purposes
            return priceIndex;
        }
    }

    beforeEach(() => {
        container.reset();
        container.registerSingleton<ExchangePort>('Exchanges', MockExchange);

        req = {} as Request;
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return the price index when successful', async () => {
        // Setup dependencies
        const mockGlobalPriceIndexUseCase = container.resolve(GlobalPriceIndexUseCase);
        const priceServiceMock: Partial<PriceService> = {
            getGlobalPriceIndex: jest.fn().mockResolvedValue(priceIndex)
        };

        mockGlobalPriceIndexUseCase.execute = jest.fn().mockResolvedValue(priceIndex);
        container.registerInstance<PriceService>(PriceService, priceServiceMock as PriceService);
        priceServiceMock.getGlobalPriceIndex = jest.fn().mockResolvedValue(priceIndex);

        await getGlobalPriceIndex(req, res);

        expect(priceServiceMock.getGlobalPriceIndex).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ priceIndex });
        expect(res.status).toHaveBeenCalledTimes(0);
    });

    test('should return an error when price index is NaN', async () => {
        // Setup dependencies
        container.resolve(GlobalPriceIndexUseCase);
        const priceServiceMock: Partial<PriceService> = {
            getGlobalPriceIndex: jest.fn().mockResolvedValue(NaN)
        };
        container.registerInstance<PriceService>(PriceService, priceServiceMock as PriceService);

        await getGlobalPriceIndex(req, res);

        expect(priceServiceMock.getGlobalPriceIndex).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ "error": "Error fetching prices" });

    });

    test('should return an error when an exception is thrown', async () => {
        const errorMessage = 'Internal server error';
        container.resolve(GlobalPriceIndexUseCase);

        const priceServiceMock: Partial<PriceService> = {
            getGlobalPriceIndex: jest.fn().mockRejectedValue(new Error(errorMessage))
        };
        container.registerInstance<PriceService>(PriceService, priceServiceMock as PriceService);


        await getGlobalPriceIndex(req, res);

        expect(priceServiceMock.getGlobalPriceIndex).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
});