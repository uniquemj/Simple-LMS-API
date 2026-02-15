import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {Request} from 'express';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly jwtService: JwtService){}

    async canActivate(context: ExecutionContext){
        const ctx = context.switchToHttp()
        let request = ctx.getRequest()

        let token = this.extractTokenFromHeader(request)

        if(!token){
            throw new UnauthorizedException();
        }
        
        try{
            const payload = await this.jwtService.verifyAsync(token,
                {
                    secret: process.env.JWT_SECRET
                }
            )
            request['user'] = payload
        }catch{
            throw new UnauthorizedException();
        }
        return true
    }

    extractTokenFromHeader(request: Request): string | undefined{
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        return type === 'Bearer' ? token : undefined
    }
}