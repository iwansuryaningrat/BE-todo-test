import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import * as moment from 'moment-timezone';
import { IUserData } from "../interfaces";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/users/user.service";
import { PrismaService } from "../database/prisma.service";
import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthHelper {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserService) private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }

  // Validate token
  public validateToken(token: string) {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get("JWT_SECRET") });
    return decoded;
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<IUserData> {
    const user = await this.userService.getUserById(decoded.id);
    if (!user) throw new UnauthorizedException("User Unauthorized!");

    return user;
  }

  // Generate JWT Token
  public async generateTokens(
    userId: number,
    data: IUserData,
  ) {
    const secret = this.configService.get("JWT_SECRET");
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          ...data,
        },
        {
          secret,
          expiresIn: this.configService.get("JWT_EXPIRES"),
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          ...data,
        },
        {
          secret,
          expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRES"),
        },
      ),
    ]);

    const expiredAt = moment(new Date()).add(3, 'days').format();
    await this.prismaService.refreshToken.upsert({
      where: { userId },
      update: {
        accessToken,
        refreshToken,
        isActive: true,
        expiredAt,
      },
      create: {
        userId,
        accessToken,
        refreshToken,
        expiredAt,
        isActive: true,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async validate(token: string): Promise<any> {
    const decoded: unknown = this.jwtService.verify(token);
    if (!decoded) throw new UnauthorizedException("User Unauthorized!", { cause: new Error(), description: "User Unauthorized!" })

    const user = await this.validateUser(decoded);
    if (!user) throw new UnauthorizedException("User Unauthorized!", { cause: new Error(), description: "User Unauthorized!" })

    return {
      isValid: true,
      user
    };
  }
}
