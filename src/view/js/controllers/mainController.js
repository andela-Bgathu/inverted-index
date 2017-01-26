app.controller('MainController', ['$scope', function ($scope) {
  $scope.showIndex = false;
  $scope.showSearch = false;
  $scope.showRow = false;
  $scope.showRowText = '+';
  $scope.files = [];
  $scope.searchfiles = ['All'];
  $scope.indexData = {};
  const index = new InvertedIndex();
  $scope.objkey = Object.keys;
  $scope.getData = () => {
    const file = document.getElementById('file').files[0];
    $scope.file = file.name;
    reader = new FileReader();
    reader.onloadend = function (e) {
      $scope.data = e.target.result;
    };
    reader.readAsText(file);
  };
  $scope.index = () => {
    if ($scope.data.length !== 0) {
      if (index.validateJsonData(index.getJson($scope.data))) {
        index.createIndex($scope.file, $scope.data);
        $scope.files.push($scope.file);
        $scope.searchfiles.push($scope.file);
        $scope.file = '';
        $scope.indexcreated = true;
      } else {
        $scope.ErrorTextAlert = 'File has Invalid Json Data';
        $scope.file = '';
        $scope.close = true;
      }
    } else {
      $scope.ErrorTextAlert = 'File is empty';
      $scope.file = '';
      $scope.close = true;
    }
  };
    // const index = new InvertedIndex();
  $scope.fileData = (file) => {
    $scope.showIndex = true;
    $scope.showSearch = false;
    $scope.indexData[file] = index.getIndex(file);
  };
  $scope.showRows = (value) => {
    if (value === '+') {
      $scope.showRowText = '-';
      $scope.showRow = true;
    } else {
      $scope.showRowText = '+';
      $scope.showRow = false;
    }
  };
  $scope.search = () => {
    $scope.showIndex = false;
    $scope.showSearch = true;
    const opt = document.getElementById("selectfile");
    const filename = opt.options[opt.selectedIndex].text;
    const terms = document.getElementById("search").value;
    $scope.results = index.searchIndex(filename, terms);
  };
  $scope.closeButton = () => {
    $scope.close = false;
  };
}]);
