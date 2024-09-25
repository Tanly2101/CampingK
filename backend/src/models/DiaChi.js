'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiaChi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DiaChi.init({
    DiaChiKhachHang: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'DiaChi',
  });
  return DiaChi;
};