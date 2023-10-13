const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes, Model) => {

    class Tasks extends Model {}

    Tasks.init({
        // Model attributes are defined here
        user_id: {
          type:DataTypes.INTEGER,
          // allowNull: false
        },
        filetype: {
          type: DataTypes.STRING
          //allowNull defaults to true
        },
        filename: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        about: {
          type: DataTypes.STRING
          // allowNull defaults to true
        },
        price: {
            type: DataTypes.INTEGER
            // allowNull defaults to true
        },
        path: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        uploadby: {
            type: DataTypes.INTEGER
            // allowNull defaults to true
        },
        purchasedby:{
          type: DataTypes.INTEGER
          // allowNull defaults to true
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'digital_vault' // We need to choose the model name
      });
      
      return Tasks;
}