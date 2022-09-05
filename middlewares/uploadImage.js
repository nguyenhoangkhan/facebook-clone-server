const { removeFile } = require("../helpers/file");

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: "Không có file nào được upload" });
    }
    const files = Object.values(req.files).flat();
    files.forEach((file) => {
      if (
        file.mimetype !== "image/jpeg" &&
        "image/png" &&
        "image/gif" &&
        "image/webp" &&
        "image/jpg"
      ) {
        // Remove tmp folder ( temp files )
        removeFile(file.tempFilePath);
        return res
          .status(404)
          .json({ message: "Định dạng ảnh không được hỗ trợ" });
      }
    });

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = uploadImage;
