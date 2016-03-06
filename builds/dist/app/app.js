"use strict"
// initialize material design js
$.material.init();

(function(){

angular
	.module('ngFit', [
		              "ngRoute",
		              "ngFit.fitfire.service",
		              "ngFit.status",
		              "ngCookies",
		              "Authentication",
		              "ngFit.main",
		              "ngFit.about",
		              "ngFit.contact",
		              "infinite-scroll"

		              

		              
		            ])
    .config(ngFitConfig)
    .constant('SERVER_URL', 'http://ngfit.loc/auth.php')
    .constant("FIREBASE_URL", "https://burning-heat-1291.firebaseio.com/")
    .run(Run);
 

function ngFitConfig ($routeProvider, $logProvider/*, $locationProvider*/) {
	console.log("Config app");
	$routeProvider
		.otherwise({redirectTo:'/'});
	//$locationProvider.html5Mode(true);
	$logProvider.debugEnabled(true);
		
}

function Run(authentication, fitfire){
	console.log('Run');
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
        console.log("Auth Factory");
		var ref = new Firebase(FIREBASE_URL);

		function authDataCallBack(authData){

 			if(authData) {
 				var userRef;
 				if (authData.google && authData.google.id)
 					userRef = ref.child("users").child(authData.google.id);
 				else
 					userRef = ref.child("users").child(authData.uid);
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
		};


		function socialAuthHandle (error, authData){
			if (error){
				console.warn("Login failed",error);

			}else{
				console.log("Social logged in ", authData);
				var userRef = ref.child("users").child(authData.google.id);
				var user = $firebaseObject(userRef);
				user.$loaded(function(){
					if(user.email){
						userRef.child("lastActivity").set(Firebase.ServerValue.TIMESTAMP);
					}else{
						userRef.set({
							"email": authData.google.email,
							"name": authData.google.displayName,
							"avatar": authData.google.cachedUserProfile.picture,
							"id": authData.google.id,
							"token": authData.token,
							"uid": authData.uid,
							"expires": authData.expires,
							"accessToken": authData.google.accessToken,
							"lastActivity": Firebase.ServerValue.TIMESTAMP

						});
					}
				});
			}

		}

		var authObj = {
				login: function(_user, authHndl){

					authHndl = typeof authHndl !=='undefined' ? authHndl : socialAuthHandle;

					auth.$authWithPassword(_user).then(authHndl)
					.catch(function(error){
						$log.error("Error in login function", error);
					});
					
				},

				googleLogin: function(_user, authHndl) {
					authHndl = typeof authHndl !=='undefined' ? authHndl : socialAuthHandle;
					ref.authWithOAuthPopup("google", authHndl, {
						scope: "profile,\ email"							
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
      console.log("fitfire service")
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
(function () {

angular.module("ngFit.contact",["ngRoute"])
.config(navContact)
.controller("ContactCtrl", ContactCtrl)
.factory('Son', function($q) {
	var o = {};

	o.go2Shop = function(){
		var deferred = $q.defer();
		setTimeout(function(){
			deferred.notify("Я пошел в магазин " + new Date());
		},50);

		setTimeout(function(){
			deferred.notify("Я пришел в магазин" + new Date());
			var eggs = parseInt(Math.random()*100);
			if (eggs % 2){
 				deferred.resolve(eggs);
			}
			else{
				deferred.reject("Магазин закрыт!");
			}
		}, 2000);
		
		return deferred.promise;
	};

	o.go2Grandma = function(){
		var deferred = $q.defer();
		setTimeout(function(){
			deferred.notify("Я пошел к бабуле " + new Date());
		},100);

		setTimeout(function(){
			deferred.notify("Я пришел к бабуле" + new Date());
			var eggs = parseInt(Math.random()*100);
			if (eggs % 2){
 				deferred.resolve(eggs);
			}
			else{
				deferred.reject("Бабуля на даче!");
			}
		}, 4000);
		
		return deferred.promise;
	};

	return o;
});

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

ContactCtrl.$inject = ['$scope','$rootScope','currentAuth','$timeout','Son','$q'];
function ContactCtrl($scope,$rootScope,currentAuth,$timeout,Son,$q) {
	 console.log("Contact controller");
	var vm = this;
	$rootScope.curPath = "contact";


	

	vm.sendSon = function () {

		var son1 = Son.go2Shop().then(
//+resolve
            	function(data){
            	console.log("Делаю яичницу из " + data + " яиц");
  //- reject
            }, function(error){
            	console.log("Нет яиц. Делай бутеры!", error);
  // notify
            }, function(msg) {
            	console.log("Сын1 сказал: " + msg); 
            });
	var son2 = Son.go2Grandma().then(
//+resolve
            	function(data){
            	console.log("Молодец " + data + "");
  //- reject
            }, function(error){
            	console.log("Сходишь позже ", error);
  // notify
            }, function(msg) {
            	console.log("Сын2 сказал: " + msg); 
            });
       $q.all([son1,son2]).then(function(){
        	console.log("Дети вернулись");
        });

	};

	vm.sendDaughter = function () {

    
	};


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

				vm.googleLogin = function () {
					authentication.googleLogin();
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