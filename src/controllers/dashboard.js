function DashboardCtrl($rootScope, $scope, $http) {
  console.log('user is', $rootScope.user);
  $scope.user = $rootScope.user;
  $scope.mode = 'notEdit';
  const today = new Date;
  const slicedDate = today.toLocaleString().slice(0,10);
  let expenseDate;
  let totalCost = 0;
  $scope.donutChartConfig = {};
  // $scope.spendData = [4, 6];



  $scope.editBudget = function(name){
    $scope.mode = 'edit';
    console.log(name);
  //something done to change the <strong> element into a text input
  };

  $scope.saveBudget = function(name){
    $scope.mode = 'notEdit';
    console.log(name);
    $scope.user.password = $rootScope.user.password;
    $scope.user.passwordConfirmation = $rootScope.user.password;
    $http({
      method: 'PUT',
      url: `/api/users/${$rootScope.user._id}`,
      data: $scope.user
    });
  };


  // making GET request to get user expenses in dashboard scope
  const userExpenses = [];
  $http({
    method: 'GET',
    url: '/api/expenses'
  })
    .then(res => {

      res.data.forEach(expense => {
        if(expense.createdBy._id === $rootScope.user._id) {
          userExpenses.push(expense);
          expenseDate = `${expense.createdAt.slice(8,10)}/${expense.createdAt.slice(5,7)}/${expense.createdAt.slice(0,4)}`;
          // console.log('expense created at', `${expense.createdAt.slice(8,10)}/${expense.createdAt.slice(5,7)}/${expense.createdAt.slice(0,4)}`);
          if (expenseDate === slicedDate) {
            //
            //
            totalCost = totalCost + expense.cost;
          }
        }
      });

      $rootScope.displayTotal= totalCost;
      console.log('User expense is ===>', userExpenses);
      $scope.expenses = userExpenses;
      $scope.remainder = $rootScope.user.dailyBudget - $rootScope.displayTotal;
      $scope.spendData = [$scope.remainder, $rootScope.displayTotal];
      console.log('this is scope data', $scope.spendData);
    });


  $scope.$watch('spendData', () => {

    if($scope.spendData){
      $scope.donutChartConfig = {
        'globals': {
          'font-family': 'Lato',
          'font-weight': '100'
        },
        'graphset': [
          {
            'type': 'ring',
            'background-color': '#ffffff',
            'tooltip': {
              'visible': 0
            },
            'plotarea': {
              'margin': '2% 2% 2% 2%'
            },
            'plot': {
              'slice': 175,
              'ref-angl': 270,
              'detach': false,
              'hover-state': {
                'visible': false
              },
              'value-box': {
                'visible': true,
                'type': 'first',
                'connected': false,
                'placement': 'center',
                'text': `<span style='font-size:40px;'>You've spent</span><br><span>£${totalCost}</span>`,
                'rules': [
                  {
                    'rule': '%v > 50',
                    visible: false
                  }
                ],
                'font-color': '#000000',
                'font-size': '40px'
              },
              'animation': {
                'delay': 0,
                'effect': 2,
                'speed': '40000',
                'method': '0',
                'sequence': '1'
              }
            },
            'series': [
              {
                'values': [$scope.spendData[0]],
                'background-color': '#10f785',
                'border-color': '#282E3D',
                'border-width': '0px',
                'shadow': 0
              },
              {
                'values': [$scope.spendData[1]],
                'background-color': '#f10000',
                'border-color': '#282E3D',
                'border-width': '0px',
                'shadow': 0

              }
            ]
          }
        ]

      };
    }
  });//something done to change the <strong> element into a text input

}

export default DashboardCtrl;
