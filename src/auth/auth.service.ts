import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService){}

    async registerUser(registerUserDto: RegisterDto){
        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserDto.password,saltRounds);
        // 1. Check if email already exists
        // 2. hash the password
        // 3. store the user into db
        // 4. generate jwt token
        // 5. send token in response
        const user = await this.userService.createUser({...registerUserDto, password: hash})

        const payload = {sub: user._id, email: user.email, role: user.role};
        const token = await this.jwtService.signAsync(payload);
        return {access_token: token};
    }

    async loginUser(loginUser: LoginDto){
        const {email, password} = loginUser
        const user = await this.userService.getUserByEmail(email)
        
        const matchPassword = await bcrypt.compare(password, user.password)
        if(!matchPassword){
            throw new BadRequestException("Password Incorrect")
        }

        const payload = {sub: user._id, email: user.email, role: user.role};
        const token = await this.jwtService.signAsync(payload);
        return {access_token: token}
    }
}
