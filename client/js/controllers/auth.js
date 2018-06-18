(function() {
  'use strict';
  angular.module('pollingApp').controller('AuthLoginCtrl', [
    '$scope',
    '$location',
    'ngToast',
    '$localStorage',
    '$uibModal',
    '$window',
    '$timeout',
    '$state',
    'LoopBackAuth',
    'AppUser',
    function($scope, $location, ngToast, $localStorage, $uibModal, $window, $timeout, $state, LoopBackAuth, AppUser) {
      $scope.user = {
        mobileOrEmail: '',
        password: '',
        email: '',
        mobileNumber: '',
      };

      $scope.openSocialLogin = function(loginType) {
        var width = 600;
        var height = 500;
        var left = screen.width / 2 - width / 2;
        var top = screen.height / 2 - height / 2;
        $window.open(
          '/auth/' + loginType,
          '_blank',
          'modal=yes,toolbar=yes,scrollbars=yes,resizable=yes,top=' +
            top +
            ',left=' +
            left +
            ',width=' +
            width +
            ',height=' +
            height
        );
        // popup window has a SocialAuth controller (social-auth.js) which is in client folder.
      };

      document.addEventListener(
        'social-login',
        function(e) {
          var errorMessage = e.detail.errorMessage;
          var userInfo = e.detail.userInfo;
          $scope.$apply(function() {
            if (errorMessage) {
              var error = typeof errorMessage === 'object' ? errorMessage.message : errorMessage;
              ngToast.create({
                class: 'danger',
                content: error,
              });
              return;
            }
            if (userInfo.userId) {
              LoopBackAuth.setUser(userInfo.accessToken, userInfo.userId, null);
              AppUser.getCurrent().$promise.then(function(currentUser) {
                LoopBackAuth.setUser(userInfo.accessToken, currentUser.id, currentUser);
                LoopBackAuth.rememberMe = true;
                LoopBackAuth.save();
                $rootScope.currentUser = response.user;
                $localStorage.user = currentUser;
                $state.go('home');
              });
            } else {
              ngToast.create({
                class: 'danger',
                content: "You don't have permission to access admin dashboard.",
              });
            }
          });
        },
        true
      );
    },
  ]);
})();
