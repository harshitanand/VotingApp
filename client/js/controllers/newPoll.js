(function() {
  /**
   * Polls Controller to fetch all Polls
   */

  'use strict';

  angular.module('pollingApp').controller('NewPollCtrl', [
    '$scope',
    '$location',
    'ngToast',
    '$localStorage',
    '$uibModal',
    '$state',
    'Poll',
    'AppUser',
    function($scope, $location, ngToast, $localStorage, $uibModal, $state, Poll, AppUser) {
      $scope.newOption = '';
      var counter = 0;

      $scope.poll = {
        primaryContent: '',
        description: '',
        pollOptions: [{ id: counter, content: '' }],
      };

      $scope.addOption = function() {
        counter++;
        $scope.poll.pollOptions.push({ id: counter, content: '' });
        console.log($scope.poll);
        $scope.addNewOption = true;
      };

      $scope.savePoll = function() {
        Poll.createNewPoll({ data: $scope.poll })
          .$promise.then(function(data) {
            $scope.poll = data;
            $state.go('userPolls');
          })
          .catch(function(err) {
            $state.go('userPolls');
          });
      };
    },
  ]);
})();
