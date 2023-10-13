const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');
const decryptionData = require('../service/data.service')
const fs = require('fs');
const path__ = require('path');

class DigitalVaultRepository {
    db = {};
   
    constructor() {
        this.db = connect();
        // For Development
        this.db.sequelize.sync({ force: false }).then(() => {
        });
    }

    async upload(file, task, token) {
        let data = {};
        let filetype =  path__.extname(file)
        let response = {};
        let paths = '/user_folders/' + token.id + '/' + file
        try {
            task.user_id = token.id
            task.uploadby = token.id
            task.filetype = filetype
            task.filename = file
            task.path = paths
            data = await this.db.digital_vault.create(task);
            if(data){
                response.aaData = data
                response.message = "file uploaded"
                response.status = 200
            }else{
                response.message = "file upload failed"
                response.status = 200
            }
        } catch (err) {
            logger.error('Error::' + err);
            response.message = err
            response.status = 500
        }
        return response;
    }

    async myMarketPlace(token) {
        let data = {};
        let purchaseBy = null;
        let response = {};
        try {
            data = await this.db.digital_vault.findAll({
                where: {
                    purchasedby: purchaseBy
                },
            });
          if(data.length > 0){
            response.aaData = data
            response.message = "Success"
            response.status = 200
          }else{
            response.message = "No record found"
            response.status = 200
          }
        } catch (err) {
            logger.error('Error::' + err);
            response.message = "No record found"
            response.status = 200
        }

        return response;
    }

    async myAssets(token) {
        let data = {};
        let response = {}
        try {
            data = await this.db.digital_vault.findAll({
                where: {
                    purchasedby: token.id
                },
            });
            if(data.length > 0){
                response.aaData = data
                response.message = "Success"
                response.status = 200
            }else{
                response.message = "No record found"
                response.status = 200
            }
        } catch (err) {
            logger.error('Error::' + err);
            response.message = "No record found"
            response.status = 500
        }

        return response;
    }

    async myUpload(token) {
        let data = {};
        let response = {}
        try {
            data = await this.db.digital_vault.findAll({
                where: {
                    uploadby: token.id
                },
            });
            if(data.length > 0){
                response.aaData = data
                response.message = "Success"
                response.status = 200
            }else{
                response.message = "No record found"
                response.status = 200
            }
        } catch (err) {
            logger.error('Error::' + err);
            response.message = "No record found"
            response.status = 500
        }

        return response;
    }

    async prevData(token, asset_id,app_roots){
        let data ={}
        try{
            data = await this.db.digital_vault.findOne({
                where: {
                    id: asset_id
                }
            });
            let oldPath = app_roots + data.path
            let newPath = app_roots + '/user_folders/' + token.id + '/' + data.filename
            fs.rename(oldPath, newPath, function (err) {
                if(err){
                   return err
                }
                else{
                    return true
                }
            })
        }catch(err){
            console.log(err)
            return false
        }
        // return data;
    }

    
    async purchased(token, asset_id,app_roots) {
        let data ={}
        let newData = {};
        var data1 = {}
       
        try {
             data1 = await this.db.digital_vault.findOne({
                where: {
                    id: asset_id,
                },
            });
            let dirNewPath = '/user_folders/' + token.id + '/' + data1.filename
            data.purchasedby = token.id
            data.user_id = token.id
            data.path = dirNewPath
           
            newData = await this.db.digital_vault.update({ ...data }, {
                where: {
                    id: asset_id
                }
            });
            newData = await this.db.digital_vault.findOne({
                where: {
                    id: asset_id
                }
            });


        } catch (err) {
            logger.error('Error::' + err);
        }
        return newData;
    }


    async assetsById(token, asset_id){
        let data = {};
        let response = {}
        try {
            data = await this.db.digital_vault.findOne({
                where: {
                    id : asset_id
                },
            });
            if(data){
                response.aaData = data
                response.message = "Success"
                response.status = 200
            }else{
                response.message = "No record found"
                response.status = 200
            }
           
        } catch (err) {
            logger.error('Error::' + err);
            response.message = "No record found"
            response.status = 404
        }

        return response;
    }

    



}

module.exports = new DigitalVaultRepository();