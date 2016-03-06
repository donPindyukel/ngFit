(function () { 
angular.module("ngFit.about",["ngRoute"])
 .config(navAbout)
 .controller("AboutCtrl",AboutCtrl);

navAbout.$inject = ['$routeProvider'];
 function navAbout ($routeProvider) {
 	console.log("About config");
	$routeProvider
		.when("/about",{
			templateUrl:"app/about/about.html",
			controller: "AboutCtrl",
			controllerAs:"abt",
			resolve: {
				currentAuth : function(authentication, $location) {
					return authentication.ngAuth().$requireAuth().then(null, function(){$location.path('/');});
					}
			}
		});
};

AboutCtrl.$inject = ['$scope','$rootScope','authentication','fitfire'];
function AboutCtrl($scope,$rootScope,authentication,fitfire) {
   console.log("About controller");
	var vm = this;
	$rootScope.curPath = "about";

	vm.authInfo = authentication.getAuth();

	vm.users = [];
	var last = 0;
	vm.loadMore = function (){
		fitfire.getData(""+last,20).then(function(_data){
			angular.forEach(_data, function(elem){
				vm.users.push(elem);
				last++;
			});
		});
	};

}
}());