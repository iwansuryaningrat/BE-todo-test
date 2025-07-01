import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    description: "Old password",
    example: "oldPassword123",
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: "New password",
    example: "newPassword123",
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class ChangeActiveProjectDTO {
  @ApiProperty({
    type: Number,
    description: "New project id",
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}

export class EditProfileDTO {
  @ApiProperty({
    type: String,
    description: "username of the user",
    example: "rosalee.kreiger",
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    type: String,
    description: "Name of the user",
    example: "Rosalee Kreiger",
  })
  @IsOptional()
  @IsString()
  name?: string;
}