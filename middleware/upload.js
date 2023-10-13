const util = require("util");
const multer = require("multer");
const path = require("path");
const maxSize = 10 * 1024 * 1024;
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";


async function tokenGen(token) {
    let token_ = token
    let reqToken = token_.split(" ")[1]
    const userInfo = await jwt.verify(reqToken, secretKey);
    return userInfo.id;
}

let storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let user_id = await tokenGen(req.headers.token)
        process.cwd()
      const folderPath = path.join( __dirname + '../../user_folders/' + user_id)

       cb(null, __dirname + '../../user_folders/' + user_id, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("filename");


let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;