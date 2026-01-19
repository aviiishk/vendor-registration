import cloudinary from "../config/cloudinary";

export const cleanupCloudinaryFiles = async (
  files: Express.Multer.File[]
) => {
  const deletePromises = files.map((file) =>
    cloudinary.uploader.destroy(file.filename, {
      resource_type:
        file.mimetype === "application/pdf" ? "raw" : "image",
    })
  );

  await Promise.all(deletePromises);
};
