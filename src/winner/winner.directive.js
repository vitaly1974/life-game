(function(){
  "use strict";

  var winners = angular.module("winners");
  winners.directive("winnerList",winnerListDirective);

  function winnerListDirective(){
    var ddo = {
      templateUrl: "src/winner/winners.html"
    }

    return ddo;
  }

})()
