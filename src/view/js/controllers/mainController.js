app.controller('MainController', ['$scope', function($scope) {
    $scope.left = 'upload file';
    $scope.right = 'table goes here.';
    $scope.data = 'none';
    $scope.file = [];
    $scope.getData = () => {
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function(e) {
            $scope.data = e.target.result;
        }
        r.readAsText(f);
    }
    const index = new InvertedIndex();
    $scope.fileData = () => {
        $scope.file = index.getIndex($scope.data);
    }


}]);