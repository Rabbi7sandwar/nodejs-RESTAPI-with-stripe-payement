const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes, Model) => {

    class Users extends Model {}

    Users.init({
        // Model attributes are defined here
        username: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type:DataTypes.STRING,
          // allowNull: false
        },
        password: {
          type: DataTypes.STRING
          //allowNull defaults to true
        },
        createdAt: {
          type: DataTypes.DATE
          // allowNull defaults to true
        },
        updatedAt: {
            type: DataTypes.DATE
            // allowNull defaults to true
        },
        isDeleted:{
          type: DataTypes.BOOLEAN
          // allowNull defaults to true
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'user' // We need to choose the model name
      });
      
      return Users;
}