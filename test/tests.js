define(['knockout', 'knockoutValidationRuleEngine', 'rules/person/rules', 'filters/filters'], function (ko, RuleEngine, personRules, filters) {

    var ruleEngine = new RuleEngine(personRules);

    module('Knockout Validation Tests');

    test("Check for required", function () {
        var testObj = ko.observable('').extend({required: true});

        equal(testObj(), '', 'observable works');
        equal(testObj.isValid(), false, 'testObj is valid');
        equal(testObj.error(), 'This field is required.', 'has correct error message');
    });

    module('Rule Engine Tests');

    test("Check getFieldRuleSet for field", function () {
        var ruleSet = ruleEngine.getFieldRuleSet('firstName');

        equal(ruleSet.required, true, 'required rule is present');
        equal(ruleSet.validName, true, 'required rule is present');
        ok(typeof ruleSet.filter == 'function', 'required rule is present');
    });

    test("Check for rule to be preset after adding ruleSet", function () {
        var ruleSet = ruleEngine.getFieldRuleSet('notPresent');

        ok(!ruleSet.required, 'rule set is not present');

        ruleEngine.ruleSet['notPresent'] = {
            required: true
        };

        ruleSet = ruleEngine.getFieldRuleSet('notPresent');

        equal(ruleSet.required, true, 'required rule is present');
    });


    test("Check for model properties to be auto wired", function () {
        var model = {
            firstName: ko.observable(''),
            lastName: ''
        };

        ruleEngine.apply(model);

        ok(model.firstName.isValid, 'validation added to mapped observable');
        ok(!model.lastName.isValid, 'validation not added to mapped value');
        ok(!model.firstName.isValid(), 'value is not valid due to being required');
    });


});
