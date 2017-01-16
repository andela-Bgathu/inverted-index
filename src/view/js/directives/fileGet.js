app.directive('fileget', () => {
    return {
        restrict: 'A',
        scope: {
            handler: '&'
        },
        link: (scope, element) => {
            element.on('change', (event) => {
                scope.$apply(() => {
                    scope.handler({ files: event.target.files });
                });
            });
        }
    };
})