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
      $scope.shareUrl = 'http://' + $window.location.host + '/polls/' + $stateParams.pollId;

      var getUserVote = function() {
        Vote.findOne({
          filter: { where: { userId: $scope.currentUser.id, pollId: $stateParams.pollId }, include: ['pollOption'] },
        })
          .$promise.then(function(data) {
            $scope.userVote = data;
            $scope.selectedOption = $scope.userVote.pollOption;
          })
          .catch(function(err) {
            console.log(err);
          });
      };

      var availableCharts = ['bar', 'doughnut', 'pie', 'horizontalBar'];

      function generateColors(howmany) {
        var result = [];
        var randomstart = Math.floor(Math.random() * 360);
        for (var i = 1; i <= howmany; i++) {
          result.push('hsl(' + ((randomstart + i * 20) % 360) + ',75%,60%)');
        }
        return result;
      }

      function getScaleFactor() {
        var xAxes = [
          {
            display: false,
            gridLines: {
              display: true,
              drawBorder: false,
              drawTicks: true,
              color: 'rgba(0,0,0, 0)',
              zeroLineColor: '#ED6A5A',
              zeroLineWidth: 3,
            },
            ticks: {
              display: true,
              beginAtZero: true,
            },
          },
        ];
        var yAxes = [
          {
            type: 'linear',
            display: false,
            gridLines: {
              color: 'hsla(0, 30%, 30%, 0.2)',
              display: true,
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: true,
              lineWidth: 1,
              zeroLineWidth: 3,
              zeroLineColor: '#ED6A5A',
            },
            barPercentage: 0.5,
            ticks: {
              display: true,
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ];

        var legend = {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 5,
            fontSize: 15,
            padding: 15,
          },
        };

        return { legend: legend, scales: { xAxes: xAxes, yAxes: yAxes } };
      }

      var chartInit = function() {
        $scope.poll.chartLabels = $scope.availableOptions.map(function(opt) {
          return opt.content;
        });
        $scope.poll.chartData = $scope.availableOptions.map(function(opt) {
          return opt.votes.length;
        });
        $scope.poll.colors = {
          backgroundColor: generateColors($scope.poll.pollOptions.length),
          borderColor: '#1B1B1E',
          borderWidth: 2,
        };
        $scope.poll.chartOptions = { legendscales: getScaleFactor() };
        $scope.poll.chartType = availableCharts[Math.floor(Math.random() * availableCharts.length)];
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
            console.log(err);
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
          Vote.create({ pollId: $stateParams.pollId, pollOptionId: $scope.selectedOption.id })
            .$promise.then(function(data) {
              console.log(data);
              $scope.userVote = data;
              $window.location.reload();
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          $scope.userVote.pollOptionId = $scope.selectedOption.id;
          Vote.prototype$updateAttributes({}, $scope.userVote)
            .$promise.then(function(data) {
              console.log(data);
              $scope.userVote = data;
              $window.location.reload();
            })
            .catch(function(err) {
              console.log(err);
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
            console.log(err);
            $window.location.reload();
          });
      };

      $scope.deletePoll = function() {
        Poll.prototype$updateAttributes($scope.poll, { active: false })
          .$promise.then(function(data) {
            console.log(data);
            $scope.userVote = data;
            $state.go('polls');
          })
          .catch(function(err) {
            console.log(err);
          });
      };

      $scope.savePoll = function() {
        Poll.prototype$updateAttributes({}, $scope.poll)
          .$promise.then(function(data) {
            $scope.poll = data;
            $window.location.reload();
          })
          .catch(function(err) {
            console.log(err);
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
