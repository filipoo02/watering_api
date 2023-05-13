import { IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  address: string;
}
