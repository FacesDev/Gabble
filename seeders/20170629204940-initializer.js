'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('User', [{
        username: 'chris',
        password: 'qwer1234',
        display: "faces"
      }], {});
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  }
};
