import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }
  async create({
    user_id,
    car_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findOpenedRentalByCar(car_id: string): Promise<Rental> {
    const openedByCar = this.repository.findOne({ car_id });

    return openedByCar;
  }

  async findOpenedRentalByUser(user_id: string): Promise<Rental> {
    const openedByUser = this.repository.findOne({ user_id });

    return openedByUser;
  }
}

export { RentalsRepository };
