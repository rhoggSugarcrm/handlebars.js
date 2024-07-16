describe('security issues', function() {
    describe('GH-1495: Prevent Remote Code Execution via constructor', function() {
        it('should not allow constructors to be accessed', function() {
            shouldCompileTo('{{constructor.name}}', {}, '');
        });

        it('should allow the "constructor" property to be accessed if it is enumerable', function() {
            shouldCompileTo('{{constructor.name}}', {
                'constructor': {
                    'name': 'here we go'
                }
            }, 'here we go');
        });

        it('should allow prototype properties that are not constructors', function() {
            class TestClass {
                get abc() {
                    return 'xyz';
                }
            }
            shouldCompileTo('{{#with this}}{{abc}}{{/with}}',
                new TestClass(), 'xyz');
        });
    });

    describe('GH-1595: dangerous properties', function() {
        var templates = [
            '{{__defineGetter__}}',
            '{{__defineSetter__}}',
            '{{__lookupGetter__}}',
            '{{__proto__}}',
        ];

        templates.forEach(function(template) {
            describe('access should be denied to ' + template, function() {
                it('by default', function() {
                    shouldThrow(function() {
                        CompilerContext.compile(template);
                    }, Error);
                });
            });
        });
    });
});
