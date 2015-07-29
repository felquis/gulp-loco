/**
* app Module
*
* Configurações do state principal da aplicação
*/

angular
.module('app.tabs', [])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('tabs', {
      url: '/tabs',
      abstract: true,
      templateUrl: 'states/tabs/tabs.html'
    })
})
.run(function () {
  console.log('Run tabs??');
});
