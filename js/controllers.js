
angular.module('controllers', [])

    .controller('AppCtrl', function ($scope, WC, $localStorage, $rootScope,$ionicLoading, $ionicModal, $state, $ionicPopup) {




        $scope.$on('$ionicView.enter', function (e) {
            //defined ionic  $ionicView.enter event will fire event when user did something


            console.log("userData", $localStorage.userData);
            //$localStorage.userData exists in local storage then is copied to rootscope
            if ($localStorage.userData) {
                $rootScope.userData = $localStorage.userData;
            }
        });

        $scope.logout = function () {
            $rootScope.userData = undefined;
            $rootScope.userData = undefined;

        }

        var wpbaseUrl = WC.WC();

        $localStorage.cart = [];
        //$localStorage - stores  a small value of information inside a device. So cart value will be stored 

        if ($localStorage.cart) {
            // cheking $localStorage.cart already available. if yes update the $rootScope.cartCount value from local storage.
            //else rootscope value is set to 0
            $rootScope.cartCount = $localStorage.cart.length;

        }
        else {
            $rootScope.cartCount = 0;
            $scope.$apply();

        }


        wpbaseUrl.get('products/categories', function (err, data, res) {
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
            //console.log(JSON.parse(res));
            $scope.categories = (JSON.parse(res)).product_categories;
            // console.log("It will display the all categories" + $scope.categories);   

            $scope.parentCategories = [];
            $scope.categories.forEach(function (element) {

                if (element.parent == 0)
                    $scope.parentCategories.push(element);

            })
            $ionicLoading.hide();
            console.log("It will display the parent categories" + $scope.parentCategories);
            // console.log($scope.parentCategories);
        })
        

        $scope.showCart = function () {
            $scope.cartContents = $localStorage.cart;
            if (!$scope.cartContents || $scope.cartContents.length == 0) {
                console.log("There are no contents in the cart or local storage");
                $ionicPopup.show({
                    template: "<center>There are no items in cart. Please continue shopping</center>",
                    buttons: [{
                        text: "Ok"
                    }]
                })

                return $scope.cartContents;
            }

            $scope.total = 0;

            $scope.cartContents.forEach(function (element, index) {
                //$scope.total = $scope.total + Number(element.price);
                $scope.total = $scope.total + (Number(element.price) * Number(element.count));
            });

            $scope.total = $scope.total.toFixed(2);
            $localStorage.totalMoney = $scope.total;

            $scope.modal = {};
            $ionicModal.fromTemplateUrl('template/cart.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });

        }

        $scope.handleCheckout = function () {

            console.log("checkout handling is called");
            $scope.modal.hide();
            if ($localStorage.userData)
                $state.go("wpapp.checkout");
            else
                $state.go("wpapp.login")

        }


    })

    .controller('categoriesCtrl', function ($scope, WC, $ionicLoading) {
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
       
        var wpbaseUrl = WC.WC();
       $scope.getcat = function() { wpbaseUrl.get('products/categories', function (err, data, res) {
         
            console.log(JSON.parse(res));
            $scope.categories = (JSON.parse(res)).product_categories;
            $scope.$apply();
        })
    }

        $scope.getcat();
        $ionicLoading.hide();

    })

    .controller('categoryprdsCtrl', function ($scope, WC, $stateParams,$ionicLoading, $localStorage, $rootScope) {
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
        console.log($stateParams.categoryID);
        var wpbaseUrl = WC.WC();
        wpbaseUrl.get('products?filter[category]=' + $stateParams.categoryID, function (err, data, res) {
            
            console.log(JSON.parse(res));
            $scope.categoriesproducts = (JSON.parse(res)).products;
            $scope.$apply();
            $ionicLoading.hide();
        })


        $scope.addtoCart = function (product) {
            var increaseCount = false;
            //this is to increase number when user click the number of times

            $localStorage.cart.forEach(function (item, index) {   //checking the each product in local stroage cart with the product clicked by the user  by product id
                if (item.id == product.id && !increaseCount) {

                    item.count = product.count;
                    item.count += 1;
                   product.count=item.count;
                   increaseCount = true;

                   if( item.count<=50){
                    $ionicPopup.show({
                      title: "Hai,",
                      template: '<center>There product is added '+item.count+' times</center>',
                      buttons: [{
                        text: "OK",
                        type: "button-assertive"
                      }]
                    })
                }
                else  
                  {
                    $ionicPopup.show({
                      title: "OOPS",
                      template: '<center>You can not order more than 50 items <br> or<br> Please give a valid number.<center>',
                      buttons: [{
                        text: "OK",
                        type: "button-assertive"
                      }]
                    })
                      
                  }
  
                    
                    //increase the product count
                    console.log(item.id + "==" + product.id);
                    console.log("Cart count has been increased by" + item.count);
                    
                }

            });

            if (!increaseCount) {
                product.count = 1;
                $localStorage.cart.push(product);
                //adding the product to the cart and set the count value to 1
            }

            $rootScope.cartCount = $localStorage.cart.length;


        }

    })

    .controller('ProductsCtrl', function ($scope, WC, $localStorage, $rootScope, $ionicLoading) {

         $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
        $scope.skipproduct = 0;
        // $scope.getProducts function - Get all products from wcstore by default we will get 10 products
        $scope.getProducts = function () {
            var wpbaseUrl = WC.WC();

            wpbaseUrl.get('products', function (err, data, res) {

                JSON.parse(res).products.forEach(function (element, index) {
                    element.count = 0;
                })

                $scope.products = JSON.parse(res).products;
                $scope.skipproduct = $scope.skipproduct + 10;
                $scope.allowLoadmore = true;
                console.log($scope.products);
                $scope.$apply();
                $ionicLoading.hide();
            })
        }
        $scope.getProducts();
        //calling the $scope.getProducts function
        $scope.refreshProducts = function () {


            $scope.getProducts();
            $scope.$broadcast('scroll.refreshComplete');
            // To say that refresh is done
        }


        $scope.loadMore = function () {

            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
            var wpbaseUrl = WC.WC();
            wpbaseUrl.get('products?filter[offset]=' + $scope.skipproduct, function (err, data, res) {

                JSON.parse(res).products.forEach(function (element, index) {
                    $scope.products.push(element);
                    element.count = 0;
                })
                $ionicLoading.hide();

                $scope.$broadcast('scroll.infiniteScrollComplete');

                if (JSON.parse(res).products.length < 10) {
                    $scope.allowLoadmore = false;
                    console.log("there are no more products to load");
                    return;

                }

                else {
                    $scope.skipproduct = $scope.skipproduct + 10;
                }


            })


        }

        $scope.addtoCart = function (product) {
            var increaseCount = false;
            //this is to increase number when user click the number of times

            if ($localStorage.cart !== 0)
                $localStorage.cart.forEach(function (item, index) {   //checking the each product in local stroage cart with the product clicked by the user  by product id
                    if (item.id == product.id) {
                        item.count = item.count++;
                        product.count = item.count;
                        //increase the product count
                        console.log(item.id + "==" + product.id);
                        console.log("Cart count has been increased by" + item.count);
                        increaseCount = true;
                    }

                });

            if (!increaseCount) {
                product.count = 1;
                $localStorage.cart.push(product);
                //adding the product to the cart and set the count value to 1
            }

            $rootScope.cartCount = $localStorage.cart.length;


        }

    })


    .controller('ProductCtrl', function ($scope, WC, $stateParams, $ionicSlideBoxDelegate, $localStorage, $rootScope) {
        console.log($stateParams.productID);
        var wpbaseUrl = WC.WC();
        wpbaseUrl.get('products/' + $stateParams.productID, function (err, data, res) {
            console.log(JSON.parse(res));
            $scope.product = (JSON.parse(res)).product;
            $scope.images = (JSON.parse(res)).product.images;
            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.loop(true);
            $scope.$apply();



            wpbaseUrl.get('products/' + $stateParams.productID + '/reviews', function (error, data, response) {
                $scope.reviews = JSON.parse(response).product_reviews;

            })

        })

        $scope.addtoCart = function (product) {
            var increaseCount = false;
            //this is to increase number when user click the number of times

            if ($localStorage.cart !== 0)
                $localStorage.cart.forEach(function (item, index) {   //checking the each product in local stroage cart with the product clicked by the user  by product id
                    if (item.id == product.id && !increaseCount) {
                        //item.count = item.count++;
                        item.count = product.count;
                        item.count += 1;
                       product.count=item.count;
                       increaseCount = true
                        // product.count = item.count;
                        //increase the product count
                        console.log(item.id + "==" + product.id);
                        console.log("Cart count has been increased by" + item.title);
                        increaseCount = true;
                    }

                });

            if (!increaseCount) {
                product.count = 1;
                $localStorage.cart.push(product);
                //adding the product to the cart and set the count value to 1
            }

            $rootScope.cartCount = $localStorage.cart.length;


        }

    })


    .controller('SignUpCtrl', function ($scope, $ionicPopup, $state, WC) {

        $scope.newUser = {};
        $scope.newUser.isValid = true;

        $scope.checkUserEmail = function (email) {

            var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!regex.test(email)) {

                $scope.newUser.isValid = false;

                $ionicPopup.show({
                    template: "<center>Invalid Email! Please Check!</center>",
                    buttons: [{
                        text: 'OK'
                    }]
                });

                return;

            }


            var Woocommerce = WC.WC();

            Woocommerce.get('customers/email/' + email, function (err, data, res) {

                if (err)
                    console.log(err);

                if (JSON.parse(res).customer) {

                    $scope.newUser.isValid = false;

                    $ionicPopup.show({
                        template: "<center>EMail is already registered. Please login or use another email address.</center>",
                        buttons: [{
                            text: "Login",
                            onTap: function (e) {
                                $state.go("app.login");
                            }
                        }, {
                            text: "OK"
                        }]
                    })

                }
                else {
                    $scope.newUser.isValid = true;
                }

            })

        }


        $scope.switchBillingToShipping = function () {
            $scope.newUser.shipping_address = $scope.newUser.billing_address;
        }


        $scope.signUp = function (newUser) {

            var customerData = {};
            var t0 = performance.now();

            customerData.customer = {
                "email": newUser.email,
                "first_name": newUser.first_name,
                "last_name": newUser.last_name,
                "username": newUser.email.split("@")[0],
                "password": newUser.password,
                "billing_address": {
                    "first_name": newUser.first_name,
                    "last_name": newUser.last_name,
                    "company": "",
                    "address_1": newUser.billing_address.address_1,
                    "address_2": newUser.billing_address.address_2,
                    "city": newUser.billing_address.city,
                    "state": newUser.billing_address.state,
                    "postcode": newUser.billing_address.postcode,
                    "country": newUser.billing_address.country,
                    "email": newUser.email,
                    "phone": newUser.billing_address.phone
                },
                "shipping_address": {
                    "first_name": newUser.first_name,
                    "last_name": newUser.last_name,
                    "company": "",
                    "address_1": newUser.shipping_address.address_1,
                    "address_2": newUser.shipping_address.address_2,
                    "city": newUser.shipping_address.city,
                    "state": newUser.shipping_address.state,
                    "postcode": newUser.shipping_address.postcode,
                    "country": newUser.shipping_address.country
                }
            }

            var wpbaseUrl = WC.WC();

            wpbaseUrl.post('customers', customerData, function (err, data, res) {
                var t1 = performance.now();
                console.log("Time taken to create a customer is: " + (t1 - t0)/1000 + " seconds.");
                if (err)
                    console.log(err);

                if (JSON.parse(res).customer) {
                    $ionicPopup.show({
                        title: "Congratulations",
                        template: "Your account has been created successfully. Please login.",
                        buttons: [{
                            text: "Login",
                            type: "button-assertive",
                            onTap: function (e) {
                                $state.go('wpapp.login');
                            }
                        }]
                    })
                }
                else {
                    $ionicPopup.show({
                        title: "OOPS",
                        template: JSON.parse(res).errors[0].message,
                        buttons: [{
                            text: "OK",
                            type: "button-assertive"
                        }]
                    })
                }
            });

        }


    })


    .controller('LoginCtrl', function ($scope, $ionicPopup, $http, $state, WC, $localStorage,$ionicLoading, $ionicHistory) {

       
        $scope.login = function (userData) {
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $http.get('http://wp.vaishnudevan.de/api/auth/generate_auth_cookie/?insecure=cool&username=' + userData.username + '&password=' + userData.password)

                .then(function (response) {
                    $ionicLoading.hide();
                    console.log(response);

                    if (response.data.user) {
                        $localStorage.userData = response;
                        $ionicPopup.show({
                            title: 'Welcome' + response.data.user.displayname,
                            template: '<center>Login Successful</center>',
                            buttons: [{
                                text: 'OK',
                                onTap: function (e) {
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    //clean the ionic memory
                                    $ionicHistory.clearHistory();
                                    $ionicHistory.clearCache();
                                    $state.go('wpapp.home');
                                }
                            }]
                        })
                    }

                    else {
                        $ionicPopup.show({
                            title: 'Sorry we can not login',
                            template: '<center>Please check your login credentials</center>',
                            buttons: [{
                                text: 'Try again!!'
                            }]
                        })
                    }
                });

        }

    })


    .controller('checkoutCtrl', function (WC, $scope, $rootScope, $state, $localStorage,$ionicLoading, $ionicHistory, $ionicPopup) {

        var wpbaseUrl = WC.WC();
        $scope.newOrder = {};
        $scope.getaddress = function () {
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
            
                        $scope.orders = [];
            
            
                        wpbaseUrl.get('customers/'+$localStorage.userData.data.user.id, function (err, data, res) {
                            $ionicLoading.hide();
                            
                            if(err)
                                {
                                    console.log(err);
                                }                              
                                $scope.newOrder = JSON.parse(res).customer;
                                console.log('The response for get address');
                                console.log( $scope.newOrder); 
                        })
                    }
                    
            $scope.getaddress();
       
       
       
       
       
        

        $scope.paymentMethods = [

            { method_id: "bacs", method_title: "Bank Transfer" },
            { method_id: "cheque", method_title: "Cheque Payment" },
            { method_id: "cod", method_title: "Cash on Delivery" }

        ];

        $scope.switchBillingToShipping = function () {
            console.log($scope.newOrder);
            $scope.newOrder.shipping = $scope.newOrder.billing;
        }

        $scope.placeOrder = function (newOrder) {
            var t0 = performance.now();
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            $scope.orderItems = [];

            if ($localStorage.cart) {
                $localStorage.cart.forEach(function (element, index) {

                    $scope.orderItems.push({ product_id: element.id, quantity: element.count });

                });

            }
            else {
                console.log("No products added");

                return;
            }



            var PaymentData = {};
            $scope.paymentMethods.forEach(function (element, index) {
                if (element.method_title == newOrder.paymentMethod) {
                    paymentData = element;
                }
            });

            var data = {
                payment_details: {
                    method_id: paymentData.method_id,
                    method_title: paymentData.method_title,
                    paid: true
                },
                billing_address: {
                    first_name: newOrder.first_name,
                    last_name: newOrder.last_name,
                    address_1: newOrder.billing_address.address_1,
                    address_2: newOrder.billing_address.address_2,
                    city: newOrder.billing_address.city,
                    state: newOrder.billing_address.state,
                    postcode: newOrder.billing_address.postcode,
                    country: newOrder.billing_address.country,
                    email: $localStorage.userData.data.user.email,
                    phone: newOrder.billing_address.phone
                },
                shipping_address: {
                    first_name: newOrder.first_name,
                    last_name: newOrder.last_name,
                    address_1: newOrder.shipping_address.address_1,
                    address_2: newOrder.shipping_address.address_2,
                    city: newOrder.shipping_address.city,
                    state: newOrder.shipping_address.state,
                    postcode: newOrder.shipping_address.postcode,
                    country: newOrder.shipping_address.country
                },
                customer_id: $localStorage.userData.data.user.id || '',
                line_items: $scope.orderItems
            };


            var orderData = {};

            orderData.order = data;

            //sending order to store

            var wpbaseUrl = WC.WC();

            wpbaseUrl.post('orders', orderData, function (err, data, res) {
                var t1 = performance.now();
                console.log("Time taken to place the order is:  " + (t1 - t0)/1000 + " seconds.");
                $ionicLoading.hide();
                
                if (err)
                    console.log(err);

                console.log(JSON.parse(res));
                if (JSON.parse(res).order) {
                    
                    $ionicPopup.show({
                        title: 'Congratulations',
                        template: '<center>You order has been placed successfully. Your order number is ' + JSON.parse(res).order.order_number + '.</center>',
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive',
                            
                            onTap: function (e) {
                                $localStorage.cart = [];
                                $rootScope.cartCount = 0;
                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true,
                                    disableBack: true
                                });
                                $ionicHistory.clearHistory();
                                $ionicHistory.clearCache();
                                $state.go('wpapp.home');
                            }
                        }]
                    })
                }
            });

        }

    })


    .controller('OrdersCtrl', function (WC, $ionicLoading,$http,  $filter, $scope, $rootScope, $state, $localStorage, $ionicHistory, $ionicPopup) {

        var wpbaseUrl = WC.WC();
        $scope.getorders = function () {

            $scope.orders = [];


            wpbaseUrl.get('orders', function (err, data, res) {
                $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
               
                console.log("The Userdata in local storage is: ");
                console.log($localStorage.userData);
                console.log("The Userid  is: ");
                console.log($localStorage.userData.data.user.username);
                console.log($localStorage.userData.data.user.id);

                var ordersort = JSON.parse(res).orders;
                console.log("ordersort is: ");
                console.log(ordersort);
                ordersort.forEach(function (element, index) {
                    
                   /* console.log("The Userid  is: ");
                    console.log($localStorage.userData.data.user.username);
                    console.log($localStorage.userData.data.user.id);
                    console.log(element.customer.id); */
                    if ($localStorage.userData.data.user.id == element.customer.id) {
                        $scope.orders.push(element);

                    }
                    $ionicLoading.hide();
                });

                

                console.log(JSON.parse(res));
            })
        }
        $scope.getorders();

        $scope.del = function (order) {

            var t0 = performance.now();
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
            var deletedata = {casetype: 'deletecontents', reqtype: 'orders', opetype: 'delete', reqdata:order.id};
          
              $http.post('http://wp.vaishnudevan.de/test.php', deletedata).success(function (response, error) {
                var t1 = performance.now();
                console.log("Time take to delete the order is:  " + (t1 - t0)/1000 + " seconds.");
                $ionicLoading.hide();
                console.log("The response is: ");
                console.log(response);
                $ionicPopup.show({
                    title: "Hai",
                    template: '<center> Status: '+ response.message+'</center>',
                    buttons: [{
                      text: "OK",
                      type: "button-assertive"
                    }]
                  })
                  $scope.getorders();

              }) 


        }


    })

    .controller('UpdateCtrl', function (WC, $ionicLoading, $filter, $scope, $rootScope, $state, $localStorage, $ionicHistory, $ionicPopup) {

        var wpbaseUrl = WC.WC();

        $scope.getAddress = function () {
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner><br>Updating' });


            wpbaseUrl.get('customers/' + $localStorage.userData.data.user.id, function (err, data, res) {
                $ionicLoading.hide();
                console.log('The Customer REquest reponse is: ');
                console.log(JSON.parse(res));
                $scope.a = [];
                $scope.a = JSON.parse(res).customer;
                console.log($scope.a);
            })

        }

        $scope.getAddress();

        $scope.UpdateAddress = function (d) {
            var t0 = performance.now();
            
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner><br>Updating' });

            console.log("The new address entered is ");
            console.log(d);

            var data = {
                customers :[ {
                    id: $localStorage.userData.data.user.id,
                    email: $localStorage.userData.data.user.email,
                    first_name: d.first_name,
                    last_name: d.last_name,
                    billing_address: {
                        address_1: d.billing_address.address_1,
                        address_2: d.billing_address.address_2,
                        city: d.billing_address.city,
                        postcode: d.billing_address.postcode,
                        phone: d.billing_address.phone
                    }
                }]
            };

            console.log("The Customer updated data is: " );
            console.log(data);
            wpbaseUrl.post('customers/bulk', data, function (err, data, res) {
                var t1 = performance.now();
                console.log("the time taken to update the address is " + (t1 - t0)/1000 + " seconds.")
            console.log("The response for cutomer data update is: ");
            console.log(JSON.parse(res).customers[0]);
            var h = JSON.parse(res).customers[0];
            



            if(h.id==$localStorage.userData.data.user.id)
                { 
                    $ionicLoading.hide();
               
                  
                  $ionicPopup.show({
                  title: "Hai "+h.last_name,
                  template: 'New address is:<br><br>Firstname: ' + h.first_name + '<br><br>Street: '  + h.billing_address.address_1 +'<br>Address2: '  + h.billing_address.address_2 +'<br><br>Pincode: '  + h.billing_address.postcode +'<br><br>City: '  + d.billing_address.city+'<br><br>Phone: '  + d.billing_address.phone,
                  buttons: [{
                    text: "OK",
                    type: "button-assertive",
                    onTap: function (e) {
                        $localStorage.cart = [];
                        $localStorage.productcount = [];
                        $rootScope.cartCount = 0;
                        $ionicHistory.nextViewOptions({
                          disableAnimate: true,
                          disableBack: true
                        });
                        $ionicHistory.clearHistory();
                        $ionicHistory.clearCache();
                        $state.go('wpapp.products');
                      }
                  }]
                })
                $state.go('wpapp.home');
                }
                else
                  {
                    $ionicPopup.show({
                  title: "Sorry",
                  template: '<center> Please check your inputs. </center>',
                  buttons: [{
                    text: "OK",
                    type: "button-assertive"
                  }]
                })
                  }
        
        
                console.log('The address is updated: ');
                console.log(d);
                $scope.getAddress();


            })
        }

        


    })

    .controller('SearchCtrl', function (WC, $ionicLoading, $filter, $scope, $rootScope, $state, $localStorage) {

       

      
      
        var wpbaseUrl = WC.WC();

       $scope.getproducts = function() { wpbaseUrl.get('products', function (err, data, res) {
            
            console.log(JSON.parse(res).products);
             $scope.products= JSON.parse(res).products;
           
         }) }

         $scope.getproducts();
        

         $scope.Search = function (s) {
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

            console.log(s.num);
            var t0 = performance.now();
            wpbaseUrl.get('products?filter[limit]='+s.num, function (err, data, res) {
                               console.log("The Search result is: ");
                               console.log(JSON.parse(res).products);
            
                                $scope.products= JSON.parse(res).products;
                                var t1 = performance.now();
                                console.log("Call to doSomething took " + (t1 - t0)/1000 + " seconds.")
                                $ionicLoading.hide();
                                $scope.$apply();
                            
                            })

    }         
            })

    .controller('HomeCtrl', function () {


    })