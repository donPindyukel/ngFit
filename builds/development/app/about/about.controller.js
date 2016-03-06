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

AboutCtrl.$inject = ['$scope','$rootScope','authentication'];
function AboutCtrl($scope,$rootScope,authentication) {
   console.log("About controller");
	var vm = this;
	$rootScope.curPath = "about";

	vm.authInfo = authentication.getAuth();

	vm.images = [1,2,3,4,5,6,7,8];
	console.log(vm.images.length);
	vm.loadMore = function (){
		var last = vm.images[vm.images.length-1];
		var i = 8;
		while (i--)
			vm.images.push(++last);
	};

}
}());