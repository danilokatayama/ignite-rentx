import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IFindAllAvailableCarsDTO } from '../dtos/IFindAllAvailableCarsDTO';
import { Car } from '../infra/typeorm/entities/Cars';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findById(car_id: string): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAllAvailable(data: IFindAllAvailableCarsDTO): Promise<Car[]>;
  updateAvailable(id: string, available: boolean): Promise<void>;
}

export { ICarsRepository };
