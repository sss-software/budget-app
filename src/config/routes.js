function Router($stateProvider, $urlRouterProvider) {

  // function secureState($q, $state, $auth, $rootScope) {
  //   return new $q((resolve) => {
  //     if ($auth.isAuthenticated()) return resolve();
  //     console.log('Creating a flash message from the router');
  //     $rootScope.$broadcast('flashMessage', {
  //       type: 'warning',
  //       content: 'please log in'
  //     });
  //     $state.go('login');
  //   });
  // }

  $stateProvider

    .state('goalsIndex', {
      templateUrl: './views/goals/index.html',
      url: '/goals',
      controller: 'GoalsIndexCtrl'
    })
    .state('goalsShow', {
      templateUrl: './views/goals/show.html',
      url: '/goals/:id',
      controller: 'GoalsShowCtrl'
    })
    .state('goalsNew', {
      templateUrl: './views/goals/new.html',
      url: '/goals/new',
      controller: 'GoalsCreateCtrl'
    })
    .state('goalsEdit', {
      templateUrl: './views/goals/edit.html',
      url: '/goals/:id/edit',
      controller: 'GoalsEditCtrl'
    })
    .state('expensesIndex', {
      templateUrl: './views/expenses/index.html',
      url: '/expenses',
      controller: 'ExpensesIndexCtrl'
    })
    .state('expensesShow', {
      templateUrl: './views/expenses/show.html',
      url: '/expenses/:id',
      controller: 'ExpensesShowCtrl'
    })
    .state('expensesNew', {
      templateUrl: './views/expenses/new.html',
      url: '/expenses/new',
      controller: 'ExpensesNewCtrl'
    })
    .state('expensesEdit', {
      templateUrl: './views/expenses/edit.html',
      url: './expenses/:id',
      controller: 'ExpensesEditCtrl'
    })
    .state('dashboard', {
      templateUrl: './views/dashboard.html',
      url: '/dashboard',
      controller: 'DashboardCtrl'
    })
    .state('register', {
      templateUrl: './views/auth/register.html',
      url: '/register',
      controller: 'AuthRegisterCtrl'
    })
    .state('login', {
      templateUrl: './views/auth/login.html',
      url: '/login',
      controller: 'AuthLoginCtrl'
    })
    .state('profileShow', {
      templateUrl: './views/profile/show.html',
      url: '/profile/:id',
      controller: 'ProfileShowCtrl'
    })
    .state('profileEdit', {
      templateUrl: './views/profile/edit.html',
      url: '/profile/:id/edit',
      controller: 'ProfileEditCtrl'
    });

  $urlRouterProvider.otherwise('/');
}

export default Router;
