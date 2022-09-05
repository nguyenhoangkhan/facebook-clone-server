const cloudinary = require("cloudinary");
const { removeFile } = require("../helpers/file");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

class UploadController {
  async index(req, res) {
    try {
      const { path } = req.body;
      const files = Object.values(req.files).flat();
      const images = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file, path);
        images.push(url);
        removeFile(file.tempFilePath);
      }
      return res.json(images);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: path },
      (error, res) => {
        if (error) {
          removeFile(file.tempFilePath);
          console.log("res err", res);
          return res.status(400).json({ message: "Đăng ảnh thất bại" });
        }
        resolve({ url: res.secure_url });
      }
    );
  });
};

module.exports = new UploadController();
