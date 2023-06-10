import { inject, injectable } from 'tsyringe';
import { GlobalPriceIndexUseCase } from '../useCases/GlobalPriceIndex.js';

@injectable()
export class PriceService {
  constructor(
    @inject(GlobalPriceIndexUseCase) private globalPriceIndexUseCase: GlobalPriceIndexUseCase) {}

  async getGlobalPriceIndex(): Promise<number> {
    const globalPriceIndex = await this.globalPriceIndexUseCase.execute();
    return globalPriceIndex;
  }
}
