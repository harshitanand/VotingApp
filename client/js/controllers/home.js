(function() {
  /**
   * Polls Controller to fetch all Polls
   */

  'use strict';

  angular
    .module('pollingApp')
    .controller('HomeCtrl', [
      '$scope',
      '$location',
      'ngToast',
      '$localStorage',
      '$uibModal',
      '$state',
      'Poll',
      'AppUser',
      function($scope, $location, ngToast, $localStorage, $uibModal, $state, Poll, AppUser) {},
    ]);
})();
