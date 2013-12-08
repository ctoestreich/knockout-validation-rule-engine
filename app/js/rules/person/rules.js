define(['filters/filters', 'rules/default/rules', 'rules/address/rules'], function (filters, defaultRules, addressRules) {
    var personRules = {
        previousLastName: defaultRules.lastName,
        previousCity: $.extend(addressRules.city, {filter: filters.onlyAlpha }),
        ssn1: { required: true },
        ssn2: { required: true },
        ssn3: { required: true }
    };

    //extend default rules
    personRules = $.extend(defaultRules, personRules);

    //extend address rules
    personRules = $.extend(addressRules, personRules);

    return personRules;
});