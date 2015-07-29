/**
* app Module
*
* Configurações do state principal da aplicação
*/

angular
.module('app', [
  'ionic',
  'app.tabs'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('tabs.home', {
      url: '/home',
      templateUrl: 'states/home/home.html'
    })

    $urlRouterProvider.otherwise('/tabs/home');
})
.run(function () {
  console.log('Run home??');
});
