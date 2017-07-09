'use strict';
module.exports = function(sequelize, DataTypes) {
  var messages = sequelize.define('messages', {
    content: DataTypes.TEXT,
    author: DataTypes.STRING,
    userId: DataTypes.INTEGER
  
      
});
messages.associate = function(models) {
        messages.belongsTo(models.users, { foreignKey: 'userId'});
        messages.hasMany(models.likes, {foreignKey: 'messageId'});
      }
  return messages;
};

