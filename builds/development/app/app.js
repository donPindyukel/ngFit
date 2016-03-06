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
		              "ngFit.contact"
		              

		              
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
