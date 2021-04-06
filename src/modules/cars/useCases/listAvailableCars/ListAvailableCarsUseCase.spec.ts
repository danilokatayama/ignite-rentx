import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('List Available Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to list all available cars', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'Car 1 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 1',
      category_id: 'category-id-1',
    });

    const car2 = await carsRepositoryInMemory.create({
      name: 'Car 2',
      description: 'Car 2 Description',
      daily_rate: 140,
      license_plate: 'ABC-4321',
      fine_amount: 100,
      brand: 'Brand 2',
      category_id: 'category-id-2',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car1, car2]);
  });

  it('should be able to list all available cars by category-id', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'Car 1 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 1',
      category_id: 'category-id-1',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 2',
      description: 'Car 2 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 2',
      category_id: 'category-id-2',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: car1.category_id,
    });

    expect(cars).toEqual([car1]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'Car 1 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 1',
      category_id: 'category-id-1',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 2',
      description: 'Car 2 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 2',
      category_id: 'category-id-2',
    });

    const cars = await listAvailableCarsUseCase.execute({ brand: car1.brand });

    expect(cars).toEqual([car1]);
  });

  it('should be able to list all available cars by name', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 1',
      category_id: 'category-id-1',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 2',
      description: 'Car 2 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Brand 2',
      category_id: 'category-id-2',
    });

    const cars = await listAvailableCarsUseCase.execute({ name: car1.name });

    expect(cars).toEqual([car1]);
  });
});
