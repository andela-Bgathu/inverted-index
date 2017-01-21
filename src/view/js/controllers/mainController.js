app.controller('MainController', ['$scope', function ($scope) {
    $scope.left = 'upload file';
    $scope.right = 'table goes here.';
    $scope.data = '';
    $scope.showIndex = false;
    $scope.showSearch = false;
    $scope.files = [];
    $scope.indexData = [];
    $scope.getData = () => {
        var file = document.getElementById('file').files[0];
        $scope.f = file;
        $scope.files.push(file.name);
        reader = new FileReader();
        reader.onloadend = function(e) {
            $scope.data = e.target.result;
        }
        reader.readAsText(file);
    }
    const index = new InvertedIndex();
    $scope.fileData = () => {
        $scope.showIndex = true;
        $scope.showSearch = false;
        console.log($scope.f)
        index.createIndex($scope.f)
        $scope.indexData = (index.getIndex($scope.files[0]));
    }
    // $scope.search = () => {
    //     $scope.showIndex = false;
    //     $scope.showSearch = true;
    //     $scope.terms = document.getElementById("search").value;
    //     $scope.terms = $scope.terms.split(" ")
    //     $scope.results = index.searchIndex($scope.terms);
    // }



}]);