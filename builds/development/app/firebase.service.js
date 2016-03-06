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