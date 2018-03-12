var words = require('./food-data/words'),
    domains = require('./food-data/domains'),
    firstNames = require('./food-data/first-names'),
    lastNames = require('./food-data/last-names');

function isObject(obj) {
    return obj === Object(obj);
}

function isStructLeaf(leaf) {
    if (leaf && leaf.generator && Object.keys(generators).indexOf(leaf.generator) != -1) {
        return true;
    } else {
        return false;
    }
}


var generators = {};


/**
 * just set defined static value
 */
generators.value = function(val) {
    return val;
}

/**
 * random char
 */
generators.char = function () {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        + 'abcdefghijklmnopqrstuvwxyz'
        + '0123456789`~!@#$%^&*()-_=+[]{}|\\:;'
        + '\'",.<>?/ \t\n'
    ;
    return charset.charAt(Math.floor(Math.random() * charset.length));
};

/**
 * random string
 * params:
 * min - min size of string 
 * max - max size of string
 */
generators.string = function (params) {
    var min = 2, 
        max = 20;
    if (params && params.min !== undefined)
        min = params.min;
    if (params && params.max !== undefined)
        max = params.max;
    if (params && params.len !== undefined)
        max = min = params.len;
    var len = generators.int({min: min, max: max});
    var res = '';
    for (var i = 0; i < len; i++) {
        res += generators.char();
    }
    return res;
};

/**
 * random integer
 * params:
 * min - min value
 * max - max value
 */
generators.int = function(params) {
    var min = 0, 
        max = 500;
    if (params && params.min !== undefined)
        min = params.min;
    if (params && params.max !== undefined)
        max = params.max;
    return Math.floor(Math.random() * (max - min)) + min;
}


/**
 * random bool
 */
generators.bool = function() {
    return generators.int({min: 0, max: 2})?true:false;
}

/**
 * random float from 0 to 1
 */
generators.float = function() {
    return Math.random();
}

/**
 * random key of the object or array
 */
generators.key = function(obj = []) {
    var keys = Object.keys(obj);
    return keys[generators.int({min: 0, max: keys.length})];
}

/**
 * random element of the object or array
 */
generators.element = function(obj = []) {
    return obj[generators.key(obj)];
}

/**
 * random string with collocation
 */
generators.collocation = function() {
    var first = generators.element(words.adjectives);
    var last = generators.element(words.nouns);
    return [first, last].join(' ');
}

/**
 * random string with first and last name
 */
generators.name = function() {
    var first = generators.element(firstNames);
    var last = generators.element(lastNames);
    return [first, last].join(' ');
}

/**
 * random string with email
 */
generators.email = function() {
    var first = generators.element(firstNames);
    var domain = generators.element(domains);
    return [first, domain].join('@');
}

/**
 * random string with something like phone number
 * params:
 * len - length of the phone string without + at the start
 */
generators.phone = function(params) {
    var len = 10;
    if (params && params.len !== undefined)
        len = params.len;

    var phone = '+';
    for (let i = 0; i < len + 1; i++) {
        phone += generators.int({min: 0, max: 10});
    }
    return phone;
}

/**
 * random string with domain
 */
generators.site = function() {
    var domain = generators.element(domains);
    return domain;
}

/**
 * random error object
 * params:
 * min - min length in words of the text
 * max - max length in words of the text
 */
generators.error = function(params) {
    if (params === undefined)
        params = { min: 2, max: generators.int({min: 2, max:5}) };

    return new Error(generators.text(params));
}

// Возвращает объект Date с 1970 по настоящее время

/**
 * random date object
 * params:
 * min - min timestamp
 * max - max timestamp
 */
generators.date = function(params) {
    var min = 0, 
        max = Date.now();
    if (params && params.min !== undefined)
        min = params.min;
    if (params && params.max !== undefined)
        max = params.max;
    return new Date(generators.int({min: min, max: max}));
}

/**
 * random image url from picsum
 * params:
 * heigth - heigth of the image
 * width - width of the image
 */
generators.imagePicsum = function(params) {
    var heigth = 200, 
        width = 300;
    if (params && params.heigth !== undefined)
        heigth = params.heigth;
    if (params && params.width !== undefined)
        width = params.width;
    return `https://picsum.photos/${heigth}/${width}`;
}

/**
 * random image url from lorempixel
 * params:
 * heigth - heigth of the image
 * width - width of the image
 */
generators.imageLorempixel = function(params) {
    var heigth = 200, 
        width = 300;
    if (params && params.heigth !== undefined)
        heigth = params.heigth;
    if (params && params.width !== undefined)
        width = params.width;
    return `http://lorempixel.com/${heigth}/${width}`;
}

/**
 * random text
 * params:
 * min - min length in words of the text
 * max - max length in words of the text
 * len - fixed length of the text in words
 */
generators.text = function(params) {
    var loremWords = words.lorem.split(" ");
    
    var min = 1;
    var max = loremWords.length;
    if (params && params.min !== undefined)
        min = params.min;
    if (params && params.max !== undefined)
        max = params.max;
    if (params && params.len !== undefined)
        max = min = params.len;

    return loremWords.slice(0, generators.int({min: min, max: max})).join(" ");
}

/**
 * Generates random array
 * params:
 * len - fixed length of the array
 * max - max length
 * min - min length
 * struct - structure of array element
 */
generators.array = function(params) {
    var generatorsNames = Object.keys(generators).filter(name => {
        return (['struct', 'value', 'element', 'key'].indexOf(name) == -1);
    });

    var min = 0;
    var max = 10;
    if (params) {
        if (params.min !== undefined)
            min = params.min;
        if (params.max !== undefined)
            max = params.max;
        if (params.len !== undefined) {
            max = min = params.len;
        }
    }
    var len = generators.int({min: min, max: max});

    var arr = [];
    for (let i = 0; i < len; i++) {
        let structure;
        if (params && params.struct) {
            structure = params.struct;
        } else {
            structure = {generator: generators.element(generatorsNames)};
        }
        arr.push(generators.struct(structure));
    }
    return arr;
}

/**
 * Generates random object
 * params:
 * len - fixed number of properties
 * max - max number of properties
 * min - min number of properties
 * struct - structure of element
 */
generators.object = function(params) {
    var generatorsNames = Object.keys(generators).filter(name => {
        return (['struct', 'value', 'element', 'key'].indexOf(name) == -1);
    });

    var min = 0;
    var max = 10;
    if (params) {
        if (params.min !== undefined)
            min = params.min;
        if (params.max !== undefined)
            max = params.max;
        if (params.len !== undefined) {
            max = min = params.len;
        }
    }
    var len = generators.int({min: min, max: max});

    var obj = {};
    for (let i = 0; i < len; i++) {
        let structure;
        if (params && params.struct) {
            structure = params.struct;
        } else {
            structure = {generator: generators.element(generatorsNames)};
        }
        obj[generators.string()] = generators.struct(structure);
    }
    return obj;
}

/**
 * Generates random data with defined structure
 */
generators.struct = function(structure) {
    if (isStructLeaf(structure)) {
        return generators[structure.generator](structure.params);
    }
    var data;
    if (Array.isArray(structure)) {
        data = [];
    } else if (isObject(structure)){
        data = {};
    } else {
        return structure;
    }

    for (let key in structure) {
        data[key] = generators.struct(structure[key]);
    }
    
    return data;
}

module.exports = generators;