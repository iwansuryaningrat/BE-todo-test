import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Body, Controller, Get, Inject, Put, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { imageFilter, limitImageUpload } from "src/libs/utils/validators/file.validator";
import { ChangeActiveProjectDTO, ChangePasswordDto, EditProfileDTO } from "./user.dto";
import { AuthenticationGuard } from "src/libs/auth/authentication.guard";
import { userProfileResponseExample } from "./response-example";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";

@ApiTags('User')
@UseGuards(AuthenticationGuard)
@ApiBearerAuth('Authorization')
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Get User Profile',
    description: 'Retrieve the profile of the authenticated user.',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully.',
    example: userProfileResponseExample,
    schema: {
      properties: {
        id: { type: 'number', example: 21 },
        name: { type: 'string', example: 'Miss Elsa Muller' },
        email: { type: 'string', example: 'Rosalee.Kreiger86@gmail.com' },
        username: { type: 'string', example: 'Kathryn.Leffler-Marquardt68' },
        picture: { type: 'string', example: 'https://res.cloudinary.com/sningratt/image/upload/v1706281179/default.png' },
        role: { type: 'string', example: 'owner' },
        project: { type: 'string', example: 'Practical Cotton Table' },
        projectId: { type: 'number', example: 15 }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      }
    },
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    }
  })
  @ApiNotFoundResponse({
    description: "Not Found Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found!' },
      }
    },
    example: {
      statusCode: 404,
      message: 'User not found!',
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error Response",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal Server Error' },
      }
    },
    example: {
      statusCode: 500,
      message: 'Internal Server Error',
    }
  })
  async getUserProfile(@Request() req: any) {
    return await this.userService.getUserById(req.user.id);
  }

  @Put('change-password')
  @ApiOperation({
    summary: 'Change Password',
    description: 'Change the password of the authenticated user.',
  })
  @ApiOkResponse({
    description: "Success Response",
    schema: {
      properties: {
        message: { type: 'string', example: 'Password changed successfully!' },
      }
    },
    example: {
      message: 'Password changed successfully!',
    }
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      }
    },
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    }
  })
  @ApiBadRequestResponse({
    description: "Bad Request Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Old password is incorrect!' },
      }
    },
    example: {
      statusCode: 400,
      message: 'Old password is incorrect!',
    }
  })
  @ApiNotFoundResponse({
    description: "Not Found Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found!' },
      }
    },
    example: {
      statusCode: 404,
      message: 'User not found!',
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error Response",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal Server Error' },
      }
    },
    example: {
      statusCode: 500,
      message: 'Internal Server Error',
    }
  })
  async changePassword(@Request() req: any, @Body() data: ChangePasswordDto) {
    return await this.userService.changePassword(data, req.user.id);
  }

  @Put('change-active-project')
  @ApiOperation({
    summary: 'Change Active Project',
    description: 'Change the active project of the authenticated user.',
  })
  @ApiOkResponse({
    description: "Success Response",
    schema: {
      properties: {
        message: { type: 'string', example: 'Project changed successfully!' },
      }
    },
    example: {
      message: 'Project changed successfully!',
    }
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      }
    },
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    }
  })
  @ApiBadRequestResponse({
    description: "Bad Request Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'You are not a member of this project!' },
      }
    },
    example: {
      statusCode: 400,
      message: 'You are not a member of this project!',
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error Response",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal Server Error' },
      }
    },
    example: {
      statusCode: 500,
      message: 'Internal Server Error',
    }
  })
  async changeActiveProject(@Request() req: any, @Body() data: ChangeActiveProjectDTO) {
    return await this.userService.changeActiveProject(req.user.id, data.projectId);
  }

  @Put()
  @ApiOperation({
    summary: 'Update Profile',
    description: 'Update the profile of the authenticated user.',
  })
  @ApiOkResponse({
    description: "Success Response",
    schema: {
      properties: {
        message: { type: 'string', example: 'Profile updated successfully!' },
      }
    },
    example: {
      message: 'Profile updated successfully!',
    }
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      }
    },
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    }
  })
  @ApiBadRequestResponse({
    description: "Bad Request Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Username already exists!' },
      }
    },
    example: {
      statusCode: 400,
      message: 'Username already exists!',
    }
  })
  @ApiNotFoundResponse({
    description: "Not Found Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found!' },
      }
    },
    example: {
      statusCode: 404,
      message: 'User not found!',
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error Response",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal Server Error' },
      }
    },
    example: {
      statusCode: 500,
      message: 'Internal Server Error',
    }
  })
  async updateProfile(@Request() req: any, @Body() data: EditProfileDTO) {
    return await this.userService.editProfile(req.user.id, data);
  }

  @Put('profile-picture')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFilter,
    limits: limitImageUpload()
  }))
  @ApiOperation({
    summary: 'Update Profile Picture',
    description: 'Update the profile picture of the authenticated user.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    // type: 'multipart/form-data',
    schema: {
      type: 'multipart/form-data',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Success Response",
    schema: {
      properties: {
        message: { type: 'string', example: 'Profile picture updated successfully!' },
      }
    },
    example: {
      message: 'Profile picture updated successfully!',
    }
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      }
    },
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    }
  })
  @ApiBadRequestResponse({
    description: "Bad Request Response Error",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'You are not a member of this project!' },
      }
    },
    example: {
      statusCode: 400,
      message: 'You are not a member of this project!',
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error Response",
    schema: {
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal Server Error' },
      }
    },
    example: {
      statusCode: 500,
      message: 'Internal Server Error',
    }
  })
  async updateProfilePicture(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    return await this.userService.changeProfilePicture(req.user.id, file);
  }
}