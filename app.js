const express = require("express");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./resources/",
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb("Error: Images Only!");
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
});

const { checkNik } = require("./detector.js");

const app = express();
const port = 3000;

app.post("/get-nik", (req, res) => {
  upload.single("file")(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(400).send({
          status: "error",
          message: err,
        });
      } else if (err) {
        res.status(400).send({
          status: "error",
          message: err,
        });
      } else {
        const imagePath = req.file.path;
        checkNik(imagePath)
          .then((nik) => {
            res.status(200).send({
              status: "success",
              nik: nik,
            });
          })
          .catch((err) => {
            res.status(400).send({
              status: "error",
              message: err,
            });
          });
      }
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: error,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
