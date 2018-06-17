(function() {
  'use strict';
  angular.module('pollingApp').factory('AuthService', [
    'AppUser',
    '$q',
    '$rootScope',
    '$localStorage',
    'LoopBackAuth',
    'ngToast',
    function(AppUser, $q, $rootScope, $localStorage, LoopBackAuth, ngToast) {
      function login(mobileNumber, password) {
        return AppUser.rmlogin({ include: 'user' }, { mobileNumber: mobileNumber, password: password.toString() })
          .$promise.then(function(response) {
            LoopBackAuth.setUser(response.id, response.userId, response.user);
            LoopBackAuth.rememberMe = true;
            LoopBackAuth.save();
            $rootScope.currentUser = response.user;
            $localStorage.user = response.user;
          })
          .catch(function(error) {
            ngToast.create({
              className: 'warning',
              content: error.data.error.message,
            });
          });
      }

      function logout() {
        return AppUser.logout().$promise.then(function() {
          $rootScope.currentUser = null;
        });
      }

      function register(email, password, mobileNumber, fullName) {
        return AppUser.rmSignup({
          email: email,
          password: password.toString(),
          mobileNumber: mobileNumber,
          fullName: fullName,
        }).$promise;
      }

      function forgotPassword(email) {
        return AppUser.resetPassword({
          email: email,
        }).$promise;
      }

      function isAuthorized(authorizedRolesParam) {
        var role;
        var authorizedRoles = authorizedRolesParam;
        $rootScope.currentUser = $localStorage.user || null;
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        if (authorizedRoles[0] === '*') return true;

        if ($rootScope.currentUser && $rootScope.currentUser.admin === 2) {
          role = 'SuperAdmin';
        } else if ($rootScope.currentUser && $rootScope.currentUser.admin === 1) {
          role = 'Admin';
        } else if ($rootScope.currentUser && $rootScope.currentUser.admin === null) {
          role = 'User';
        } else {
          role = '*';
        }
        return authorizedRoles.indexOf(role) !== -1;
      }

      return {
        login: login,
        logout: logout,
        register: register,
        forgotPassword: forgotPassword,
        isAuthorized: isAuthorized,
      };
    },
  ]);
})();
