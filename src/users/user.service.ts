import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/libs/database/prisma.service";
import { IUserData } from "src/libs/interfaces";
import { ChangePasswordDto } from "./user.dto";
import { AuthHelper } from "src/libs/helpers";

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AuthHelper)) private readonly authHelper: AuthHelper,
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
        role: user?.ProjectMembers[0]?.role || null,
        project: user?.ProjectMembers[0]?.project?.name || null,
        projectId: user?.ProjectMembers[0]?.project?.id || null
      };
    } catch (error) {
      this.logger.error(this.getUserById.name, error?.message);
      throw new HttpException(error.message, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(data: ChangePasswordDto, userId: number) {
    try {
      const user = await this.prismaService.users.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException("User not found!");

      const isPasswordValid = this.authHelper.isPasswordValid(data.oldPassword, user.password);
      if (!isPasswordValid) throw new BadRequestException("Old password is incorrect!");
      if (data.newPassword === data.oldPassword) throw new BadRequestException("New password cannot be the same as old password!");

      const newPassword = this.authHelper.encodePassword(data.newPassword);
      await this.prismaService.users.update({ where: { id: userId }, data: { password: newPassword } });

      return { message: "Password changed successfully!" };
    } catch (error) {
      this.logger.error(this.changePassword.name, error?.message);
      throw new HttpException(error.message, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeActiveProject(userId: number, projectId: number) {
    try {
      const userMember = await this.prismaService.projectMembers.findFirst({
        where: {
          userId,
          projectId
        }
      })
      if (!userMember) throw new BadRequestException("You are not a member of this project!");

      await this.prismaService.projectMembers.updateMany({
        where: {
          userId,
          isActive: true
        },
        data: {
          isActive: false
        }
      })

      await this.prismaService.projectMembers.update({
        where: {
          id: userMember.id
        },
        data: {
          isActive: true
        }
      })

      return { message: "Project changed successfully!" };
    } catch (error) {
      this.logger.error(this.changeActiveProject.name, error?.message);
      throw new HttpException(error.message, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}