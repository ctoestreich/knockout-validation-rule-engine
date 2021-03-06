define(['knockout', 'knockout-rule-engine', 'rules/person/rules', 'validation-addons'], function (ko, RuleEngine, personRules) {

    return {
        run: function () {

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
                ok(typeof ruleSet.filter === 'function', 'required rule is present');
            });

            test("Test that addRule works", function () {
                ok(ruleEngine.rules['nyanCat'] === undefined, 'rule does not exist');

                ruleEngine.addRule('nyanCat', {
                    validator: function (val) {
                        return val === 'meow meow meow';
                    }, message: 'meow meow meow'
                });

                ok(ruleEngine.rules['nyanCat'] !== undefined, 'rule now exists');

                var cat = {
                    meow: ko.observable('')
                };

                var ruleSet = {
                    meow: {nyanCat: true}
                };

                ruleEngine.apply(cat, ruleSet);

                ok(cat.meow.isValid, 'validation was added to meow');
                ok(!cat.meow.isValid(), 'value is not valid due to being correct');
                equal(cat.meow.error(), 'meow meow meow', 'error message is correct');

                cat.meow('meow meow meow');

                ok(cat.meow.isValid(), 'value is now valid');
                equal(cat.meow.error(), undefined, 'no error message');
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

            test("Check for rule to be preset after adding ruleSet with addRuleSet method", function () {
                var ruleSet = ruleEngine.getFieldRuleSet('goofyRule');

                ok(!ruleSet.required, 'rule set is not present');

                ruleEngine.addRuleSet({goofyRule: { required: true }});

                ruleSet = ruleEngine.getFieldRuleSet('goofyRule');

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

            test("Check for deep model properties to be auto wired", function () {
                var ssnModel = {
                    ssn1: ko.observable(''),
                    ssn2: ko.observable(''),
                    ssn3: ko.observable(''),
                    notWired: ko.observable('')
                };

                var personModel = {
                    firstName: ko.observable(''),
                    lastName: '',
                    ssn: ssnModel
                };

                ruleEngine.apply(personModel);

                ok(personModel.firstName.isValid, 'validation added to mapped observable');
                ok(!personModel.lastName.isValid, 'validation not added to mapped value');
                ok(!personModel.firstName.isValid(), 'value is not valid due to being required');

                ok(personModel.ssn.ssn1.isValid, 'validation added to mapped observable');
                ok(!personModel.ssn.ssn1.isValid(), 'value is not valid due to being required');

                ok(!personModel.ssn.notWired.isValid, 'validation is not added to mapped observable with no rules');

            });

            test("Check for deep model properties to NOT be auto wired", function () {
                var newRuleEngine = new RuleEngine(personRules, {deep: false});

                var ssnModel = {
                    ssn1: ko.observable(''),
                    ssn2: ko.observable(''),
                    ssn3: ko.observable(''),
                    notWired: ko.observable('')
                };

                var personModel = {
                    firstName: ko.observable(''),
                    lastName: '',
                    ssn: ssnModel
                };

                newRuleEngine.apply(personModel);

                ok(personModel.firstName.isValid, 'validation added to mapped observable');
                ok(!personModel.lastName.isValid, 'validation not added to mapped value');
                ok(!personModel.firstName.isValid(), 'value is not valid due to being required');

                ok(!personModel.ssn.ssn1.isValid, 'validation added to mapped observable');
                ok(!personModel.ssn.notWired.isValid, 'validation is not added to mapped observable with no rules');
            });
        }
    };
});
