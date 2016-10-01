(function(){
  "use strict";
  var puzzle =  angular.module("puzzle");
  puzzle.directive("puzzleField",puzzleField);
  puzzle.directive("puzzleFieldSolve",puzzleFieldSolve);
  puzzle.controller("puzzleController",puzzleController);

  puzzleController.$inject = ["$scope","PuzzleService"];
  function puzzleController($scope, PuzzleService){
    var promise = PuzzleService.getField();
    promise.then(function(result){
       $scope.puzzleField = result;
       $scope.puzzleFieldSolve = PuzzleService.getEmptyField(result.length);
    });

    $scope.Clear = function(){
      $scope.puzzleFieldSolve = PuzzleService.getEmptyField($scope.puzzleFieldSolve.length);
    }
  }


  function puzzleField(){
    var ddo ={
      restrict: "E",
      templateUrl: 'src/puzzle/field.html',
      scope: {fieldData:"<"}
    }
    return ddo;
  }

  function puzzleFieldSolve(){
      var PuzzleFieldSolveController = function($scope){
            var ctrl = this;
            ctrl.OnCellClick = function(i,j){
                $scope.fieldData[i][j] == 0 ? $scope.fieldData[i][j] =1: $scope.fieldData[i][j] = 0;
            }
        };

        var ddo = {
          restrict:"E",
          templateUrl: 'src/puzzle/field_solve.html',
          scope:{
            fieldData:"="
          },
          controller: PuzzleFieldSolveController,
          controllerAs: "ctrl"
        };
        return ddo;
      }


})()
