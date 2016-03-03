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