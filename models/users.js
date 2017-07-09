'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    display: DataTypes.STRING
    
});
      users.associate = function(models) {
        users.hasMany(models.messages);

      }
  return users;
};