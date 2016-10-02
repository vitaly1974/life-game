(function(){
  "use strict";
  var puzzle =  angular.module("puzzle");
  puzzle.directive("puzzleField",puzzleField);
  puzzle.directive("puzzleFieldSolve",puzzleFieldSolve);
  puzzle.controller("puzzleController",puzzleController);

  puzzleController.$inject = ["$scope","PuzzleService","$interval"];
  function puzzleController($scope, PuzzleService,$interval){

    var stop;
    $scope.CountGen = 0;

    var ClearField = function(){
      if(angular.isDefined(stop)){
        $interval.cancel(stop);
        stop = undefined;
      }
      $scope.puzzleFieldSolve = PuzzleService.getEmptyField($scope.puzzleField.length);
      $scope.puzzleFieldGen = PuzzleService.getEmptyField($scope.puzzleField.length);
    }

    var inRange = function(min,max, val){
       return (val < max && val > min);
    };

    var onChange = function(a,b,r){
      var inc = r?1:-1;
      var size = $scope.puzzleFieldGen.length;
      for (var i = a-1; i < a+2; i++) {
        for (var j = b-1; j < b +2; j++) {
          if(inRange(-1,size,i) && inRange(-1,size,j)){
              if(i != a || j != b){
                  $scope.puzzleFieldGen[i][j] = $scope.puzzleFieldGen[i][j] + inc;
              }
            }
          }
        }
      };

    var NextGeneration = function(){
      var changes = [];
      var size = $scope.puzzleFieldGen.length;
      for (var i = 0; i < size; i++) {
          for (var j = 0; j < size; j++) {
             if($scope.puzzleFieldSolve[i][j] == 0){
                if($scope.puzzleFieldGen[i][j] == 3){
                    $scope.puzzleFieldSolve[i][j] = 1;
                    changes.push({x:i, y:j, r: 1});
                }
             }
             if($scope.puzzleFieldSolve[i][j] == 1){
               if($scope.puzzleFieldGen[i][j] < 2 || $scope.puzzleFieldGen[i][j] > 3){
                   $scope.puzzleFieldSolve[i][j] = 0;
                   changes.push({x:i, y:j, r: 0});
               }
             }
          }
      }
      for (var i = 0; i < changes.length; i++) {
         onChange(changes[i].x,changes[i].y,changes[i].r);
      }
      $scope.CountGen++;
    }

    $scope.Clear = function(){
      ClearField();
    }

    $scope.OnChange = function(a,b,c){
      onChange(a,b,c);
    }

    var promise = PuzzleService.getField();
    promise.then(function(result){
       $scope.puzzleField = result;
       ClearField();
    });

    $scope.ChekIt = function(){
      if(angular.isDefined(stop)){
        return;
      }
      stop = $interval(function(){
        NextGeneration();
        if(PuzzleService.compareArray($scope.puzzleField,$scope.puzzleFieldSolve)){
          $interval.cancel(stop);
          stop = undefined;
          alert($scope.CountGen);
        }
        if(PuzzleService.isEmpty($scope.puzzleFieldSolve)){
          $interval.cancel(stop);
          stop = undefined;
          alert($scope.CountGen);
        }
      },1000);

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
                $scope.onChange({a:i,b:j, c:$scope.fieldData[i][j]});
            }

        };

        var ddo = {
          restrict:"E",
          templateUrl: 'src/puzzle/field_solve.html',
          scope:{
            fieldData:"=",
            onChange: "&"
          },
          controller: PuzzleFieldSolveController,
          controllerAs: "ctrl"
        };
        return ddo;
      }


})()
