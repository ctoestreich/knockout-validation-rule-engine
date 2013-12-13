require.config({
    // make bower_components more sensible
    // expose jquery
    paths: {
        "jquery": "libs/jquery.min",
        '_': 'libs/lodash.compat.min'

    },
    map: {
        "*": {
            "knockout": "libs/knockout",
            "ko": "libs/knockout",
            "knockout.validation": "libs/knockout.validation"
        }
    }
});

// Use the debug version of knockout it development only
// When compiling with grunt require js will only look at the first 
// require.config({}) found in this file
//require.config({
//    map: {
//        "*": {
//            "knockout": "../../bower_components/knockout.js/knockout.debug",
//            "ko": "../../bower_components/knockout.js/knockout.debug",
//            "knockout.validation": "../../node_modules/knockout.validation/Dist/knockout.validation"
//        }
//    }
//});

