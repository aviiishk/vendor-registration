import cloudinary from "../config/cloudinary";

export const moveToVendorFolder = async (
  files: Express.Multer.File[],
  vendorId: string
) => {
  const results = [];

  for (const file of files) {
    const isPdf = file.mimetype === "application/pdf";

     console.log("MOVING FILE:", {
      oldPublicId: file.filename,
      newPublicId: `vendor-documents/vendor_${vendorId}/${file.fieldname}`,
      resourceType: isPdf ? "raw" : "image",
    });

    const newPublicId = `vendor-documents/vendor_${vendorId}/${file.fieldname}`;

    const result = await cloudinary.uploader.rename(
      file.filename, // old public_id
      newPublicId,
      {
        resource_type: isPdf ? "raw" : "image",
        overwrite: true,
      }
    );
    console.log("MOVE RESULT:", result.public_id);
    results.push({
      documentType: file.fieldname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
    });
  }

  return results;
};
