import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Name',
      description: 'Car Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category-id',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a new car with the same license plate as another', () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Car 1',
        description: 'Car 1 Description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Brand 1',
        category_id: 'category-id',
      });

      await createCarUseCase.execute({
        name: 'Car 2',
        description: 'Car 2 Description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Brand 2',
        category_id: 'category-id',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new car with property 'available' = true by default", async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Name',
      description: 'Car Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category-id',
    });

    expect(car.available).toBe(true);
  });
});
