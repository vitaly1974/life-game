(function(){
    "use strict";

    var menu = angular.module("menu",["ngRoute"]);
    menu.config(function($routeProvider){
      $routeProvider
      .when("/", {
        templateUrl : "template/main.html"
      }).when("/puzles", {
        templateUrl : "template/puzzle.html"
      }).when("/overview", {
        templateUrl : "template/overview.html"
      }).when("/game", {
        templateUrl : "template/game.html"
      }).when("/contact", {
        templateUrl : "template/contact.html"
      });
    });
})()
