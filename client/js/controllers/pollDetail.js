(function() {
  /**
   * Poll Detail Controller to fetch Full Data
   */

  'use strict';

  angular.module('pollingApp').controller('PollDetailCtrl', [
    '$scope',
    '$location',
    'ngToast',
    '$localStorage',
    '$uibModal',
    '$state',
    '$stateParams',
    'Poll',
    'Vote',
    'AppUser',
    'PollOption',
    '$window',
    function(
      $scope,
      $location,
      ngToast,
      $localStorage,
      $uibModal,
      $state,
      $stateParams,
      Poll,
      Vote,
      AppUser,
      PollOption,
      $window
    ) {
      $scope.poll = [];
      $scope.selectedOption = null;
      $scope.userVote = null;
      $scope.editPoll = false;
      $scope.showEditPoll = null;
      $scope.availableOptions = [];
      $scope.newOptionBlock = false;
      $scope.newOption = { content: '', pollId: $stateParams.pollId };

      var getUserVote = function() {
        Vote.findOne({
          filter: { where: { userId: $scope.currentUser.id, pollId: $stateParams.pollId }, include: ['pollOption'] },
        }).$promise.then(function(data) {
          $scope.userVote = data;
          $scope.selectedOption = $scope.userVote.pollOption;
        });
      };

      function generateColors(howmany) {
        var result = [];
        var randomstart = Math.floor(Math.random() * 360);
        for (var i = 1; i <= howmany; i++) {
          result.push('#' + ((Math.random() * 0xffffff) << 0).toString(16));
        }
        console.log(result);
        return result;
      }

      var chartInit = function() {
        $scope.chartOptions = {
          global: {
            colors: generateColors($scope.availableOptions.length),
          },
        };
        $scope.datasets = [
          {
            backgroundColor: generateColors($scope.availableOptions.length),
          },
        ];
        $scope.chartLabels = $scope.availableOptions.map(function(opt) {
          return opt.content;
        });
        $scope.chartData = $scope.availableOptions.map(function(opt) {
          return opt.votes.length;
        });
      };

      var getPoll = function() {
        Poll.getPollFullData({ pollId: $stateParams.pollId })
          .$promise.then(function(data) {
            if (data) {
              $scope.poll = data;
              $scope.availableOptions = data.pollOptions;
              $scope.selectedOption = $scope.availableOption ? $scope.availableOptions[0] : [];
              if ($scope.currentUser.id === $scope.poll.userId) {
                $scope.editPoll = true;
              }
              getUserVote();
              chartInit();
            }
          })
          .catch(function(err) {
            $state.go('home');
          });
      };

      $scope.changeOption = function(index) {
        $scope.selectedOption = $scope.availableOptions[index];
      };

      $scope.openNewOptionBlock = function() {
        $scope.newOptionBlock = !$scope.newOptionBlock;
      };

      $scope.submitVote = function() {
        if (!$scope.userVote) {
          Vote.create({ pollId: $stateParams.pollId, pollOptionId: $scope.selectedOption.id }).$promise.then(function(
            data
          ) {
            console.log(data);
            $scope.userVote = data;
            $window.location.reload();
          });
        } else {
          $scope.userVote.pollOptionId = $scope.selectedOption.id;
          Vote.prototype$updateAttributes({}, $scope.userVote).$promise.then(function(data) {
            console.log(data);
            $scope.userVote = data;
            $window.location.reload();
          });
        }
      };

      $scope.addNewOption = function() {
        PollOption.create($scope.newOption)
          .$promise.then(function(data) {
            $scope.poll.pollOptions = data;
            $scope.newOption = { content: '', pollId: $stateParams.pollId };
            $window.location.reload();
          })
          .catch(function(err) {
            $window.location.reload();
          });
      };

      $scope.deletePoll = function() {
        Poll.prototype$updateAttributes($scope.poll, { active: false }).$promise.then(function(data) {
          console.log(data);
          $scope.userVote = data;
          $window.location.reload('/polls');
        });
      };

      $scope.savePoll = function() {
        Poll.prototype$updateAttributes({}, $scope.poll).$promise.then(function(data) {
          $scope.poll = data;
          $window.location.reload('/polls/' + $stateParams.pollId);
        });
      };

      getPoll();

      $scope.showEditBlock = function() {
        $scope.showEditPoll = true;
        $scope.editPoll = false;
      };

      $scope.showPollBlock = function() {
        $scope.showEditPoll = false;
        $scope.editPoll = true;
        $scope.getPoll();
      };
    },
  ]);
})();
