import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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