import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/libs/database/prisma.service";
import { IUserData } from "src/libs/interfaces";

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService
  ) { }

  private logger = new Logger(UserService.name);

  async getUserById(id: number): Promise<IUserData> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id },
        include: {
          ProjectMembers: {
            where: { isActive: true },
            include: { project: true }
          }
        }
      });

      if (!user) throw new NotFoundException('User not found!');

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        role: user?.ProjectMembers[0]?.role,
        project: user?.ProjectMembers[0]?.project?.name || null,
        projectId: user?.ProjectMembers[0]?.project?.id || null
      };
    } catch (error) {
      this.logger.error(this.getUserById.name, error?.message);
      throw new HttpException(error.message, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}