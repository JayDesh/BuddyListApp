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
    .controller( 'buddyListController', function ( $rootScope, $http, $log, $scope, $route ) {
      if( !$rootScope.buddyList || $rootScope.buddyList.length < 1 ){
        $http ({
            method: 'GET',
            url: '../data/buddy-list.json'
        })
        .then( function ( response ) {
            $rootScope.buddyList = response.data.buddies;
            $log.info(response);
        });
      }


        $rootScope.deleteBuddy = function ( index ) {
            var confirmDelete = confirm( 'Are you sure you want to delete this buddy?');
            if ( confirmDelete ) {

                $http.delete('http://localhost:1234/user/' + $rootScope.buddyList[index].userName, {},
                    function (response) {
                        console.log(response.data.status);
                    },
                    function (failure) {
                        console.log('delete failed');
                    }
                );

                $rootScope.buddyList.splice( index, 1 );
            }
        }

        $rootScope.prioritize = function ( index ) {
          $rootScope.buddyList[ index ].priority = true;
          $route.reload();
           $http.put('http://localhost:1234/user/' + $rootScope.buddyList[ index ].userName, JSON.stringify( $rootScope.buddyList[ index ]   ),
                function ( response ) {
                    console.log( response.data.status );
                },
                function ( failure ){
                    console.log('Prioritize call failed.');
                }
           );

        }
    })
    .controller( 'addBuddyController', function ( $scope, $rootScope, $http, $log ) {

        $scope.user = {};


        $scope.submitUserData = function () {
            $rootScope.buddyList.push( $scope.user);
            $scope.user.birthdayISO = $scope.user.birthday.toISOString();
            delete($scope.user.birthday);
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
