import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesUseCase } from './UploadImagesUseCase';

interface IMulterRequest extends Request {
  files: any;
}

class UploadCarImagesController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    const { id } = request.params;
    const images = (request as IMulterRequest).files;

    const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);

    const images_name = images.map(file => file.filename);

    await uploadCarImagesUseCase.execute({
      car_id: id,
      images_name,
    });

    return response.status(201).send();
  }
}
export { UploadCarImagesController };
