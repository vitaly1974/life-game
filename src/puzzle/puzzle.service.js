(function(){
  "use strict";
   var puzzle = angular.module("puzzle");
   puzzle.factory("PuzzleService",PuzzleService);

   PuzzleService.$inject =["$http","$q"];
   function PuzzleService($http, $q){
     var init = function(size){
       var field = [];
       for (var i = 0; i < size; i++) {
         var row = [];
         for (var j = 0; j < size; j++) {
           row.push(0);
         }
         field.push(row);
       }
       return field;
     }
     var instance ={
        getField: function(){
          var deffered = $q.defer();
          $http.get("data/puzzle.json").then(function(response){
             var field = init(response.data.puzzleSize);
             for (var i = 0; i < response.data.liveCells.length; i++) {
                 var live = response.data.liveCells[i];
                 field[live.i][live.j] = 1;
             }
             deffered.resolve(field);
           });
           return deffered.promise;
        },
        getEmptyField: function(a){
           return init(a);
        },
        isEmpty:function(a){
          var size = a.length;
          var result = true
          for (var i = 0; i < size; i++) {
              for (var j = 0; j < size; j++) {
                if(a[i][j]==1){
                  result = false;
                  break;
                }
              }
            }
          return result;
        },
        compareArray: function(a,b){
          var size = a.length;
          var result = true
          for (var i = 0; i < size; i++) {
              for (var j = 0; j < size; j++) {
                if(a[i][j] != b[i][j]){
                  result = false;
                  break;
                }
              }
            }
          return result;
        }
      };

     return instance;
   }
})()
