;(function(){
	"use strict";

	angular
		.module('ngFit.status', [
			                     'ngRoute'
			                     ])
		
		.controller('AuthCtrl', AuthController)
		.controller('StatusCtrl', SatusController)/*.factory('Auth', AuthFactory)*/;


		/*AuthFactory.$inject = ['$http','SERVER_URL','$log','$cookies'];
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
 		}*/


        AuthController.$inject = ['$scope', '$log', 'authentication'];
		function AuthController($scope, $log, authentication) {
				var vm = this;

				vm.credentails = {
					email:null,
					password:null
				}

				vm.login = function(){
					authentication.login(vm.credentails)
				}

				// vm.login = function(){
				// 	//$log.debug('Login');
				// 	Auth.login(vm.credentails.username, vm.credentails.password);
				// };
				
				// vm.username = function(){
				// 	return Auth.getUsername();
				// };

 		};

 		SatusController.$inject = ['$scope', '$log', 'authentication','$cookies'];
 		function SatusController($scope,$log,authentication,$cookies){
 				var vm = this;

 				vm.getUsername = function(){
 					//return Auth.getUsername();
 				};

 				vm.logout = function(){
 					authentication.logout();
 					
 				}

 		};


})();