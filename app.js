const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".")[1];
    //!important point file.originalname for og name
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
  },
});

//! imp point
const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    //! important point
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // explain cb

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },

  //! important point
}).single("mypic");

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/uploadprofile", function (req, res) {
  // Error MiddleWare for multer file upload, so if any
  // error occurs, the image would not be uploaded!
  upload(req, res, function (err) {
    if (err) {
      // ERROR occurred (here it can be occurred due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      res.send(err);
    } else {
      // SUCCESS, image successfully uploaded
      res.send("<h1>Success, Image uploaded!</h1>");
    }
  });
});

// Take any port number of your choice which
// is not taken by any other process
app.listen(5000, function (error) {
  if (error) throw error;
  console.log("Server created Successfully on PORT 5000");
});
