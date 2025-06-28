import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Inject, Post } from "@nestjs/common";
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
}