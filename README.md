Simple package to provide connection between tap:i18n-db and aldeed:collection2 [![Build Status](https://travis-ci.org/andrew-sygyda/meteor-tap-i18n-schema.svg?branch=master)](https://travis-ci.org/andrew-sygyda/meteor-tap-i18n-schema)
===

### Instalation

In your Meteor app directory put it into `packages/` folder

### Example

This package add `attachI18nSchema` method to `TAPi18n.Collection`.

```javascript
var Posts = TAPi18n.Collection('posts', {
  languages: [ 'de', 'en' ],
  base_language: 'de'
});

Posts.attachI18nSchema({
  title: {
    label: 'Title',
    type: String,
    max: 80,
    i18n: true
  },
  description: {
    label: 'Description',
    type: String,
    max: 80,
    i18n: true
  }
});
```

So you can see that now `TAPi18n.Collection` have one additional option it is array of `languages`. Also when you want that your fields will be translated, you need pass `i18n` option to field object.
