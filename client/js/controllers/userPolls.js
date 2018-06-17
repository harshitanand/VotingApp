(function() {
  /**
   * Polls Controller to fetch all Polls
   */

  'use strict';

  angular.module('pollingApp').controller('UserPollsCtrl', [
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
        Poll.find({ filter: { where: { userId: $scope.currentUser.id, active: true } } })
          .$promise.then(function(data) {
            $scope.allPolls = data;
          })
          .catch(function(error) {
            $scope.showAddPollBlock = true;
            console.log(err);
          });
      };

      $scope.fetchPolls();
    },
  ]);
})();
