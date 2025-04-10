// client/js/services/authService.js

angular.module('chatApp').factory('authService', function($rootScope) {
    const auth = firebase.auth();
    let currentUser = null;
  
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      $rootScope.user = user; // make globally accessible
      $rootScope.$apply();    // update view
    });
  
    return {
      getUser: function () {
        return currentUser;
      },
      signInWithGoogle: function () {
        const provider = new firebase.auth.GoogleAuthProvider();
        return auth.signInWithPopup(provider);
      },
      signOut: function () {
        return auth.signOut();
      }
    };
  });
  