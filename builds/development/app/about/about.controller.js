(function () { 
angular.module("ngFit.about",["ngRoute"])
 .config(navAbout)
 .controller("AboutCtrl",AboutCtrl);

navAbout.$inject = ['$routeProvider'];
 function navAbout ($routeProvider) {
	$routeProvider
		.when("/about",{
			templateUrl:"app/about/about.html",
			controller: "AboutCtrl",
			controllerAs:"abt"
		});
};

AboutCtrl.$inject = ['$scope','$rootScope','someValue'];
function AboutCtrl($scope,$rootScope,someValue) {

	var vm = this;
    vm.some = someValue.a;
	$rootScope.curPath = "about";
}
}());