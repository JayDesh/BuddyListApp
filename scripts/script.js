    /// <reference path="angular.js" />
var myApp = angular
    .module("myModule", ["ngRoute"])
    .config( function ( $routeProvider) {
        $routeProvider
            .when("/buddy-list", {
                templateUrl: 'templates/buddy-list.html',
                controller: 'buddyListController'
            })
            .when("/add-user", {
                templateUrl: 'templates/add-user.html',
                controller: 'addBuddyController'
            })
    })
    .controller( 'buddyListController', function ( $scope, $http, $log ) {
        $http ({
            method: 'GET',
            url: '../data/buddy-list.json'
        })
        .then( function ( response ) {
            var responseData = response.data.buddies;
            _.each( reponseData)
            $scope.buddyList = response.data.buddies;
            $log.info(response);
        });


        $scope.deleteBuddy = function ( userName ) {
            var confirmDelete = confirm( 'Are you sure you want to delete this buddy?');
            if ( confirmDelete ) {
                $http.delete('http://localhost:1234/user/' + userName, {},
                    function (response) {
                        alert(response.data.status);
                    },
                    function (failure) {
                        console.log('delete failed');
                    }
                );
            }
        }

        $scope.prioritize = function ( username ) {
           var selectedBuddy = _.find( $scope.buddyList, function( buddy ) {
                return buddy.userName === username;
            });

            selectedBuddy.prioritized = true;
        }
    })
    .controller( 'addBuddyController', function ( $scope, $http, $log ) {

        $scope.user = {};


        $scope.submitUserData = function () {
            $http.post( 'http://localhost:1234/user', {params: $scope.user},
                function (response) {
                    $scope.results = response;
                },
                function (failure) {
                    console.log("failed");
                }
            );
        }
    });

    function toggleDetailsDisplay ( clickedDiv ) {
        if ( $(clickedDiv).find('.hidden').length > 0 ) {
            $(clickedDiv).find('.hidden').removeClass('hidden').addClass('visible');
        }else{
            $(clickedDiv).find('.visible').removeClass('visible').addClass('hidden');
        }
    }

