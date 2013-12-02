define(['filters/filters', 'rules/default/rules', 'rules/address/rules'], function (filters, defaultRules, addressRules) {
    var personRules = {
        previousLastName: defaultRules.lastName,
        previousCity: $.extend(addressRules.city, {filter: filters.onlyAlpha })
    };

    //extend default rules
    personRules = $.extend(defaultRules, personRules);

    //extend address rules
    personRules = $.extend(addressRules, personRules);

    return personRules;
});