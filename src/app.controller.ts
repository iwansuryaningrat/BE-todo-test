import { BadRequestException, Controller, Get, Inject, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { imageAndVideoAndPDFFilter, limitImageAndVideoAndPDFUpload } from './utils/validators/file.validator';
import { FileUploader } from './utils/fileUploader.util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(FileUploader) private readonly fileUploader: FileUploader,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageAndVideoAndPDFFilter,
      limits: limitImageAndVideoAndPDFUpload(),
    }),
  )
  async testUpload(
    @UploadedFiles() media: Array<Express.Multer.File>) {
    if (!media || media.length === 0) {
      throw new BadRequestException("No files uploaded");
    }
    const uploadedFiles = await Promise.all(
      media.map(async (file) => {
        return await this.fileUploader.uploadFile(file);
      }),
    );

    return uploadedFiles;
  }
}