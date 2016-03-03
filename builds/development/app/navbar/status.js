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