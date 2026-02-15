import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "src/user/user.types";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "./roles.guard";


export const ROLES_KEY = 'roles';

// We are spreading roles to give information on which role will be allowed
export const Roles = (...roles: Role[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(AuthGuard, RolesGuard)
    )
}