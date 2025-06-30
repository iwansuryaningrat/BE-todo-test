import { Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronUtil {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) { }

  private logger = new Logger(CronUtil.name);

  @Cron(CronExpression.EVERY_HOUR)
  async unactivateExpiredRefreshToken() {
    try {
      this.logger.log(`Running cron job: ${this.unactivateExpiredRefreshToken.name}`);

      const expiredTokens = await this.prismaService.refreshToken.findMany({
        where: {
          isActive: true,
          expiredAt: {
            lt: new Date(),
          },
        },
      });

      if (expiredTokens.length > 0) {
        await this.prismaService.refreshToken.updateMany({
          where: {
            id: {
              in: expiredTokens.map(token => token.id),
            },
          },
          data: {
            isActive: false,
          },
        });
        this.logger.log(`Deactivated ${expiredTokens.length} expired refresh tokens.`);
      } else {
        this.logger.log('No expired refresh tokens found.');
      }
    } catch (error) {
      this.logger.error(this.unactivateExpiredRefreshToken.name, error?.message);
      throw error;
    }
  }
}