const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');
const Stripe_Key = "sk_test_51N1jiLSF8TM224ZiOLcoBDHyi9YMjFzfq4fEASdfU8cKYMnYbagwlZo46cOkhS1AHKS3qLiWmeAtA7Hkif6Vos75002zkFDsfb";
const stripe = require("stripe")(Stripe_Key);

class StripeRepository {

    db = {};

    constructor() {
        this.db = connect();
        // For Development
        this.db.sequelize.sync({ force: false }).then(() => {
        });
    }

    async createCustomer(requestData, userInfo) {
        let res = {}
        let data = {}
        let task = {}
        try {
            var customer = await stripe.customers.create(requestData);
            if (customer) {
                task.user_id = userInfo.id
                task.customer_id = customer.id
                task.username = userInfo.username

                //-----------data store to table payment------
                data = await this.db.payment.create(task);
                res.aaData = data;
                res.message = "successful Created"
                res.status = 200;
            } else {
                res.message = "Bad Request";
                res.status = 400;
            }


        } catch (err) {
            // console.log("=======================----------------------->>>>>>>>", err)
            logger.error('Error::' + err);
            res.message = "Bad Request";
            res.message = err.toString();
            res.status = 400;
        }
        return res;
    }

    async addCard(data, userInfo) {
        let res = {}
        let existing_data = {}
        try {

            existing_data = await this.db.payment.findOne({
                where: {
                    user_id: userInfo.id
                }
            });

            const card_Token = await stripe.tokens.create({
                card: {
                    name: data.card_Name,
                    number: data.card_Number,
                    exp_month: data.card_ExpMonth,
                    exp_year: data.card_ExpYear,
                    cvc: data.card_CVC,
                },
            });

            const card = await stripe.customers.createSource(existing_data.customer_id, {
                source: `${card_Token.id}`,
            });
            let aaData = {
                card: card.id
            }
            res.aaData = aaData
            res.message = "card successfully added"
            // res.aaData = existing_data
            res.status = 200
        } catch (error) {
            logger.error('Error::' + error);
            res.message =  "resquest failed"
            res.err = error.toString()
            res.status = 400

        }
        return res;
    }

    async cardsList(userInfo) {
        var response = {}
        let existing_data = {}
        try {
            existing_data = await this.db.payment.findOne({
                where: {
                    user_id: userInfo.id
                }
            });
            const card = await stripe.customers.listSources(existing_data.customer_id, {
                object: 'card',
                limit: 20
            });
            if(card.length > 0){
            response.aaData = card.data
            response.status = 200
            }else{
                response.message = "No saved card"
                response.status = 200
            }

        } catch (error) {
            logger.error('Error::' + error);
            response.err = error.toString()
            response.message =  "resquest failed"
            response.status = 400
        }
        return response;
    }

    async delCard(userInfo, card_id) {
        var response = {}
        let existing_data = {}
        try {
            existing_data = await this.db.payment.findOne({
                where: {
                    user_id: userInfo.id
                }
            });
            const card = await stripe.customers.deleteSource(existing_data.customer_id, card_id);
            if (card) {
                response.aaData = card
                response.message = "card deleted"
                response.status = 200
            } else {
                response.message = "delete request failed"
                response.status = 400
            }

        } catch (error) {
            logger.error('Error::' + error);
            response.err = error.toString()
            response.message = "delete request failed"
            response.status = 400
        }
        return response

    }

    async payment(userInfo, card_id,data) {
        let response = {}
        let existing_data = {}
        let updateTableData = {}
        try {
            existing_data = await this.db.payment.findOne({
                where: {
                    user_id: userInfo.id
                }
            });
            const paymentIntent  = await stripe.paymentIntents.create({
                receipt_email: userInfo.email,
                amount: data.amountCharged,
                currency: "usd",
                // card: card_id,
                customer: existing_data.customer_id,
            });
            console.log("===================>>>>>>>>>>>>>>>>>>>>>>!!!!!!!!!!!!!", paymentIntent )
            // if (card.status == 'succeeded') {
            //     existing_data.asset_id = data.asset_id
            //     existing_data.amountCharged = data.amountCharged
            //     existing_data.transactionId = card.balance_transaction
            //     existing_data.status = card.status
            //     updateTableData = await this.db.digital_vault.update({ ...existing_data }, {
            //         where: {
            //             user_id: userInfo.id
            //         }
            //     });
            //     if(updateTableData){
                response.aaData = paymentIntent
                response.message = "payment complete"
                response.status = 200
            //     }else{
            //         response.message = "payment update request  failed"
            //         response.status = 400
            //     }
            // } else {
            //     response.message = "payment request failed"
            //     response.status = 400
            // }

        } catch (error) {
            logger.error('Error::' + error);
            response.err = error.toString()
            response.message = "payment request failed"
            response.status = 400
        }
        return response
    }

}



module.exports = new StripeRepository();