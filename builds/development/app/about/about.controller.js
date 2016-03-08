(function () { 
angular.module("ngFit.about",["ngRoute"])
 .config(navAbout)
 .animation(".animate-new",function(){
 	return {
 			enter:function(element,done){
 				console.log("enter");
 			},
 			leave:function(ekement, done){
 				console.log("leave");
 			},
 			move:function(element,done){
 				console.log("move");
 			},
 			//ngShow
 			addClass:function(element,newClassName,done){
 				console.log("addClass ", newClassName);
 				$(element).animate({width:'0%'},done);
 				element.css({border:"5px solid red"});
 			},
 			//ngHide
 			removeClass:function(element,removeClassName,done){
 				console.log("removeClass ", removeClassName);
 				$(element).animate({width:'100%'},done);
 				element.css({border:"1px solid black"});
 			}
 	}
 })
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

AboutCtrl.$inject = ['$scope','$rootScope','authentication','fitfire'];
function AboutCtrl($scope,$rootScope,authentication,fitfire) {
   console.log("About controller");
	var vm = this;
	$rootScope.pageClass = "page-about";  
	$rootScope.curPath = "about";

	vm.authInfo = authentication.getAuth();

	vm.users = [];
	var last = 0;
	vm.loadMore = function (){
		fitfire.getData(""+last,20).then(function(_data){
			angular.forEach(_data, function(elem){
				vm.users.push(elem);
				last++;
			});
		});
	};

	vm.hide = true;

}
}());