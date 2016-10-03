//Player1 status: 1-live 8-marked
//Player2 status: 2-live 9-marked
(function(){
  "use strict";
  var app = angular.module("app",["ngRoute","menu","puzzle","winners"]);
  app.filter("CssCellStatus",CssCellStatusFilter);
  app.service("LifeService",LifeService);

  app.controller("gameController", function($scope, LifeService){
    var interval;
      LifeService.initField(25);
      $scope.Players = {
          availableOptions: [
            {id: '0', name: 'Player1'},
            {id: '1', name: 'Player2'}
          ],
          selectedOption: {id: '0', name: 'Player1'} //This sets the default value of the select in the ui
        };
      $scope.CountGeneration = 0;
      $scope.Player1 = 0;
      $scope.Player2 = 0;
      $scope.CountLive = 1;
      $scope.Field  = LifeService.getField();
      $scope.ChangeCell = function(a,b){
        LifeService.ChangeCell(a,b,$scope.Players.selectedOption.id);
      }
      $scope.NewGame = function(){
        $scope.CountGeneration = 0;
        $scope.Player1 = 0;
        $scope.Player2 = 0;
        clearInterval(interval);
        LifeService.clearField();
      }
      $scope.NextStep = function(){
        var live = LifeService.NextGeneration();
        $scope.CountGeneration++;
      }
      $scope.Play = function(){
        interval = setInterval(function(){
          $scope.NextStep();
          $scope.$digest();
        },800);
      }

      $scope.Stop = function(){
        clearInterval(interval);
        var r = LifeService.getResult();
        $scope.Player1 = r[0];
        $scope.Player2 = r[1];
      }


  })

  function LifeService(){
    var size = 10;
    var countNeihboursPlayer1 = [];
    var countNeihboursPlayer2 = [];
    var countLive = [];
    var onChange = function(a,b,c,p){
      var inc = c?1:-1;
      for (var i = a-1; i < a+2; i++) {
        for (var j = b-1; j < b +2; j++) {
          if(i > -1 && i < size){
            if(j > -1 && j < size){
              if(i != a || j != b)
               if(p == "1"){
                 countNeihboursPlayer2[i][j] =countNeihboursPlayer2[i][j] + inc;
               }
               else {
                 countNeihboursPlayer1[i][j] =countNeihboursPlayer1[i][j] + inc;
               }
            }
          }
        }
      }
    }
    var instance = {
        field : [],
        initField:  function(s){
          size = s;
            for (var i = 0; i < size; i++) {
              var row = [];
              var temprow =[];
              var temprow1 =[];
              for (var j = 0; j < size; j++) {
                row.push(0);
                temprow.push(0);
                temprow1.push(0);
              }
              this.field.push(row);
              countNeihboursPlayer1.push(temprow);
              countNeihboursPlayer2.push(temprow1);
            }
          },
          clearField: function(){
            var size = this.field.length;
            for (var i = 0; i < size; i++) {
              for (var j = 0; j < size; j++) {
                this.field[i][j] = 0;
                countNeihboursPlayer1[i][j] = 0;
                countNeihboursPlayer2[i][j] = 0;
              }
            }
          },
          getField: function(){
             return this.field;
          },
          ChangeCell: function(a,b,p){
            var livenum = p==0?1:2;
            this.field[a][b]?this.field[a][b] = 0: this.field[a][b] =livenum;
            onChange(a,b,this.field[a][b],p);
          },
          getResult: function(){
            var result = [0,0];
            for (var i = 0; i < size; i++) {
              for (var j = 0; j < size; j++) {
                var t =  this.field[i][j]
                  if(t == 1 || t == 8){result[0]++};
                  if(t == 2 || t == 9){result[1]++};
              }
            }
            return result;
          },
          NextGeneration: function(){
            var changes = [];
            for (var i = 0; i < size; i++) {
              for (var j = 0; j < size; j++) {
                if(this.field[i][j] ==0 || this.field[i][j] == 8  || this.field[i][j] == 9 || this.field[i][j] == 2){
                   if( countNeihboursPlayer1[i][j] ==3){
                     if(this.field[i][j] == 2){
                       changes.push({x:i,y:j,r:0,p:1});
                     }
                     this.field[i][j] =1;
                     changes.push({x:i,y:j,r:1,p:0});
                   }
                }else {
                  if(this.field[i][j] ==1)
                  {
                  if( countNeihboursPlayer1[i][j] < 2 || countNeihboursPlayer1[i][j] > 3){
                    this.field[i][j] = 8;
                    changes.push({x:i,y:j,r:0,p:0});
                  }
                }
              }
              }
            }
            for (var i = 0; i < changes.length; i++) {
              var res = changes[i];
              onChange(res.x, res.y, res.r,res.p);
            }
            changes = [];
            for (var i = 0; i < size; i++) {
              for (var j = 0; j < size; j++) {
                  if(this.field[i][j] ==0 || this.field[i][j] == 8  || this.field[i][j] == 9 || this.field[i][j] == 1){
                     if( countNeihboursPlayer2[i][j] ==3){
                       if(this.field[i][j] == 1){
                         changes.push({x:i,y:j,r:0,p:0});
                       }
                       this.field[i][j] =2;
                       changes.push({x:i,y:j,r:1,p:1});
                     }
                  }else {
                  if(this.field[i][j] ==2){
                    if( countNeihboursPlayer2[i][j] < 2 || countNeihboursPlayer2[i][j] > 3){
                      this.field[i][j] = 9;
                      changes.push({x:i,y:j,r:0,p:1});
                    }
                  }
                }
              }
            }
            for (var i = 0; i < changes.length; i++) {
              var res = changes[i];
              onChange(res.x, res.y, res.r,res.p);
            }
          }


    };
    return instance;
  };

  function CssCellStatusFilter(){
    return function(a){
     switch (a) {
       case 0:
          return "dead";
         break;
       case 1:
         return "live1";
         break;
         case 2:
           return "live2";
           break;
          case 8:
          return "pl1";
          break;
       default:
        return "pl2";
     }
    }
  }
})();
