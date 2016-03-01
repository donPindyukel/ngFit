"use strict"
// initialize material design js
$.material.init();

(function(){

angular
	.module('ngFit', [
		              "ngRoute",
		              "ngFit.about",
		              "ngFit.contact",
		              "ngFit.main",
		              "ngFit.fitfire.service"
		              
		            ])
    .config(ngFitConfig)
    .value("someValue", {})
    .constant("FIREBASE_URL", "https://burning-heat-1291.firebaseio.com/");
 

function ngFitConfig ($routeProvider/*, $locationProvider*/) {
	$routeProvider
		.otherwise({redirectTo:'/'});
	//$locationProvider.html5Mode(true);
		
}


})();

;(function(){


	angular
	.module('ngFit.fitfire.service', ['firebase'])
		.service('fitfire', fitfire);


	fitfire.$inject = ['FIREBASE_URL','$firebaseObject','$firebaseArray','$log'];
	function fitfire(FIREBASE_URL, $firebaseObject,$firebaseArray,$log) {

		 var self = this;
		 var ref = new Firebase(FIREBASE_URL);
        // var refObj = $firebaseObject(ref);
        // var refArr = $firebaseArray(ref);
         
 		 var usersRef = ref.child('users');
 		 var usersArr = $firebaseArray(usersRef);

         
         this.getUsers = function (cb) {
         	return usersArr.$loaded(cb);

         };

        /* this.addUser = function(_user){
         	usersRef.push(_user);
         };*/
 		 
 		 this.addUser = function(_user, cb){
         	var usersLength = $firebaseObject(ref.child('options').child('usersLength'));
            usersLength.$loaded(function(){

            	var uLength = ++usersLength.$value;

            	usersLength.$save();
            	usersRef.child(uLength).set(_user,cb);

            });
         	};

         this.updateUser = function (_user)	{
         	return usersArr.$save(_user);
         };
         
         // refObj.$loaded(function(){
         // 	self.dbObj = refObj;
         // });
     
         //      refArr.$loaded(function() {
         //      	self.dbArr = refArr;
         // });
	}

})();
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

(function () {
angular.module("ngFit.main",["ngRoute"])
 .config(ngFitMain)
 .controller("MainCtrl",MainCtrl);




ngFitMain.$inject = ['$routeProvider']; 
 function ngFitMain ($routeProvider) {
	$routeProvider
		.when("/",{
			templateUrl:"/app/main/main.html",
			controller: "MainCtrl",
			controllerAs:"vm"
		});

};

MainCtrl.$inject = ['$scope', '$rootScope', 'someValue', '$log', 'fitfire'];
function MainCtrl($scope, $rootScope, someValue, $log, fitfire) {
  	$log.debug('MainCtrl start');
    var VM = this;
     
    $rootScope.curPath = "home";
    someValue.a = "letterA";
    VM.some = someValue.a;
    

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