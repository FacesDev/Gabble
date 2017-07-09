'use strict';
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define('likes', {
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER
});
likes.associate = function(models) {
        likes.belongsTo(models.messages, {foreignKey: 'messageId'});
        likes.belongsTo(models.users, {foreignKey: 'userId'});
      }
  return likes;
};