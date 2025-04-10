// firebase-auth.js
const firebaseConfig = {


  apiKey: "AIzaSyAH_XqMC9e4mVJTQkXPAXMr-lp-lFhHcPc",
  authDomain: "farmer-app-bbf77.firebaseapp.com",
  projectId: "farmer-app-bbf77",
 
  appId: "1:509149135649:web:fef916d05cc3ca8e6df460",
  
};

firebase.initializeApp(firebaseConfig);

angular.module("chatApp").controller("NavbarController", function ($scope, authService) {
  $scope.user = null;

  $scope.signInWithGoogle = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        $scope.$apply(() => {
          $scope.user = result.user;
          console.log("Signed in:", $scope.user.displayName);
        });
      })
      .catch((error) => {
        console.error("Auth error:", error);
      });
  };

  $scope.signOut = function () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        $scope.$apply(() => {
          $scope.user = null;
        });
      });
  };

  // Check auth state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const firebaseUser = {
          email: user.email,
          name: user.displayName,
          imageLink: user.photoURL
        };
        localStorage.setItem("firebaseUser", JSON.stringify(firebaseUser));
      }
      
    $scope.$apply(() => {
      $scope.user = user;
    });
  });
});
