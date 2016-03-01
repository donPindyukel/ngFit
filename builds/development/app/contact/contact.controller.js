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
			controllerAs:"cnt"
		});
};

ContactCtrl.$inject = ['$scope','$rootScope','someValue'];
function ContactCtrl($scope,$rootScope,someValue) {
	var vm = this;
    someValue.a = "LeteerB";
	$rootScope.curPath = "contact";


};
}());