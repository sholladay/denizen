# denizen [![Build status for Denizen](https://img.shields.io/circleci/project/sholladay/denizen/master.svg "Build Status")](https://circleci.com/gh/sholladay/denizen "Builds")

> Username validation and processing utilities

If you want to support a wide range of usernames, including uppercase and lowercase characters, numbers, and hyphens, but also want an easy way to compare them and prevent simple typosquatting, `denizen` can help you.

## Contents

 - [Why?](#why)
 - [Install](#install)
 - [Usage](#usage)
 - [API](#api)
 - [Contributing](#contributing)
 - [License](#license)

## Why?

A username is a unique, human-readable identifier for a user. They are used in a wide variety of contexts, such as the URL to link to a person's profile page on a social media site or as the name of a home directory to hold a user's data.

People love to have usernames that match their aesthetic preferences (e.g. someone named Mary-Jo Lee may prefer `Mary-Jo-Lee` or `MaryJo-Lee` more than `MaryJoLee` or `maryjolee`). But the more variations we allow, the harder it is to ensure a username will be valid, unique, and safe in all of the contexts we may want to use it. That can also put our user's security at risk by making it easier to [typosquat](https://en.wikipedia.org/wiki/Typosquatting), among other concerns.

This is where `denizen` comes in, providing tools for validating and comparing usernames in a safe and reliable manner, based on proven conventions.

## Install

```sh
npm install denizen --save
```

## Usage

```js
const denizen = require('denizen');
denizen.isValidUsername('Jane-Doe');    // => true
denizen.normalizeUsername('Jane-Doe');  // => 'janedoe'
```

For UX reasons, your app should save usernames in a manner that preserves their case and punctuation after validating them. Searching for and comparing usernames, however, should always involve lowercasing them and removing their punctuation, which we refer to as "normalizing" the username. This way, we can support vanity usernames with casing and punctuation, while preventing the creation of new usernames that are confusingly similar to an existing one. It also makes it easier for people to find each other, since users don't need to remember any punctuation.

Rules for valid usernames:
 - Must have a length of 1-30 characters (inclusive).
 - Must contain only alphanumeric characters and hyphens.
 - Must start and end with an alphanumeric character.
 - Must not have multiple hyphens in a row.

## API

### punctuationRegex

Type: `RegExp`

Pattern for matching non-alphanumeric characters.

### usernameRegex

Type: `RegExp`

Pattern for matching all valid usernames (regardless of normalization).

### validateUsername(username, option)

Returns the `username` as-is if it is valid (regardless of normalization), otherwise throws an error whose message describes a constraint that has been violated.

Note that the `validate` option is implicitly always `true` for this method.

```js
denizen.validateUsername('Jazz-Master');   // => 'Jazz-Master'
denizen.validateUsername('Jazz-Master-');  // Error: Username must end with an alphanumeric character
```

### validateUsername.silent(username, option)

Returns an object of `username` validation problems. If `username` is valid (regardless of normalization), the object will be empty, otherwise it will contain messages describing each violation.

```js
denizen.validateUsername.silent('I-Am-Okay');      // => {}
denizen.validateUsername.silent('IEndWithABang!')  // => { invalidEnd : 'Username must end with an alphanumeric character' }
```

If `username` is invalid, the returned object will have at least one of properties below.

Key            | Description
-------------- | -----------
`tooShort`     | The `username` is falsey. If the `allowEmpty` option is set to `true`, this will never be returned.
`tooLong`      | The `username` is more than thirty characters.
`doubleHyphen` | The `username` has at least two consecutive hyphens (`--`).
`invalidStart` | The `username` has a non-alphanumeric first character.
`invalidEnd`   | The `username` has a non-alphanumeric last character.
`invalidChars` | The `username` has a character that is neither alphanumeric, nor a hyphen.

### isValidUsername(username, option)

Returns `true` if the `username` is valid, as determined by `usernameRegex`, otherwise returns `false`.

Note that the `validate` option is implicitly always `true` for this method, but validation errors will be represented via the returned boolean instead of being thrown. If the `allowEmpty` option is set to `true`, a falsey `username` is treated as valid.

```js
denizen.isValidUsername('Jazz-Master-1');   // => true
denizen.isValidUsername('-Jazz-Master-1');  // => false
```

### normalizeUsername(username, option)

Returns the `username` in lowercase, with all non-alphanumeric characters removed.

Note that validation happens before normalization. Set the `validate` option to `false` if you want to force normalization of invalid usernames, but note that the return value is then not guaranteed to be a valid username, since it could exceed the maximum length limit for valid usernames.

```js
denizen.normalizeUsername('Jazz-Master-1');  // => 'jazzmaster1'
```

### isNormalizedUsername(username, option)

Returns `true` if the username is all lowercase and only contains alphanumeric characters, otherwise returns `false`.

```js
denizen.isNormalizedUsername('Jazz-Master-1');  // => false
denizen.isNormalizedUsername('jazzmaster1');    // => true
```

#### username

Type: `string`<br>
Example: `Jazz-Master`

#### option

Type: `object`

##### validate

Type: `boolean`<br>
Default: `true`

Throw when `username` is invalid, as determined by `validateUsername()`.

##### allowEmpty

Type: `boolean`<br>
Default: `false`

Allow `username` to be falsey, causing it to be treated as valid and normalized. This is useful to avoid errors being thrown when a form field has not been filled out yet, for example.

Note that this option only has an effect when validation is enabled. If you set `validate` to `false`, empty usernames will always be allowed and this option will be ignored.

## Contributing

See our [contributing guidelines](https://github.com/sholladay/denizen/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/denizen/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/denizen/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/denizen/blob/master/LICENSE "License for denizen") © [Seth Holladay](https://seth-holladay.com "Author of denizen")

Go make something, dang it.
