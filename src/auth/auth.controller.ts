import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Post, Request, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "src/libs/auth/authentication.guard";
import { loginResponseExample } from "./response-example";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./auth.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService
  ) { }

  @Post('login')
  @ApiOperation({
    summary: 'Login User',
    description: 'Login User',
  })
  @ApiOkResponse({
    description: "Success Response",
    example: loginResponseExample,
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string' },
            project: { type: 'string' },
            projectId: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found Error Response',
    example: {
      "statusCode": 404,
      "message": "User not found!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Error Response',
    example: {
      "statusCode": 400,
      "message": "Password is incorrect!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error Response',
    example: {
      "statusCode": 500,
      "message": "Internal Server Error!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Refresh Token',
  })
  @ApiOkResponse({
    description: "Success Response",
    example: loginResponseExample,
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string' },
            project: { type: 'string' },
            projectId: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Error Response',
    example: {
      "statusCode": 400,
      "message": "Refresh token is invalid!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error Response',
    example: {
      "statusCode": 500,
      "message": "Internal Server Error!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  async refreshToken(@Body() data: { refreshToken: string }) {
    return await this.authService.refreshToken(data.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthenticationGuard)
  @ApiOperation({
    summary: 'Logout User',
    description: 'Logout User',
  })
  @ApiOkResponse({
    description: "Success Response",
    example: {
      "message": "User logged out successfully!"
    },
    schema: {
      properties: {
        message: { type: 'string' },
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error Response',
    example: {
      "statusCode": 500,
      "message": "Internal Server Error!"
    },
    schema: {
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      }
    }
  })
  async logout(@Request() req: any) {
    return await this.authService.logout(req?.user?.id);
  }
}