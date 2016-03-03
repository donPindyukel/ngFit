(function () { 
angular.module("ngFit.about",["ngRoute", "ngFit.status"])
 .config(navAbout)
 .controller("AboutCtrl",AboutCtrl);

navAbout.$inject = ['$routeProvider'];
 function navAbout ($routeProvider) {
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

AboutCtrl.$inject = ['$scope','$rootScope','authentication'];
function AboutCtrl($scope,$rootScope,authentication) {

	var vm = this;
	$rootScope.curPath = "about";

	vm.authInfo = authentication.getAuth();

}
}());