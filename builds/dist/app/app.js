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
		              "ngCookies"

		              
		            ])
    .config(ngFitConfig)
    .value("someValue", {})
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
;(function(){
	"use strict";

	angular
		.module('ngFit.status', [
			                     'ngRoute'
			                     ])
		
		.controller('AuthCtrl', AuthController)
		.controller('StatusCtrl', SatusController)
		.factory('Auth', AuthFactory);


		AuthFactory.$inject = ['$http','SERVER_URL','$log','$cookies'];
 		function AuthFactory ($http,SERVER_URL,$log,$cookies) {
 			var auth ={};
            
            auth.login = function(_username, _password) {
            	var auth_url = SERVER_URL + '?login='+_username+'&password=' + _password;

            	return $http.get(auth_url).then(function(response){

            		if(response.data.status == "success"){
 						$cookies.put("auth_token", response.data.auth_token);
 						$cookies.put("id",  response.data.id);
 						$cookies.put("user_name",  _username);
 						
 						auth.user = {
 							username: _username,
 							id: response.data.id
 						};
            		}

            		$log.debug("Logged In!",response);
            	});
            };
            
 			auth.getUsername = function () {
 				if(auth.user && auth.user.username) 
 					return auth.user.username;
 				var username = $cookies.get("user_name");
 				if (username)
 					return username;
 				return null;

 			};

 			auth.logout = function () {
 				//return $http.get(SERVER_URL + "logout").then(function(response){
 					//if(response.data.success == "success"){
 						$cookies.remove("auth_token");
 						$cookies.remove("id");
 						$cookies.remove("user_name");
 						auth.user =null;
 					//}
 				//});
 			}

 			return auth;
 		}


        AuthController.$inject = ['$scope', '$log', 'Auth'];
		function AuthController($scope, $log, Auth) {
				var vm = this;

				vm.credentails = {
					username:null,
					password:null
				}

				vm.login = function(){
					//$log.debug('Login');
					Auth.login(vm.credentails.username, vm.credentails.password);
				};
				
				vm.username = function(){
					return Auth.getUsername();
				};

 		};

 		SatusController.$inject = ['$scope', '$log', 'Auth','$cookies'];
 		function SatusController($scope,$log,Auth,$cookies){
 				var vm = this;

 				vm.getUsername = function(){
 					return Auth.getUsername();
 				};

 				vm.logout = function(){
 					Auth.logout();
 					
 				}

 		};


})();