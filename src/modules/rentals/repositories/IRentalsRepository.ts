import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRentalsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findOpenedRentalByCar(car_id: string): Promise<Rental>;
  findOpenedRentalByUser(user_id: string): Promise<Rental>;
}

export { IRentalsRepository };
