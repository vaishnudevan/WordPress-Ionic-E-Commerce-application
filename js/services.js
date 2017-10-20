

angular.module('starter.services',[])
.service('WC', function(){
    return {
        WC: function(){
            var WcUrl = new WooCommerceAPI.WooCommerceAPI({
              url: 'http://wp.vaishnudevan.de/',
                consumerKey: 'ck_99279499f705cb1489815544189e19ce3318dc37',
                consumerSecret: 'cs_f2d79cbbfd0a09e0873365d8f65bc10b928e0599'
            });
            return WcUrl;
        },

        
}});






