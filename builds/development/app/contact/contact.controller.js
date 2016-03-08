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

	$rootScope.pageClass = "page-contact";  
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