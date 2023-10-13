const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes, Model) => {

    class Payments extends Model {}

    Payments.init({
        // Model attributes are defined here
        user_id: {
          type:DataTypes.INTEGER,
          // allowNull: false
        },
        customer_id: {
          type: DataTypes.STRING
          //allowNull defaults to true
        },
        username: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        transactionId: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        amountCharged: {
            type: DataTypes.INTEGER
            // allowNull defaults to true
        },
        asset_id: {
            type: DataTypes.INTEGER,
            // allowNull: false
        },
        status: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'payment' // We need to choose the model name
      });
      
      return Payments;
}