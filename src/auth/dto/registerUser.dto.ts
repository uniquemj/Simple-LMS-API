import {IsEmail, IsString, IsStrongPassword} from 'class-validator'

export class RegisterDto {
    @IsString()
    fname: string;

    @IsString()
    lname: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class LoginDto{
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}