(function(){
    var menu = angular.module("menu");
    menu.directive("sideTemplateMenu",sideTemplateMenu);
    menu.controller("sideMenu", sideMenuController);

    sideMenuController.$inject=["$scope","MenuService"];
    function sideMenuController ($scope,MenuService){
        $scope.menuHeader = "#TipMe";
        var promise = MenuService.getMenu();
        promise.then(function(response){
            $scope.menuData = response.data.menu;
        });
      }

      function sideTemplateMenu(){
        var ddo ={
           templateUrl: 'src/menu/menu.html'
        }
        return ddo;
      }
})()
