const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Base directory for file storage
const baseDir = path.resolve("public");

// Ensure required directories exist
const ensureDirectoryExists = (userId, canvasId) => {
  const userDir = path.join(baseDir, userId.toString());
  const canvasDir = path.join(userDir, canvasId.toString());
  console.log(userDir, canvasDir);
  if (!fs.existsSync(baseDir)) {
    console.log("filenale");

    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(userDir)) {
    console.log("filenale");

    fs.mkdirSync(userDir);
  }
  if (!fs.existsSync(canvasDir)) {
    console.log("filenale");

    fs.mkdirSync(canvasDir);
  }

  return canvasDir;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user?.id;
    const canvasId = req.params.canvas_id;
    console.log("destiny");
    if (!userId || !canvasId) {
      return cb(new Error("User ID and Canvas ID are required"));
    }

    // Check if file is an image
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    const uploadDir = ensureDirectoryExists(userId, canvasId);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    // Validate allowed extensions (if necessary)
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Invalid file extension"));
    }

    const filename = `${uuidv4()}${ext}`;
    console.log("filenale");
    req.body.filename = filename;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5MB limit
  // },
});

const uploadImage = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single("image_file")(req, res, (err) => {
        if (err) {
          console.log(err);
          if (err instanceof multer.MulterError) {
            return reject(new Error("File upload error: " + err.message));
          }
          return reject(err);
        }
        console.log(req.headers);
        resolve(req.file);
      });
    });
    // console.log(req.headers);
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Generate public URL path
    const relativePath = path.relative(
      baseDir,
      path.join(req.file.destination, req.file.filename)
    );

    // Add file information to request body
    req.body.filePath = `/public/${relativePath.replace(/\\/g, "/")}`;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};
