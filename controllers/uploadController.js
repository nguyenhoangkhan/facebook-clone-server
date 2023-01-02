const cloudinary = require("cloudinary");
const { removeFile } = require("../helpers/file");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

class UploadController {
  // Upload Images [POST]
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
  getImagesList(req, res) {
    const { path, order, max } = req.query;
    cloudinary.v2.search
      .expression(`${path}`)
      .sort_by("created_at", `${order}`)
      .max_results(max)
      .execute()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        return res.status(500).json({ message: err });
      });
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
          return res.status(400).json({ message: "Đăng ảnh thất bại" });
        }
        resolve({ url: res.secure_url });
      }
    );
  });
};

module.exports = new UploadController();
