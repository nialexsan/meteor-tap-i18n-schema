'use strict';

SimpleSchema.extendOptions({
  i18n: Match.Optional(Boolean)
});

var originAttachSchema = Mongo.Collection.prototype.attachSchema,
  originCollection = TAPi18n.Collection,
  i18nCollection = function (name, options) {
    var collection = originCollection(name, options);

    if (Meteor.isClient && ((Package["yogiben:admin"] != null) || (Package["ansyg:i18n-admin"] != null))) {
      collection._disableTransformationOnRoute(/^\/admin(\/?$|\/)/);
    }

    if (options && !options.languages) {
      options.languages = [ 'en' ];
    }

    collection._languages = options.languages;
    collection.attachI18nSchema = function (ss, opts) {
      var langs, i18nSchema = _.extend({}, ss);
      if (typeof ss !== 'object') {
        throw new Meteor.Error('schema-error',
          'Please check your schema pass to attachI18nSchema');
      }

      langs = collection._languages;

      if (!langs.length) {
        return originAttachSchema.call(this, ss, opts);
      }

      _.each(i18nSchema, function (field, key) {
        if (!field['i18n']) return;

        _.each(langs, function (lang, index) {
          i18nSchema['i18n.' + lang + '.' + key] = _.extend({}, field, {
            optional: true
          });

          delete i18nSchema[key];
        });
      });

      return originAttachSchema.call(this, i18nSchema, opts);
    };

    return collection;
  };

TAPi18n.Collection = i18nCollection;
