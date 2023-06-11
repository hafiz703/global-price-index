import { Request, Response } from 'express';
import { PriceService } from '../core/services/PriceService.js';
import { container } from 'tsyringe';

export async function getGlobalPriceIndex(_req: Request, res: Response): Promise<void> {

  const priceService = container.resolve(PriceService);
  try {
    const priceIndex = await priceService.getGlobalPriceIndex();
    console.log("Global Price Index: " + priceIndex)
    res.json({ priceIndex });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
