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
        Poll.getAllPolls()
          .$promise.then(function(data) {
            $scope.allPolls = data;
            chartInit();
          })
          .catch(function(err) {
            console.log(err);
          });
      };

      $scope.fetchPolls();
    },
  ]);
})();
