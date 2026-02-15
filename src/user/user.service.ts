import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}
    
    async createUser(registerUserDto: RegisterDto) {
        
        try{        
            return await this.userModel.create({
                fname: registerUserDto.fname,
                lname: registerUserDto.lname,
                email: registerUserDto.email,
                password: registerUserDto.password
            });
        } catch (err) {
            const DUPLICATE_KEY_CODE = 11000;
            if(err.code === DUPLICATE_KEY_CODE){
                const key = Object.keys(err.keyPattern).reduce((a,v) => a = a + ' | ' + v);
                throw new ConflictException(`${key} is already taken`);
            }
            throw err;
        }
    }

    async getUserById(id: string){
        return await this.userModel.findOne({_id: id}).lean()
    }

    async getUserByEmail (email: string){
        try{
            const user = await this.userModel.findOne({email: email}).lean()
            if(!user){
                throw new NotFoundException('User with email not found!')
            }
            return user
        } catch(err){
            throw err
        }
    }
}
