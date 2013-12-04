
define(["knockout", "knockout-rule-engine", "rules/person/rules", "validation-addons"], function (ko, RuleEngine, personRules) {

    // set deep to false if you do not want to traverse rules
    // var ruleEngine = new RuleEngine(personRules, {deep: false});
    var ruleEngine = new RuleEngine(personRules);

    var PhoneModel = function () {
        return {
            phone: ko.observable('')
        };
    };

    var AddressModel = function () {
        return {
            address1: ko.observable(''),
            address2: ko.observable(''),
            city: ko.observable(''),
            state: ko.observable(''),
            zipCode: ko.observable(''),
            phone: new PhoneModel()
        };
    };

    var personModel = {
        firstName: ko.observable(''),
        lastName: ko.observable(''),
        middleName: ko.observable(''),
        address: new AddressModel()
    };

    personModel.submitForm = function () {
        var validation = ko.validation.group(personModel, {deep: true});
        if (validation().length !== 0) {
            validation.showAllMessages();
            var $elements = $(".validationMessage:visible");
            if ($elements.length > 0) {
                var position = $($elements[0]).offset().top - ($(window).height() / 2);
                $('html,body').animate({scrollTop: position}, 400);
            }
        } else {
            alert('Validation passed!');
            console.log('model', ko.toJSON(personModel));
        }
    };

    // example of adding rule to engine at runtime
    ruleEngine.addRule('nameNotTom', {
        validator: function (val) {
            return val !== 'Tom';
        },
        message: 'Your name can not be Tom!'
    });

    ruleEngine.ruleSet.firstName = $.extend(ruleEngine.ruleSet.firstName, { nameNotTom: true });

    // example of wiring a field at apply time
    ruleEngine.apply(personModel);

    ko.applyBindings(personModel, $('html')[0]);
});
