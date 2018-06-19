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
        $scope.allPolls = $scope.allPolls.map(function(poll) {
          poll.chartEmpty = true;
          poll.chartLabels = poll.pollOptions.map(function(opt) {
            return opt.content;
          });
          poll.chartData = poll.pollOptions.map(function(opt) {
            if (opt.votes > 0) {
              poll.chartEmpty = false;
            }
            return opt.votes;
          });
          poll.colors = {
            backgroundColor: generateColors(poll.pollOptions.length),
            borderColor: '#1B1B1E',
            borderWidth: 2,
          };
          poll.chartOptions = { legendscales: getScaleFactor() };
          poll.chartType = availableCharts[Math.floor(Math.random() * availableCharts.length)];
          return poll;
        });
        console.log($scope.chartEmpty);
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
