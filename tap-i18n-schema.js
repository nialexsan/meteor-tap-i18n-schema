'use strict';

SimpleSchema.extendOptions({
  i18n: Match.Optional(Boolean),
  i18nLabel: Match.Optional(String)
});

function clone (obj) {
  return lodash.clone(obj, true);
}

var originAttachSchema = Mongo.Collection.prototype.attachSchema,
  originCollection = TAPi18n.Collection,
  i18nCollection = function (name, options) {
    var collection = originCollection(name, options);

    // if (Meteor.isClient && ((Package["yogiben:admin"] != null) || (Package["ansyg:i18n-admin"] != null))) {
    //   collection._disableTransformationOnRoute(/^\/admin(\/?$|\/)/);
    // }

    if (options && !options.languages) {
      options.languages = [ 'en' ];
    }

    collection._languages = options.languages;
    collection.attachI18nSchema = function (ss, opts) {
      var langs, i18nSchema = lodash.extend({}, ss);
      if (typeof ss !== 'object') {
        throw new Meteor.Error('schema-error',
          'Please check your schema pass to attachI18nSchema');
      }

      langs = collection._languages;

      if (!langs.length) {
        return originAttachSchema.call(this, ss, opts);
      }

      lodash.each(i18nSchema, function (field, key) {
        if (!field.i18n) return;

        var origField = clone(field);

        lodash.each(langs, function (lang, index) {
          i18nSchema[key + '.' + lang] = clone(origField);
        });

        field.label = ' ';
        field.type = Object;
        field.optional = true;
        delete field.autoform;
        field.autoform = {
          type: 'i18nObject'
        };
        field.autoValue = function () {
          if (this.value) {
            return this.value;
          }

          var self = this, vals = [];

          _.each(Meteor.settings.public.langs, function (lang) {
            vals.push(!self.field(key + '.' + lang).value);
          });

          return _.all(vals) ? {} : void 0;
        };
      });

      return originAttachSchema.call(this, i18nSchema, opts);
    };

    return collection;
  };

TAPi18n.Collection = i18nCollection;
