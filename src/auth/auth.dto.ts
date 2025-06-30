import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
  @ApiProperty({
    type: String,
    description: "Email address of the user",
    example: "rosalee.kreiger86@gmail",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: "Password of the user",
    example: "password123",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty({
    type: String,
    description: "Refresh token of the user",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class SignUpDTO {
  @ApiProperty({
    type: String,
    description: "Email address of the user",
    example: "rosalee.kreiger86@gmail.com",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: "username of the user",
    example: "rosalee.kreiger",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: "Name of the user",
    example: "Rosalee Kreiger",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: "Password of the user",
    example: "password123",
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}