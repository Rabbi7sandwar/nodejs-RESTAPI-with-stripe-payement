const taskRepository = require('../repository/task.repository');
const DigitalVaultRepository = require('../repository/digital_vault.repository');
const stripeRespository = require ('../repository/stripe.repository')
const CryptoJs = require("crypto-js")
const encryptData = require("./data.service")
var path = require('path');
const os = require('os');

class TaskService {

    constructor() { }

    async createTask(task) {
        var encryptedData = encryptData.encryption(task.password)
        task.password = encryptedData;
        return await taskRepository.createTask(task);
    }

    async logInTask(task) {
        return await taskRepository.logInTask(task);
    }

    async upload(file,task, token) {
        return await DigitalVaultRepository.upload(file,task, token );
    }

    async myMarketPlace(token) {
        return await DigitalVaultRepository.myMarketPlace(token);
    }

    async myAssets(token) {
        return await DigitalVaultRepository.myAssets(token);
    }

    async myUpload(token) {
        return await DigitalVaultRepository.myUpload(token);
    }

    async purchased(token,asset_id){
        return await DigitalVaultRepository.purchased(token,asset_id);
    }
    
    async assetsById(token,asset_id){
        return await DigitalVaultRepository.assetsById(token,asset_id);
    }
    async prevData(token,asset_id,app_roots){
        return await DigitalVaultRepository.prevData(token,asset_id,app_roots);
    }

    async createCustomer(requestData,userInfo){
        return await stripeRespository.createCustomer(requestData,userInfo)
    }

    async addCard(data,userInfo){
        return await stripeRespository.addCard(data,userInfo)
    }
    async cardsList(userInfo){
        return await stripeRespository.cardsList(userInfo) 
    }

    async delCard(userInfo,card_id){
        return await stripeRespository.delCard(userInfo,card_id)
    }

    async payment(userInfo,card_id,data){
        return await stripeRespository.payment(userInfo,card_id,data)
    }
}
 
module.exports = new TaskService();