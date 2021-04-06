import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let dayjsDateProvider: DayjsDateProvider;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;

describe('Create Rental', () => {
  const dayAdd24hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
    );
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: 'user-id',
      car_id: 'car-id',
      expected_return_date: dayAdd24hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another opened to the same user', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user-id',
        car_id: 'car-id-1',
        expected_return_date: dayAdd24hours,
      });

      await createRentalUseCase.execute({
        user_id: 'user-id',
        car_id: 'car-id-2',
        expected_return_date: dayAdd24hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another opened to the same car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user-id-1',
        car_id: 'car-id-1',
        expected_return_date: dayAdd24hours,
      });

      await createRentalUseCase.execute({
        user_id: 'user-id-2',
        car_id: 'car-id-1',
        expected_return_date: dayAdd24hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user-id-1',
        car_id: 'car-id-1',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
