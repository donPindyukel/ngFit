
;(function () {
angular.module("ngFit.main",["ngRoute"])
 .config(ngFitMain)
 .controller("MainCtrl",MainCtrl);




ngFitMain.$inject = ['$routeProvider']; 
 function ngFitMain ($routeProvider) {
    console.log("Main config")
	$routeProvider
		.when("/",{
			templateUrl:"/app/main/main.html",
			controller: "MainCtrl",
			controllerAs:"vm"
		});

};

MainCtrl.$inject = ['$scope', '$rootScope', '$log', 'fitfire'];
function MainCtrl($scope, $rootScope, $log, fitfire) {
  	$log.debug('MainCtrl start');
    var VM = this;
    $rootScope.pageClass = "page-main";  
    $rootScope.curPath = "home";
    

	VM.title = "Это приветственная страница";
	VM.name = "Andrey";
	VM.clickFunction = function (name) {
		alert("Hi "+name);
	};

	fitfire.getUsers(function(_d){
    	VM.users = _d;
    });

     VM.user = null;

     VM.addUser = function() {
     	//console.log(VM.user);
     	fitfire.addUser(VM.user, VM.resetEdit);

     };

     VM.setEdit = function(_user) {

     	VM.user = _user;

     };

     VM.updateUser = function (){
     	fitfire.updateUser(VM.user).then(VM.resetEdit);
     };

     VM.resetEdit = function () {
     	VM.user = {
     			name:null,
     			age:0
     		};
     };

     VM.closeEdit = function(){
     	VM.user = null;
     }

	$log.debug('MainCtrl finish');
}
}());