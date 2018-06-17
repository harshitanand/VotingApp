(function() {
  /**
   * Polls Controller to fetch all Polls
   */

  'use strict';

  angular.module('pollingApp').controller('PollsCtrl', [
    '$scope',
    '$location',
    'ngToast',
    '$localStorage',
    '$uibModal',
    '$state',
    'Poll',
    'AppUser',
    function($scope, $location, ngToast, $localStorage, $uibModal, $state, Poll, AppUser) {
      $scope.allPolls = [];
      $scope.showAddPollBlock = false;

      $scope.fetchPolls = function(params) {
        Poll.getAllPolls().$promise.then(function(data) {
          $scope.allPolls = data;
        });
      };

      $scope.fetchPolls();
    },
  ]);
})();
