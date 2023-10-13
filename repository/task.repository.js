const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');
var decryptData = require("../service/data.service")
const fs = require('fs')
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";

function createUserFolder(userId) {
    const folderPath = path.join(__dirname, '../user_folders', userId.toString());
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder for user ${userId} at ${folderPath}`);
}


class TaskRepository {

    db = {};

    constructor() {
        this.db = connect();
        // For Development
        this.db.sequelize.sync({ force: false }).then(() => {
        });
    }


    async createTask(task) {
        let data = {};
        let datasave = {};
        let response = {}
        try {
            task.isDeleted = false
            data = await this.db.user.findOne({
                where: {
                    email: task.email,
                },
            });
            if (data) {
                response.message = "Duplicate Request";
                response.status = 400
            } else {
                task.createdate = new Date().toISOString();
                datasave = await this.db.user.create(task);
                await createUserFolder(datasave.id)
                response.message = "successfully user created"
                response.aaData = datasave;
                response.status = 201
            }
        } catch (err) {
            logger.error("Error::" + err);
            response.message = err.toString()
        }
        return response;
    }

    async logInTask(task) {
        let data = {};
        let response = {}
        try {
            data = await this.db.user.findOne({
                where: {
                    email: task.email,
                },
            });
            let obj = {
                id: data.id,
                username: data.username,
                email: data.email
            }
            if (data) {
                var decryptDataOld = decryptData.decryption(data.password)
                if (task.password == decryptDataOld) {
                    data.password = decryptDataOld;
                    var token = await jwt.sign(obj, secretKey,{expiresIn:'1d'})
                    const refreshToken = jwt.sign(obj, secretKey)
                    response.message = "login successfully";
                    response.aaData = data;
                    response.genToken = token
                    response.refreshToken = refreshToken
                    response.status = 200
                }
                else {
                    response.message = "Bad Request";
                    response.status = 400
                }
            } else {
                response.message = "Not found";
                response.status = 404
            }
        } catch (err) {
            logger.error("Error::" + err);
            // response.message = err.toString()
            response.message = "Not found";
            response.status = 404
        }
        return response;
    }
}

module.exports = new TaskRepository();