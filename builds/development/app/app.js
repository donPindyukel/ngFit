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
