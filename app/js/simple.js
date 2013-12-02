define(['knockout', 'knockoutValidationRuleEngine'], function (ko, RuleEngine) {
    var ruleSet = {
        userEmail: { email: true }
    };

    var ruleEngine = new RuleEngine(ruleSet);

    var model = {
        userEmail: ko.observable('')
    };

    ruleEngine.apply(model);

    ko.applyBindings(model, $('html')[0]);
});