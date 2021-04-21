import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let dayjsDateProvider: DayjsDateProvider;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;

describe('Create Rental', () => {
  const dayAdd24hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car Test',
      description: 'Car Test Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      category_id: 'category-id',
      brand: 'brand',
    });

    const rental = await createRentalUseCase.execute({
      user_id: 'user-id',
      car_id: car.id,
      expected_return_date: dayAdd24hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another opened to the same user', async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: 'Car 1 Test',
      description: 'Car 1 Test Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      category_id: 'category-id',
      brand: 'brand',
    });

    const car2 = await carsRepositoryInMemory.create({
      name: 'Car 2 Test',
      description: 'Car 2 Test Description',
      daily_rate: 100,
      license_plate: 'ABC-4321',
      fine_amount: 40,
      category_id: 'category-id',
      brand: 'brand',
    });

    await createRentalUseCase.execute({
      user_id: 'user-id',
      car_id: car1.id,
      expected_return_date: dayAdd24hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'user-id',
        car_id: car2.id,
        expected_return_date: dayAdd24hours,
      }),
    ).rejects.toEqual(
      new AppError('There is already a rental in progress for this user!'),
    );
  });

  it('should not be able to create a new rental if there is another opened to the same car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car Test',
      description: 'Car Test Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      category_id: 'category-id',
      brand: 'brand',
    });

    await createRentalUseCase.execute({
      user_id: 'user-id-1',
      car_id: car.id,
      expected_return_date: dayAdd24hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: 'user-id-2',
        car_id: car.id,
        expected_return_date: dayAdd24hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: 'user-id-1',
        car_id: 'car-id-1',
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
