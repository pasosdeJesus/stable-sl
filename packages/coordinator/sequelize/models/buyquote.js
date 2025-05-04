'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class buyquote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  buyquote.init({
    quoteId: DataTypes.STRING,
    senderPhone: DataTypes.STRING,
    senderName: DataTypes.STRING,
    senderWallet: DataTypes.STRING,
    timestamp: DataTypes.NUMBER,
    usdPriceInSle: DataTypes.NUMBER,
    maximum: DataTypes.NUMBER,
    minimum: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'buyquote',
  });
  return buyquote;
};
