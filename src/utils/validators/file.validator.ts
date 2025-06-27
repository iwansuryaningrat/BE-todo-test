import { BadRequestException } from "@nestjs/common";

export const imageAndVideoAndPDFFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(|JPG|jpg|jpeg|png|PNG|mp4|mov|pdf)$/i)) {
    return callback(
      new BadRequestException("Only image, video, and PDF files are allowed!"),
      false,
    );
  }
  callback(null, true);
};

export const limitImageAndVideoAndPDFUpload = (maxFile?: number) => {
  return {
    fileSize: maxFile ?? 10 * 1024 * 1024,
  };
};
