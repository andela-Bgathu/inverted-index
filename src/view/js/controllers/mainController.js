app.controller('MainController', ['$scope', function($scope) {
    $scope.left = 'upload file';
    $scope.right = 'table goes here.';
    $scope.data = '';
    $scope.files = [];
    $scope.indexData = [];
    $scope.getData = () => {
        var file = document.getElementById('file').files[0];
        $scope.files.push(file.name);
        reader = new FileReader();
        reader.onloadend = function(e) {
            $scope.data = e.target.result;
        }
        reader.readAsText(file);
    }
    const index = new InvertedIndex();
    $scope.fileData = () => {
        $scope.indexData = (index.getIndex($scope.data));
    }
    $scope.search = () => {
        $scope.terms = document.getElementById("search").value;
        $scope.terms = $scope.terms.split(" ")
        $scope.results = index.searchIndex($scope.terms);
        console.log($scope.results);
    }



}]);