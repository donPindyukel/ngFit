(function () {

angular.module("ngFit.contact",["ngRoute"])
.config(navContact)
.controller("ContactCtrl", ContactCtrl);

navContact.$inject = ['$routeProvider'];
function navContact ($routeProvider) {
	$routeProvider
		.when("/contact",{
			templateUrl:"/app/contact/contact.html",
			controller: "ContactCtrl",
			controllerAs:"cnt",
			resolve: {
				currentAuth : function(authentication, $location) {
					return authentication.ngAuth().$requireAuth().then(null, function(){$location.path('/');});
					}
			}
		});
};

ContactCtrl.$inject = ['$scope','$rootScope','currentAuth'];
function ContactCtrl($scope,$rootScope,currentAuth) {
	var vm = this;
	$rootScope.curPath = "contact";

	vm.curAuth = currentAuth;


};
}());