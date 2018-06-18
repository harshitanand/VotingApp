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
      $scope.chartEmpty = true;

      var chartInit = function() {
        $scope.allPolls = $scope.allPolls.map(function(poll) {
          poll.chartLabels = poll.pollOptions.map(function(opt) {
            return opt.content;
          });
          poll.chartData = poll.pollOptions.map(function(opt) {
            if (opt.votes > 0 && $scope.chartEmpty) {
              $scope.chartEmpty = !$scope.chartEmpty;
            }
            return opt.votes;
          });
          return poll;
        });
      };

      $scope.fetchPolls = function(params) {
        Poll.getActiveUserPolls()
          .$promise.then(function(data) {
            $scope.allPolls = data;
            chartInit();
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
