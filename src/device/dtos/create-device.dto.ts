import { IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
