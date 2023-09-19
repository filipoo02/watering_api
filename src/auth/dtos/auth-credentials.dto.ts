import { IsString, MinLength, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
    @IsEmail({}, { message: 'auth.errors.email' })
    email: string;
  
    @IsString()
    @MinLength(12, { message: 'auth.errors.too_short' })
    password: string;
}
