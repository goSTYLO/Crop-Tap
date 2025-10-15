const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../productImgs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Compress and save image with farmer name in filename
 * @param {Object} file - multer file object
 * @param {String} farmerName - name of the farmer
 * @returns {String} filename saved to disk
 */
exports.saveCompressedImage = async (file, farmerName = 'farmer') => {
  try {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const cleanFarmer = farmerName.trim().toLowerCase().replace(/\s+/g, '_');

    const filename = `${cleanFarmer}_${baseName}_${timestamp}.jpg`;
    const outputPath = path.join(uploadDir, filename);

    await sharp(file.buffer)
      .resize({ width: 800 }) // optional: resize for consistency
      .jpeg({ quality: 70 })  // compress to 70% quality
      .toFile(outputPath);

    return filename; // only return the name for DB storage
  } catch (err) {
    throw new Error('Image compression failed: ' + err.message);
  }
};