import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthHelper } from "../helpers";
import { Request } from "express";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private authHelper: AuthHelper
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const decoded = this.authHelper.validateToken(token);
      const user = await this.authHelper.validateUser(decoded);
      if (!token || !user) throw new UnauthorizedException();

      request.user = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
