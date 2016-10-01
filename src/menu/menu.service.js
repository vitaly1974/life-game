(function(){
  "use strict";
  angular.module("menu").factory("MenuService",MenuService);

  MenuService.$inject =["$http"];
  function MenuService($http){
      var instance = {
          getMenu: function(){
            return $http.get("data/categories.json");
            }
          };
      return instance;
  }
})()
