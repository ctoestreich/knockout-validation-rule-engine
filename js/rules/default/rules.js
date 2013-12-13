define(['filters/filters'], function (filters) {
    return {
        firstName: {
            required: true,
            validName: true,
            filter: filters.ltrim
        },
        middleName: {
            validName: true,
            filter: filters.ltrim
        },
        lastName: {
            required: true,
            validName: true ,
            filter: filters.ltrim
        }
    };
});