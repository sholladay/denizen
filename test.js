import test from 'ava';
import denizen from '.';

test('isNormalizedUsername()', (t) => {
    t.true(denizen.isNormalizedUsername('jazzmaster1'));
    t.false(denizen.isNormalizedUsername('JazzMaster'));
    t.false(denizen.isNormalizedUsername('Jazz-Master-1'));
    t.false(denizen.isNormalizedUsername('jazz-master-', {
        validate : false
    }));
    t.true(denizen.isNormalizedUsername('', {
        allowEmpty : true
    }));
    t.throws(() => {
        denizen.isNormalizedUsername('Jazz-Master-');
    }, {
        message : 'Username must end with an alphanumeric character'
    });
    t.throws(() => {
        denizen.isNormalizedUsername('');
    }, {
        message : 'Username cannot be empty'
    });
});

test('isValidUsername()', (t) => {
    t.true(denizen.isValidUsername('jazzmaster1'));
    t.true(denizen.isValidUsername('Jazz-Master-1'));
    t.false(denizen.isValidUsername('Jazz-Master-'));
    t.false(denizen.isValidUsername('Jazz!Master'));
    t.false(denizen.isValidUsername(''));
    t.true(denizen.isValidUsername('', {
        allowEmpty : true
    }));
});

test('normalizeUsername()', (t) => {
    t.is(denizen.normalizeUsername('Jazz-Master-1'), 'jazzmaster1');
    t.is(denizen.normalizeUsername('jazzmaster1'), 'jazzmaster1');
    t.is(denizen.normalizeUsername('jazz-master-', {
        validate : false
    }), 'jazzmaster');
    t.is(denizen.normalizeUsername('', {
        allowEmpty : true
    }), '');
    t.throws(() => {
        denizen.normalizeUsername('Jazz-Master-');
    }, {
        message : 'Username must end with an alphanumeric character'
    });
    t.throws(() => {
        denizen.normalizeUsername('');
    }, {
        message : 'Username cannot be empty'
    });
});

test('punctuationRegex', (t) => {
    t.false(denizen.punctuationRegex.global, 'Global regexes introduce dangerous statefulness via lastIndex');
    t.false(denizen.punctuationRegex.sticky, 'Sticky regexes introduce dangerous statefulness via lastIndex');
    t.true(denizen.punctuationRegex.test('Jazz-Master'));
    t.true(denizen.punctuationRegex.test('Jazz!Master'));
    t.true(denizen.punctuationRegex.test('Jazz Master'));
    t.false(denizen.punctuationRegex.test('JazzMaster'));
    t.false(denizen.punctuationRegex.test('jazzmaster1'));
    t.is('abcDEF'.replace(denizen.punctuationRegex, ''), 'abcDEF');
    t.is('abc,./!@#$%^&*()_+=-DEF'.replace(new RegExp(denizen.punctuationRegex, 'gi'), ''), 'abcDEF');
});

test('usernameRegex', (t) => {
    t.false(denizen.usernameRegex.global, 'Global regexes introduce dangerous statefulness via lastIndex');
    t.false(denizen.usernameRegex.sticky, 'Sticky regexes introduce dangerous statefulness via lastIndex');
    t.true(denizen.usernameRegex.test('Jazz-Master'));
    t.true(denizen.usernameRegex.test('JazzMaster'));
    t.true(denizen.usernameRegex.test('jazzmaster1'));
    t.false(denizen.usernameRegex.test('Jazz!Master'));
    t.false(denizen.usernameRegex.test('Jazz Master'));
});

test('validateUsername()', (t) => {
    t.is(denizen.validateUsername('Jazz-Master-1'), 'Jazz-Master-1');
    t.is(denizen.validateUsername('', {
        allowEmpty : true
    }), '');
    t.throws(() => {
        denizen.validateUsername('Jazz-Master-');
    }, {
        name    : 'Error',
        message : 'Username must end with an alphanumeric character'
    });
    t.throws(() => {
        denizen.validateUsername('');
    }, {
        name    : 'RangeError',
        message : 'Username cannot be empty'
    });
});

test('validateUsername.silent()', (t) => {
    t.deepEqual(denizen.validateUsername.silent(''), {
        tooShort : 'Username cannot be empty'
    });
    t.deepEqual(denizen.validateUsername.silent('', { allowEmpty : true }), {});
    t.deepEqual(denizen.validateUsername.silent('I-Am-Okay'), {});
    t.deepEqual(denizen.validateUsername.silent('IAmTooLongAtThirtyOneCharacters'), {
        tooLong : 'Username must be 30 characters or less'
    });
    t.deepEqual(denizen.validateUsername.silent('IHave--ConsecutiveHyphens'), {
        doubleHyphen : 'Username cannot contain multiple hyphens in a row'
    });
    t.deepEqual(denizen.validateUsername.silent('-IStartWithAHyphen'), {
        invalidStart : 'Username must start with an alphanumeric character'
    });
    t.deepEqual(denizen.validateUsername.silent('IEndWithAHyphen-'), {
        invalidEnd   : 'Username must end with an alphanumeric character'
    });
    t.deepEqual(denizen.validateUsername.silent('IHaveA Space'), {
        invalidChars : 'Username may only contain alphanumeric characters and hyphens'
    });
    t.deepEqual(denizen.validateUsername.silent('!IStartWithABang'), {
        invalidStart : 'Username must start with an alphanumeric character',
        invalidChars : 'Username may only contain alphanumeric characters and hyphens'
    });
    t.deepEqual(denizen.validateUsername.silent('IEndWithABang!'), {
        invalidEnd   : 'Username must end with an alphanumeric character',
        invalidChars : 'Username may only contain alphanumeric characters and hyphens'
    });
    t.deepEqual(denizen.validateUsername.silent('-'), {
        invalidStart : 'Username must start with an alphanumeric character',
        invalidEnd   : 'Username must end with an alphanumeric character'
    });
    t.deepEqual(denizen.validateUsername.silent('!'), {
        invalidStart : 'Username must start with an alphanumeric character',
        invalidEnd   : 'Username must end with an alphanumeric character',
        invalidChars : 'Username may only contain alphanumeric characters and hyphens'
    });
    t.deepEqual(denizen.validateUsername.silent('!--'), {
        doubleHyphen : 'Username cannot contain multiple hyphens in a row',
        invalidStart : 'Username must start with an alphanumeric character',
        invalidEnd   : 'Username must end with an alphanumeric character',
        invalidChars : 'Username may only contain alphanumeric characters and hyphens'
    });
    t.deepEqual(denizen.validateUsername.silent('--IAmTooLongAndFullOfPunctuation!'), {
        tooLong      : 'Username must be 30 characters or less',
        doubleHyphen : 'Username cannot contain multiple hyphens in a row',
        invalidStart : 'Username must start with an alphanumeric character',
        invalidEnd   : 'Username must end with an alphanumeric character',
        invalidChars : 'Username may only contain alphanumeric characters and hyphens'
    });
});
