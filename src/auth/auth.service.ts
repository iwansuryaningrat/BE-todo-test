import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/libs/database/prisma.service";
import { IUserData } from "src/libs/interfaces";
import { AuthHelper } from "src/libs/helpers";
import { LoginDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper
  ) { }

  private logger = new Logger(AuthService.name);

  async login(data: LoginDTO) {
    try {
      const { email, password } = data;

      const user = await this.prismaService.users.findUnique({
        where: {
          email
        },
        include: {
          ProjectMembers: {
            where: {
              isActive: true
            },
            include: {
              project: true
            }
          }
        }
      });
      if (!user) throw new NotFoundException("User not found!");
      if (!this.authHelper.isPasswordValid(password, user.password)) throw new BadRequestException("Password is incorrect!");

      const userData: IUserData = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        role: user?.ProjectMembers[0]?.role,
        project: user?.ProjectMembers[0]?.project?.name || null,
        projectId: user?.ProjectMembers[0]?.project?.id || null
      };

      const { accessToken, refreshToken } = await this.authHelper.generateTokens(user.id, userData);

      return {
        accessToken,
        refreshToken,
        user: userData
      };
    } catch (error) {
      this.logger.error(this.login.name, error?.message);
      throw new HttpException(error.message, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}