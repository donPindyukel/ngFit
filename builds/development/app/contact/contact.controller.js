(function () {

angular.module("ngFit.contact",["ngRoute"])
.config(navContact)
.controller("ContactCtrl", ContactCtrl);

navContact.$inject = ['$routeProvider'];
function navContact ($routeProvider) {
	 console.log("Contact config");
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

ContactCtrl.$inject = ['$scope','$rootScope','currentAuth','$timeout'];
function ContactCtrl($scope,$rootScope,currentAuth,$timeout) {
	 console.log("Contact controller");
	var vm = this;
	$rootScope.curPath = "contact";

	vm.curAuth = currentAuth;

	vm.message = "gfhj";

	$scope.$watch("cnt.message",function(newVal,oldVal){
		console.log("$watch");
		console.log("oldVal",oldVal);
		console.log("newVal",newVal);
	});

	$scope.$on('init', function(event,data){
		console.log("contact init event");
		vm.message = "data";
	});

	$timeout(function(){
		
			vm.message = "Hello!";
		console.log(vm.message);},3000);

}



}());