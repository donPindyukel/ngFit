;(function(){
	"use strict"

	angular.module("Authentication", [
                                       "firebase"
		                               ])
	.factory("authentication", AuthenticationFactory)

	AuthenticationFactory.$inject = ['$firebaseAuth','$rootScope','FIREBASE_URL'];
	function AuthenticationFactory($firebaseAuth, $rootScope,FIREBASE_URL){

		var ref = new Firebase(FIREBASE_URL);

		//var auth = $firebaseAuth(ref);
		
		function authHandle (error, authData){
			if(error){
				console.log("login failed!", error);
			}else{ 
				console.log("Authenticated successfully", authData);	
			}
		}

		var authObj = {
				login: function(_user, authHndl){

					authHndl = typeof authHndl !=='undefined' ? authHndl : authHandle;

					ref.authWithPassword(_user, authHndl);
					
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
		};

		$rootScope.signedIn = function(){
			return authObj.signedIn();
		};

		return authObj;
	}
})();