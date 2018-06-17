function loginCallback(errorMessage, userInfo) {
  var event = new CustomEvent('social-login', {
    detail: {
      errorMessage: errorMessage,
      userInfo: userInfo,
    },
  });
  document.dispatchEvent(event);
}

(function() {
  /**
   * Polling APP client view created with AngularJS
   */

  'use strict';

  angular.module('pollingAppConstants', []).constant('USER_ROLES', {
    all: '*',
    admin: 'Admin',
    user: 'User',
    superAdmin: 'SuperAdmin',
  });

  angular
    .module('pollingApp', [
      'ngSanitize',
      'ngToast',
      'lbServices',
      'ngStorage',
      'ui.router',
      'ui.bootstrap',
      'ui.bootstrap.datetimepicker',
      'smart-table',
      'ngMaterial',
      'ngAnimate',
      'angularMoment',
      'ngFileUpload',
      'ui.sortable',
      'angularjs-dropdown-multiselect',
      'pollingAppConstants',
      'textAngular',
      '720kb.socialshare',
      'chart.js',
    ])
    .config([
      'ChartJsProvider',
      function(ChartJsProvider) {
        ChartJsProvider.setOptions({
          global: {
            colors: ['#ef5350', '#7e57c2', '#ec407a', '#ab47bc', '#5c6bc0', '#42a5f5', '#29b6f6'],
          },
        });
      },
    ])
    .config([
      '$stateProvider',
      '$locationProvider',
      '$urlRouterProvider',
      'USER_ROLES',
      '$httpProvider',
      function($stateProvider, $locationProvider, $urlRouterProvider, USER_ROLES, $httpProvider) {
        $locationProvider.html5Mode(true);

        $httpProvider.defaults.withCredentials = true;
        if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.common = {};
        }
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.common.Pragma = 'no-cache';
        $httpProvider.defaults.headers.common['If-Modified-Since'] = '0';

        $urlRouterProvider.rule(function($injector, $location) {
          var path = $location.path();
          var hasTrailingSlash = path[path.length - 1] === '/';
          if (hasTrailingSlash) {
            // if last charcter is a slash, return the same url without the slash
            var newPath = path.substr(0, path.length - 1);
            return newPath;
          }
          return undefined;
        });
        $urlRouterProvider.otherwise(function() {
          return '/';
        });

        var home = {
          name: 'home',
          url: '/hello',
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          data: {
            authorizedRoles: [USER_ROLES.all],
          },
        };

        var polls = {
          name: 'polls',
          url: '/polls',
          templateUrl: 'views/polls.html',
          controller: 'PollsCtrl',
          data: {
            authorizedRoles: [USER_ROLES.all],
          },
        };

        var userPolls = {
          name: 'userPolls',
          url: '/polls/mypolls',
          templateUrl: 'views/polls.html',
          controller: 'UserPollsCtrl',
          data: {
            authorizedRoles: [USER_ROLES.user],
          },
        };

        var pollDetail = {
          name: 'detail',
          url: '/polls/:pollId',
          templateUrl: 'views/poll-detail.html',
          controller: 'PollDetailCtrl',
          data: {
            authorizedRoles: [USER_ROLES.user],
          },
        };

        var newPoll = {
          name: 'newPoll',
          url: '/newPoll',
          templateUrl: 'views/new-poll.html',
          controller: 'NewPollCtrl',
          data: {
            authorizedRoles: [USER_ROLES.user],
          },
        };

        $stateProvider.state(newPoll);
        $stateProvider.state(userPolls);
        $stateProvider.state(home);
        $stateProvider.state(polls);
        $stateProvider.state(pollDetail);

        $stateProvider.state('login', {
          url: '/login',
          templateUrl: 'views/twitter-login.html',
          controller: 'AuthLoginCtrl',
          data: {
            authorizedRoles: [USER_ROLES.all],
          },
        });
      },
    ])
    .run([
      '$rootScope',
      '$location',
      'AuthService',
      '$window',
      '$localStorage',
      '$state',
      'AppUser',
      'LoopBackAuth',
      function($rootScope, $location, AuthService, $window, $localStorage, $state, AppUser, LoopBackAuth) {
        if (LoopBackAuth.accessTokenId) {
          AppUser.accessTokenLogin({ accessTokenID: LoopBackAuth.accessTokenId })
            .$promise.then(function(response) {
              LoopBackAuth.setUser(response.id, response.userId, response.user);
              LoopBackAuth.rememberMe = true;
              LoopBackAuth.save();
              $rootScope.currentUser = response.user;
              $localStorage.user = response.user;
            })
            .catch(function(err) {
              $rootScope.currentUser = null;
              $localStorage.user = null; //reset the current user anyway
              $location.path('/login');
            });
        }

        $rootScope.$on('$stateChangeStart', function(event, next) {
          var authorizedRoles = next.data ? next.data.authorizedRoles : null;
          if (LoopBackAuth && LoopBackAuth.accessTokenId) {
            // when user is logged in process here;
          } else {
            delete $localStorage.user;
          }
          console.log(AuthService.isAuthorized(authorizedRoles));
          if (!AuthService.isAuthorized(authorizedRoles)) {
            $state.go('login');
          } else if (AuthService.isAuthorized(authorizedRoles)) {
            $rootScope.currentUser = $localStorage.user || null;
            // if user is admin
            if ($rootScope.currentUser && ($rootScope.currentUser.admin === 2 || $rootScope.currentUser.admin === 1)) {
              if (next.name === 'login') {
                $state.go('polls');
              }
            } else {
              // if user is guest
            }
          }
        });
      },
    ]);
})();
