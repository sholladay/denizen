'use strict';

const punctuationRegex = /[^a-z\d]/i;
const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,29}$/i;

const validateUsername = (username, option) => {
    const config = { ...option };
    const problem = validateUsername.silent(username, config);
    Object.entries(problem).forEach(([key, message]) => {
        if (['tooShort', 'tooLong', 'doubleHyphen'].includes(key)) {
            throw new RangeError(message);
        }
        throw new Error(message);
    });
    return username;
};

validateUsername.silent = (username, option) => {
    const config = { ...option };
    const problem = {};
    if (!username) {
        if (!config.allowEmpty) {
            problem.tooShort = 'Username cannot be empty';
        }
        return problem;
    }
    if (username.length > 30) {
        problem.tooLong = 'Username must be 30 characters or less';
    }
    if (punctuationRegex.test(username[0])) {
        problem.invalidStart = 'Username must start with an alphanumeric character';
    }
    if (punctuationRegex.test(username[username.length - 1])) {
        problem.invalidEnd = 'Username must end with an alphanumeric character';
    }
    if (username.includes('--')) {
        problem.doubleHyphen = 'Username cannot contain multiple hyphens in a row';
    }
    if (punctuationRegex.test(username.replace(/-/g, ''))) {
        problem.invalidChars = 'Username may only contain alphanumeric characters and hyphens';
    }
    return problem;
};

const normalizeUsername = (username, option) => {
    const config = {
        validate : true,
        ...option
    };
    if (config.validate) {
        validateUsername(username, config);
    }
    return username.toLowerCase().replace(new RegExp(punctuationRegex, 'gi'), '');
};

const isValidUsername = (username, option) => {
    const config = { ...option };
    return (config.allowEmpty && !username) || usernameRegex.test(username);
};

const isNormalizedUsername = (username, option) => {
    const config = { ...option };
    return username === normalizeUsername(username, config);
};

module.exports = {
    isNormalizedUsername,
    isValidUsername,
    normalizeUsername,
    punctuationRegex,
    usernameRegex,
    validateUsername
};
