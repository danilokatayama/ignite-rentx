import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAllAvailableCarsDTO } from '@modules/cars/dtos/IFindAllAvailableCarsDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Cars';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    await this.repository.save(car);

    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.repository.findOne(id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.repository.findOne({ license_plate });
  }

  async findAllAvailable({
    category_id,
    name,
    brand,
  }: IFindAllAvailableCarsDTO): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder()
      .where('available = :available', { available: true });

    if (category_id) {
      carsQuery.andWhere('category_id = :category_id', { category_id });
    }

    if (name) {
      carsQuery.andWhere('name = :name', { name });
    }

    if (brand) {
      carsQuery.andWhere('brand = :brand', { brand });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }
}

export { CarsRepository };
