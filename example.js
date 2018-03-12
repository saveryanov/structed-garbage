var garbage = require('./index');


console.log('\nstatic');
console.log(garbage.value({foo: 1, bar: 2, baz: 3})); 

console.log('\nchar');
console.log(garbage.char()); 

console.log('\nstring');
console.log(garbage.string()); 

console.log('\nint');
console.log(garbage.int({min: -10, max: 10})); 

console.log('\nbool');
console.log(garbage.bool());

console.log('\nkey');
console.log(garbage.key({foo: 1, bar: 2, baz: 3}));

console.log('\nelement');
console.log(garbage.element({foo: 1, bar: 2, baz: 3}));

console.log('\nname');
console.log(garbage.name());

console.log('\nemail');
console.log(garbage.email());

console.log('\nsite');
console.log(garbage.site());

console.log('\nphone');
console.log(garbage.phone());

console.log('\ncollocation');
console.log(garbage.collocation());

console.log('\nimageUrl');
console.log(garbage.imagePicsum());
console.log(garbage.imageLorempixel());

console.log('\nerror');
console.log(garbage.error());

console.log('\ndate');
console.log(garbage.date());

console.log('\ntext');
console.log(garbage.text({len: 3}));

console.log('\narray');
console.log(garbage.array({len: 3}));


function process(struct) {
    console.log('\nStruct:');
    console.log(JSON.stringify(struct));
    console.log('Data:');
    console.log(garbage.struct(struct));
}

process({generator: 'int'});

process([{generator: 'int'}, {generator: 'string'}, {generator: 'name'}]);

process({
    name: {generator: 'name'},
    birth: {generator: 'date'},
    staticValue: 'some text for example',
    staticValueMethod: {generator: 'value', params: {foo: 1, bar: 2, baz: 3}},
    likesCount: {generator: 'int', params: {min: 0, max: 10}},
    posts: [
        {
            title: {generator: 'collocation'},
            text: {generator: 'string'},
            image: {generator: 'imagePicsum', params: {width: 100, height: 100}},
            created: {generator: 'date'},
        },
        {
            title: {generator: 'collocation'},
            text: {generator: 'string'},
            image: {generator: 'imageLorempixel'},
            created: {generator: 'date'},
        },
    ],
    comments: {
        generator: 'array',
        params: {
            min: 0,
            max: 3,
            struct: {
                text: { generator: 'string' },
                date: { generator: 'date'}
            }
        }
    }
});


process({
    generator: 'array',
    params: {
        len: 5,
        struct: {
            name: { generator: 'name' },
            phone: { generator: 'phone'},
            something: { generator: 'object' }
        }
    }
});