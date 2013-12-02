define(['filters/filters'], function (filters) {
    return {
        address1: {
            required: true,
            noSpecialChars: true,
            filter: [filters.noSpecialChars, filters.ltrim]
        },
        address2: {
            noSpecialChars: true,
            filter: [filters.noSpecialChars, filters.ltrim]
        },
        city: {
            required: true,
            noSpecialChars: true,
            filter: [filters.noSpecialChars, filters.ltrim]
        },
        state: {
            validSelectValue: {
                message: 'Please select a state.'
            }
        },
        zipCode: {
            required: true,
            validDigitLength: {
                params: 5,
                message: 'Please enter a valid zip code (XXXXX).'
            },
            filter: filters.onlyDigits
        },
        phone: {
            required: true,
            pattern: {
                message: 'Invalid phone number. (XXX-XXX-XXXX)',
                params: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
            }
        }
    };
});