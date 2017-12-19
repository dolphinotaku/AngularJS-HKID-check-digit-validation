var app = angular.module("myApp", []);

app.directive('hkid', ['$rootScope', function($rootScope, $cookies) {
    function HKIDConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.hkid_dCtrl;
		
        function InitializeEntry() {
            $ctrl.ngModel = {};
        }
        $scope.Initialize = function(){
            $scope.InitScope();
            if(typeof $scope.EventListener == "function"){
                $scope.EventListener($scope, $element, $attrs, $ctrl);
            }else{
                EventListener();
            }
        }
        $scope.InitScope = function(){
            InitializeEntry();
        }

        function EventListener(){
            //console.log("scope.$id:"+$scope.$id+", may implement $scope.EventListener() function in webapge");
        }
		
        function StatusChange(){
            //console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");
        }
		
		$scope.StatusChangeOnRecordList = function(scope, _hkidDataSource){

				$scope.hkidData.resultSet = [];
				$scope.hkidData.duplicatedHKID = [];
				$scope.hkidData.resultCount = {};
				$scope.hkidData.resultCount.pass = 0;
				$scope.hkidData.resultCount.fail = 0;
				$scope.hkidData.resultCount.fail_in_format = 0
				$scope.hkidData.resultCount.fail_in_validation = 0;
				
				// convert to uppercase
				var text = _hkidDataSource.toUpperCase();
				
				// trim space at start and end
				text = text.trim();
				
				// remove the () sign
				text = text.replace(/\(|\)/g, "");
				text = text.trim();
				
				if(text == ""){
					$scope.hkidData.resultSet = [];
					return;
				}
				
				var hkid_list = text.split("\n");
				
				// HKID validation
				for(i=0; i<hkid_list.length; i++){
					$scope.hkidData.resultSet[i] = {hkid:'', digit:'', formula:'', pass:''};
					$scope.hkidData.resultSet[i]['hkid'] = hkid_list[i].substr(0, hkid_list[i].length-1);
					$scope.hkidData.resultSet[i]['digit']= hkid_list[i].slice(-1);//substr(hkid_list[i].length-1, 1);
					$scope.hkidData.resultSet[i]['formula'] = "";
					$scope.hkidData.resultSet[i]['pass'] = {};
					
					//$scope.hkidData.resultSet[i]['pass']['status'] = true;
					//$scope.hkidData.resultSet[i]['pass']['message'] = "OK";
					$scope.hkidData.resultSet[i]['pass'] = $scope.IsHKID(hkid_list[i]);
					
					$scope.hkidData.resultSet[i]['formula'] = $scope.hkidData.resultSet[i]['pass'].formula;
				}
				
				// HKID duplication check
				// if don't use slice to copy array, the hkid_list also will sorted
				var sort_hkid_list = hkid_list.slice(0);
				sort_hkid_list.sort();
				
				var duplicatedHKID = [];
					var found = 0
				for(i=0; i<sort_hkid_list.length-1; i++){
					if(sort_hkid_list[i] == sort_hkid_list[i+1])
						duplicatedHKID.push(sort_hkid_list[i]);
				}
				//$log.log(duplicatedHKID)
				$scope.hkidData.duplicatedHKID = duplicatedHKID;
				// mark it fail if duplicated
				for(index in duplicatedHKID){
					var key = duplicatedHKID[index]
					for(i=0; i<hkid_list.length; i++){
						if(hkid_list[i] == key){
							$scope.hkidData.resultSet[i]['pass']['status'] = false;
							$scope.hkidData.resultSet[i]['pass']['message'] = "Invalid, duplicated";
						}
					}
					}
				
				for(i=0;i<hkid_list.length; i++){
					if($scope.hkidData.resultSet[i].pass.status){
						$scope.hkidData.resultCount.pass += 1;
					}else{
						$scope.hkidData.resultCount.fail += 1;
					}
				}
		}
		
		$scope.IsHKID = function(str) {
			var pass = {};
			pass.status = false;
			pass.message = "OK!!";
			pass.formula = ""
			
			// basic check length
			if (str.length < 8){
				pass.message = 'Invalid length, it should >=8'
				$scope.resultCount.fail_in_format+=1
				return pass;
			}
			
			// handling bracket
			//if (str.charAt(str.length-3) == '(' && str.charAt(str.length-1) == ')')
			//	str = str.substring(0, str.length - 3) + str.charAt(str.length -2);
			
			// convert to upper case
			//str = str.toUpperCase();
			
			// regular expression to check pattern and split
			var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
			var matchArray = str.match(hkidPat);
			
			//$log.log("HKID: "+str+", match{}:"+matchArray)
			// not match, return false
			if (matchArray == null){
				pass.message = 'Invalid, fail in regular expression check'
				$scope.resultCount.fail_in_format+=1
				return pass;
			}
			
			/*
			var patt = new RegExp(/^[a-zA-Z]{1,2}\d{6}[0-9A]$/);
			if(str.match(patt))
				return 'fail in regular expression check';
			*/
			
			// the character part, numeric part and check digit part
			var charPart = matchArray[1];
			var numPart = matchArray[2];
			var checkDigit = matchArray[3];
			
			// calculate the checksum for character part
			var checkSum = 0;
			if (charPart.length == 2) {
				checkSum += 9 * (10 + charPart.charAt(0).charCodeAt(0)-65);
				checkSum += 8 * (10 + charPart.charAt(1).charCodeAt(0)-65);
				
				pass.formula += charPart.charAt(0).charCodeAt(0)-64 + 
					"*9 + " + 
					charPart.charAt(1).charCodeAt(0)-64 + 
					"*8 + ";
			} else {
				checkSum += 9 * 36;
				//$log.log("char: "+charPart+", ASCII: "+charPart.charCodeAt(0))
				checkSum += 8 * (10 + charPart.charCodeAt(0)-65);
				pass.formula += charPart.charAt(0).charCodeAt(0)-64+"*8 + ";
			}
			
			// calculate the checksum for numeric part
			for (var i = 0, j = 7; i < numPart.length; i++, j--){
				checkSum += j * numPart.charAt(i);
				if(i==numPart.length-1)
					pass.formula += numPart.charAt(i) + "*" + j;
				else
					pass.formula += numPart.charAt(i) + "*" + j + " + ";
			}
			
			// verify the check digit
			var remaining = checkSum % 11;
			var verify = remaining == 0 ? 0 : 11 - remaining;
			
			pass.formula += "\n = "+checkSum+" % 11 = "+remaining;
			if(remaining==0)
				pass.formula += "\n Check Digit should = 0";
			else
				pass.formula += "\n Check Digit should = 11 - "+remaining+" = "+verify;
			
			if( verify == checkDigit || (verify == 10 && checkDigit == 'A') ){
				//return "Pass"
				pass.status = true;
			}else{
				pass.message = "Invalid, fail in algorithm validation"
				$scope.resultCount.fail_in_validation +=1;
			}
			
			return pass;
		}
		
		// StatusChange() event listener
		$scope.$watch(
		  // This function returns the value being watched. It is called for each turn of the $digest loop
		  function() { return $scope.hkidData; },
		  // This is the change listener, called when the value returned from the above function changes
		  function(newValue, oldValue) {
		  	var changedField = "";
		  	var changedValue;
			
		    if ( newValue !== oldValue ) {
		    	for(var colIndex in $ctrl.ngModel){
	    			changedField = colIndex;
	    			changedValue = newValue[colIndex];
					
					if (angular.equals(newValue[colIndex], oldValue[colIndex])) continue;
					
                    // Convert to Uppercase, if the chagned field is a Key and data type is string
                    // newValue = ConvertKeyFieldToUppercase(newValue, false);
					
					if(colIndex == "recordList")
						$scope.StatusChangeOnRecordList($scope, changedValue);

					if(typeof $scope.StatusChange == "function"){
						$scope.StatusChange(colIndex, changedValue, newValue, $scope, $element, $attrs, $ctrl);
					}else{
						StatusChange();
					}
		    	}
		    }
		  },
		  true
		);
    }
	
    function templateFunction(tElement, tAttrs) {
        var template = "<div ng-transclude></div>";
        return template;
    }
    return {
        require: ['ngModel'],
        restrict: 'EA', //'EA', //Default in 1.3+
        transclude: true,

        // scope: [false | true | {...}]
        // false = use parent scope
        // true =  A new child scope that prototypically inherits from its parent
        // {} = create a isolate scope
        scope: true,

        controller: HKIDConstructor,
        controllerAs: 'hkid_dCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
        bindToController: {
            ngModel: '=',
        },
		template: templateFunction
    };
}]);