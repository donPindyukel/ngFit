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
		              "ngFit.fitfire.service",
		              "ngFit.status",
		              "ngCookies",
		              "Authentication"

		              
		            ])
    .config(ngFitConfig)
    .constant('SERVER_URL', 'http://ngfit.loc/auth.php')
    .constant("FIREBASE_URL", "https://burning-heat-1291.firebaseio.com/");
 

function ngFitConfig ($routeProvider, $logProvider/*, $locationProvider*/) {
	$routeProvider
		.otherwise({redirectTo:'/'});
	//$locationProvider.html5Mode(true);
	$logProvider.debugEnabled(true);
		
}


})();

;(function(){
	"use strict"

	angular.module("Authentication", [
                                       "firebase"
		                               ])
	.factory("authentication", AuthenticationFactory)

	AuthenticationFactory.$inject = ['$firebaseAuth','$rootScope','FIREBASE_URL','$log', '$firebaseObject'];
	function AuthenticationFactory($firebaseAuth, $rootScope,FIREBASE_URL, $log, $firebaseObject){

		var ref = new Firebase(FIREBASE_URL);

		function authDataCallBack(authData){

 			if(authData) {
 				var userRef = ref.child("users").child(authData.uid);
 				var user = $firebaseObject(userRef);
 				user.$loaded().then(function(){
 					$rootScope.currentUser = user;
 				});
 			}else{
 				$rootScope.currentUser = null;
 			}
 		};


		ref.onAuth(authDataCallBack);
		var auth = $firebaseAuth(ref);
		
		function authHandle (authData){
		
				console.log("Authenticated successfully", authData);	
		}

		var authObj = {
				login: function(_user, authHndl){

					authHndl = typeof authHndl !=='undefined' ? authHndl : authHandle;

					auth.$authWithPassword(_user).then(authHndl)
					.catch(function(error){
						$log.error("Error in login function", error);
					});
					
				},

				logout: function(){
						ref.unauth();
				},

				signedIn: function(){
					return !!ref.getAuth();
				},

				getAuth: function(){
					return ref.getAuth();
				},

				getEmail: function(){
					if (authObj.signedIn())

				     	return ref.getAuth().password.email;
				    return null; 
				},

				register: function (_user){

					return auth.$createUser({
						email:_user.email,
						password:_user.password
					}).then(function(userData){
						$log.debug("User "+userData.uid+" created!");
						var userRef = ref.child("users").child(userData.uid);
						userRef.set({
							firstname:_user.firstname,
							lastname:_user.lastname,
							email:_user.email,
							date:Firebase.ServerValue.TIMESTAMP

						});
						return auth.$authWithPassword({
							email:_user.email,
							password:_user.password
						});
					}).catch(function(error){
						$log.error("Create user error", error);
					});
				},

				ngAuth: function (){
					return auth;
				}
		};

		$rootScope.signedIn = function(){
			return authObj.signedIn();
		};

		return authObj;
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

         
 		 var usersRef = ref.child('users');
 		 var usersArr = $firebaseArray(usersRef);

         
         this.getUsers = function (cb) {
         	return usersArr.$loaded(cb);

         };

 		 
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
         

	}

})();
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

;(function () {
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

MainCtrl.$inject = ['$scope', '$rootScope', '$log', 'fitfire'];
function MainCtrl($scope, $rootScope, $log, fitfire) {
  	$log.debug('MainCtrl start');
    var VM = this;
     
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
;(function(){
	"use strict";

	angular
		.module('ngFit.status', [
			                     'ngRoute'
			                     ])
		
		.controller('AuthCtrl', AuthController)
		.controller('StatusCtrl', SatusController);





        AuthController.$inject = ['$scope', '$log', 'authentication'];
		function AuthController($scope, $log, authentication) {
				var vm = this;

				vm.credentails = {
					email:null,
					password:null
				};

				vm.login = function(){
					authentication.login(vm.credentails);
				};

				vm.register = function(){
					authentication.register(vm.nUser);
				};


 		};

 		

 		SatusController.$inject = ['$scope', '$log', 'authentication','$cookies'];
 		function SatusController($scope,$log,authentication){
 				var vm = this;
                 
 				vm.logout = function(){
 					authentication.logout();
 					
 				};

 				

 		}


})();