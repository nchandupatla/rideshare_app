angular.module("rideShareApp", ['ngRoute'])
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
                    alert("Error finding ads.");
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
    
     .controller("AdsListController", function(ads, $scope) {
        $scope.ads = ads.data;
    })
   

     .controller("NewAdController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveAd = function(ad) {
            Contacts.createNewAd(ad).then(function(doc) {
                /*var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);*/
                 $location.path('/showAllAds');
                console.log('sucessfully inserted');
            }, function(response) {
                alert(response);
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