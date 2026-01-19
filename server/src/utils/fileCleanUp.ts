import fs from "fs";
import { Express } from "express";

/**
 * Safely deletes uploaded files from disk.
 * Used when validation fails after upload.
 */
export const cleanupFiles = (files: Express.Multer.File[]) => {
  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(
          `Failed to delete file ${file.path}:`,
          err.message
        );
      }
    });
  });
};
