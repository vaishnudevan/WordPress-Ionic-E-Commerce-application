// Ionic Starter App


angular.module('wpshop', ['ionic', 'starter.services', 'controllers', 'ngStorage' ])



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    } 
  });
})


 // config() - method executed everytime the aungular modile is loaded. 
  // this method takes function as a pararameters.

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('wpapp', {
      url: '/wpapp',
      templateUrl: 'template/menu.html',
      controller: 'AppCtrl',
      abstract: true
    })
      //wpapp.home is a nested state
      //abstract is a depend on other state

      .state('wpapp.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'template/home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('wpapp.products', {
        url: '/products',
        views: {
          'menuContent': {
            templateUrl: 'template/products.html',
            controller: 'ProductsCtrl'
          }
        }
      })

      .state('wpapp.product', {
        url: '/product/:productID',
        views: {
          'menuContent': {
            templateUrl: 'template/product.html',
            controller: 'ProductCtrl'
          }
        }
      })

      .state('wpapp.categories', {
        url: '/products',
        views: {
          'menuContent': {
            templateUrl: 'template/categories.html',
            controller: 'categoriesCtrl'
          }
        }
      })

      .state('wpapp.categoryprds', {
        url: '/categoryprds/:categoryID',
        views: {
          'menuContent': {
            templateUrl: 'template/categoryprds.html',
            controller: 'categoryprdsCtrl'
          }
        }
      })

      .state('wpapp.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'template/signup.html',
            controller: 'SignUpCtrl'
          }
        }
      })

      
      .state('wpapp.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'template/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      
      .state('wpapp.checkout', {
        url: '/checkout',
        views: {
          'menuContent': {
            templateUrl: 'template/checkout.html',
            controller: 'checkoutCtrl'
          }
        }
      })

      .state('wpapp.orders', {
        url: '/orders',
        views: {
          'menuContent': {
            templateUrl: 'template/orders.html',
            controller: 'OrdersCtrl'
          }
        }
      })

      .state('wpapp.update', {
        url: '/update',
        views: {
          'menuContent': {
            templateUrl: 'template/update.html',
            controller: 'UpdateCtrl'
          }
        }
      })

      .state('wpapp.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'template/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      
      
      
      ;


    $urlRouterProvider.otherwise('/wpapp/home');
  })

 
  