import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAllAvailableCarsDTO } from '@modules/cars/dtos/IFindAllAvailableCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Cars';

import { ICarsRepository } from '../ICarsRepository';

interface ICreateCarInMemoryDTO extends ICreateCarDTO {
  id?: string;
}

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

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
  }: ICreateCarInMemoryDTO): Promise<Car> {
    let car: Car;

    if (id) {
      car = this.cars.find(car => car.id === id);

      car.specifications = specifications;
    } else {
      car = new Car();

      Object.assign(car, {
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        specifications,
      });

      this.cars.push(car);
    }

    return car;
  }

  async findById(car_id: string): Promise<Car> {
    return this.cars.find(car => car.id === car_id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async findAllAvailable({
    category_id,
    name,
    brand,
  }: IFindAllAvailableCarsDTO): Promise<Car[]> {
    let availableCars = this.cars.filter(car => car.available);

    if (category_id) {
      availableCars = availableCars.filter(
        car => car.category_id === category_id,
      );
    }

    if (name) {
      availableCars = availableCars.filter(car => car.name === name);
    }

    if (brand) {
      availableCars = availableCars.filter(car => car.brand === brand);
    }

    return availableCars;
  }
}

export { CarsRepositoryInMemory };
