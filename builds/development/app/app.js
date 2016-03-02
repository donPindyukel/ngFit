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
