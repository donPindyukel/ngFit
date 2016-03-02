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
				user: function (Auth,$q,$location) {
                       	var user = Auth.getUsername();
                       	if(user) {
                       		return user;
                       	}
                       	else{
                       		$location.path('/');
                       		//angular.element.find("#simple-dialog");
				      	    return $q.reject({unAuthorized: true});
				             }
			}
		             }
		});
};

AboutCtrl.$inject = ['$scope','$rootScope','someValue'];
function AboutCtrl($scope,$rootScope,someValue) {

	var vm = this;
    vm.some = someValue.a;
	$rootScope.curPath = "about";
}
}());