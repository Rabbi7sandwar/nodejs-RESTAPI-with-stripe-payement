const taskService = require('../service/task.service');
const logger = require('../logger/api.logger');

class TodoController {

    async logInTask(task) {
        logger.info("Controller: logInTask", task);
        return await taskService.logInTask(task);
    }

    async createTask(task) {
        console.log("createTask", task)
        logger.info('Controller: createTask', task);
        return await taskService.createTask(task);
    }

    async uploadTask(file, task, token,path) {
        logger.info('Controller: upload', { file, task, token });
        return await taskService.upload(file, task, token);
    }

    async myMarketPlace(token) {
        logger.info('Controller: myMarketPlace', { token });
        return await taskService.myMarketPlace(token);
    }

    async myAssets(token) {
        logger.info('Controller: myAssets', { token });
        return await taskService.myAssets(token);
    }

    async myUpload(token) {
        logger.info('Controller: myUpload', { token });
        return await taskService.myUpload(token);
    }

    async purchased(token,asset_id) {
        logger.info('Controller: purchased', { token,asset_id });
        return await taskService.purchased(token,asset_id);
    }
    
    async assetsById(token,asset_id) {
        logger.info('Controller: assetsById', { token,asset_id });
        return await taskService.assetsById(token,asset_id);
    }

    async prevData (token,asset_id,app_roots){
        logger.info('Controller: prevData', { token,asset_id,app_roots });
        return await taskService.prevData(token,asset_id,app_roots);
    }

    async createCustomer(requestData,userInfo){
        logger.info('Controller: createCustomer',{requestData,userInfo});
        return await taskService.createCustomer(requestData,userInfo); 
    }

    async addCard(data,userInfo){
        logger.info('Controller: addCard',{data,userInfo});
        return await taskService.addCard(data,userInfo); 
    }
    
    async cardsList(userInfo){
        logger.info('Controller: cardsList',userInfo);
        return await taskService.cardsList(userInfo); 
    }

    async delCard(userInfo,card_id){
        logger.info('Controller: delCard',{userInfo,card_id});
        return await taskService.delCard(userInfo,card_id); 
    }

    async payment(userInfo,card_id,data){
        logger.info('Controller: payment',{userInfo,card_id,data});
        return await taskService.payment(userInfo,card_id,data); 
    }

}
module.exports = new TodoController();