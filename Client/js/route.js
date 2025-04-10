// client/js/routes.js

angular.module('chatApp', ['ngRoute','ngAnimate'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'ChatAppController'
      })
      
      .when('/profilepage', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController'
      })
    
      .when('/room-page', {
        templateUrl: 'views/room.html',
        controller: 'RoomMainController'
      })
      .when('/temp', {
        templateUrl: 'views/temp.html',
        controller: 'TempController'
      })
      .when("/room/:roomId", {
        templateUrl: "views/ChatRoom.html",
        controller: "ChatRoomController"
      })
      .otherwise({
        redirectTo: '/'
      });

    // Optional: use clean URLs (without hashbang)
  
  });
