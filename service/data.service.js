const CryptoJs = require("crypto-js")

const Key = process.env.KEY || "hbjsddfscbjegcdcehjrhb";

const uploadFile = require("../middleware/upload");

const fs = require("fs");

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

class DataService {

    encryption(data) {
        var encrypted = CryptoJs.AES.encrypt(data, Key).toString();
        console.log(encrypted);
        return encrypted;
    }

    decryption(data) {
        var decrypted = CryptoJs.AES.decrypt(data, Key).toString(CryptoJs.enc.Utf8);
        console.log(decrypted);
        return decrypted;
    }
}

module.exports = new DataService()