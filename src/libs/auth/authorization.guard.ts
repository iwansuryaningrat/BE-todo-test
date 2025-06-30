import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requiredRoles.length) return true;
    const userRole = request?.user?.role;
    if (!userRole) throw new UnauthorizedException("You need to join a project first!");
    if (!requiredRoles.includes(userRole)) return false;
    return true;
  }
}