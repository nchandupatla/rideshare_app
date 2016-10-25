angular.module("rideShareApp", ['ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap'])
    .config(function($routeProvider) {
        $routeProvider
             .when("/newAd", {
                controller: "NewAdController",
                templateUrl: "postad.html"
            })
            .when("/showAllAds", {
                templateUrl: "adslist.html",
                controller: "AdsListController",
                resolve: {
                    ads: function(Contacts) {
                        return Contacts.getAllAds();
                    }
                }
            })
             .when("/ads/:adId", {
                controller: "EditAdController",
                templateUrl: "ad.html"
            })
            .otherwise({
                redirectTo: "/showAllAds"
            })
    })
    .service("Contacts", function($http) {
        
        this.getAllAds = function() {
            return $http.get("/ads").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding ads.")
                });
        }
         this.createNewAd = function(ad) {
            return $http.post("/insertAd", ad).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating ad.");
                });
        }
        this.getAd = function(adId) {
            var url = "/ads/" + adId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this ad.");
                });
        }
        this.editAd = function(ad) {
            var url = "/ads/" + ad._id;
            console.log(ad._id);
            return $http.put(url, ad).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this ad.");
                    console.log(response);
                });
        }
        this.deleteAd = function(adId) {
            var url = "/ads/" + adId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this ad.");
                    console.log(response);
                });
        }

    })

   

     .factory('app_factory', ['$http', function($http) {
    var dataFactory = {};
    dataFactory.getStatesAndCities = function (search) {
        // var urlBase = "http://gd.geobytes.com/AutoCompleteCity?callback=?&filter=US&q="+search;
        // return $http.get(urlBase);
       
     }
    dataFactory.getAllCarMakes = function () {
       //console.log('cars '+JSON.stringify(app_factory.getAllCarMakes()));
        return $http.get("/js/cars_make.json");
       
     }
    dataFactory.getModelsForMake = function (search) {
         //var urlBase = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/"+search+"?format=json";
         return $http.get("/js/honda_models.json");
       
     }
    return dataFactory;
     }])

     .directive('autoComplete', function($timeout) {
  return {
    restrict: "A",
    scope: {
      uiItems: "="
    },
    link: function(scope, iElement, iAttrs) {
      scope.$watchCollection('uiItems', function(val) {
        console.log(val);
        iElement.autocomplete({
          source: scope.uiItems,
          select: function() {
            $timeout(function() {
              iElement.trigger('input');
            }, 0);
          }
        });
      });

    }
  }
})

     .controller("AdsListController", function(ads, $scope, app_factory) {
         $scope.ads = ads.data;
         console.log('ads '+JSON.stringify($scope.ads))
        
    })
   
   .controller("NavController", function($scope, $location) {
           $scope.cities_list=[];
           
           $scope.onCityChange=function(){
           console.log('text '+$scope.cityText);
           if($scope.cityText && $scope.cityText.length>2){
            jQuery.getJSON(
            "http://gd.geobytes.com/AutoCompleteCity?callback=?&filter=US&q="+$scope.cityText,
            function (data) {
                console.log('cities '+JSON.stringify(data))
                $scope.cities_list=data;
                return $scope.cities_list;
                
            }
         );
           }
           
           }
    })


     .controller("NewAdController", function($scope, $location, Contacts, app_factory, $http) {
          $scope.ad={"startDate":''};
         
          $scope.cars_make=[];
          $scope.cars_models=[];
          app_factory.getAllCarMakes().success(function(data) {
              data.Results.forEach(function(entry){
              $scope.cars_make.push(entry.Make_Name);
            });
           });

          $("#datetimepicker1").on("dp.change", function() {

            $scope.selecteddate = $("#datetimepicker1").val();
            console.log("selected date is " + $scope.selecteddate+' '+$scope.ad.startDate);

        });


         $scope.onVehiceChange=function(vehicle){
             if(vehicle.length>3){
             app_factory.getModelsForMake(vehicle).success(function(data) {
               data.Results.forEach(function(entry){
              $scope.cars_models.push(entry.Model_Name);
            });
           });
          }
          }
            
        
            $scope.onFromCityChange=function(fromCity){
           
           if(fromCity){
            jQuery.getJSON(
            "http://gd.geobytes.com/AutoCompleteCity?callback=?&filter=US&q="+fromCity,
            function (data) {
                console.log('cities '+JSON.stringify(data))
                $scope.cities_list=data;
                return $scope.cities_list;
                
            }
         );
           }
           
           }

           $scope.onToCityChange=function(toCity){
           console.log('text '+$scope.toCity);
           if(toCity){
            jQuery.getJSON(
            "http://gd.geobytes.com/AutoCompleteCity?callback=?&filter=US&q="+toCity,
            function (data) {
                console.log('cities '+JSON.stringify(data))
                $scope.cities_list=data;
                return $scope.cities_list;
                
            }
         );
           }
           
           }

         $('#datetimepicker1').datetimepicker();
        $scope.back = function() {
            $location.path("#/");
        }
       
        $scope.saveAd = function(ad) {
            Contacts.createNewAd(ad).then(function(doc) {
                /*var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);*/
                $location.path('/showAllAds');
                console.log('sucessfully inserted '+JSON.stringify(ad));
            });
        }
    })

   
    .controller("EditAdController", function($scope, $routeParams, Contacts) {
       Contacts.getAd($routeParams.adId).then(function(doc) {
            $scope.ad = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.editFormUrl = "postad.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.editFormUrl = "";
        }

        $scope.saveAd = function(ad) {
            Contacts.editAd(ad);
            $scope.editMode = false;
            $scope.editFormUrl = "";
        }

        $scope.deleteAd = function(adId) {
            Contacts.deleteAd(adId);
        }
    });