var $, Range, Trie,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Trie = (function() {
  function Trie() {
    this.trie = {};
  }

  Trie.prototype.push = function(value) {
    var char, i, j, len, obj, ref, results;
    value = value.toString();
    obj = this.trie;
    ref = value.split('');
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      char = ref[i];
      if (obj[char] == null) {
        if (i === (value.length - 1)) {
          obj[char] = null;
        } else {
          obj[char] = {};
        }
      }
      results.push(obj = obj[char]);
    }
    return results;
  };

  Trie.prototype.find = function(value) {
    var char, i, j, len, obj, ref;
    value = value.toString();
    obj = this.trie;
    ref = value.split('');
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      char = ref[i];
      if (obj.hasOwnProperty(char)) {
        if (obj[char] === null) {
          return true;
        }
      } else {
        return false;
      }
      obj = obj[char];
    }
  };

  return Trie;

})();

Range = (function() {
  function Range(trie1) {
    this.trie = trie1;
    if (this.trie.constructor !== Trie) {
      throw Error('Range constructor requires a Trie parameter');
    }
  }

  Range.rangeWithString = function(ranges) {
    var j, k, len, n, r, range, ref, ref1, trie;
    if (typeof ranges !== 'string') {
      throw Error('rangeWithString requires a string parameter');
    }
    ranges = ranges.replace(/ /g, '');
    ranges = ranges.split(',');
    trie = new Trie;
    for (j = 0, len = ranges.length; j < len; j++) {
      range = ranges[j];
      if (r = range.match(/^(\d+)-(\d+)$/)) {
        for (n = k = ref = r[1], ref1 = r[2]; ref <= ref1 ? k <= ref1 : k >= ref1; n = ref <= ref1 ? ++k : --k) {
          trie.push(n);
        }
      } else if (range.match(/^\d+$/)) {
        trie.push(range);
      } else {
        throw Error("Invalid range '" + r + "'");
      }
    }
    return new Range(trie);
  };

  Range.prototype.match = function(number) {
    return this.trie.find(number);
  };

  return Range;

})();

var CreditCardValidator = (function(global) {
  'use strict';

  function validateCreditCard(input) {
    var bind, card, card_type, card_types, get_card_type, is_valid_length, is_valid_luhn, j, len, normalize, ref, validate, validate_number;
    card_types = [
      {
        name: 'elo',
        range: '509, 50670-50676, 65004, 65041-65043, 65049-65058, 65070, 65091, 65166, 65500, 65503-65504, 401178-401179, 431274, 438935, 451416, 457393, 457631-457632, 504175, 506699, 506770-506778, 627780, 636297, 636368, 650031, 650033, 650035-650039, 650050-650051, 650405-650409, 650485-650489, 650530-650538, 650541-650549, 650590-650598, 650710-650727, 650901-650909, 650920, 651652-651659, 651670-651679, 655010-655029, 655050-655058',
        valid_length: [16],
        cvc_length: [3],
        luhn: false
      }, {
        name: 'aura',
        range: '50',
        valid_length: [16, 17, 18, 19],
        cvc_length: [3],
        luhn: true
      }, {
        name: 'hipercard',
        range: '38, 60',
        valid_length: [13, 16, 19],
        cvc_length: [3],
        luhn: false
      }, {
        name: 'amex',
        range: '34, 37',
        valid_length: [15],
        cvc_length: [3, 4],
        luhn: true
      }, {
        name: 'diners',
        range: '300-305, 36',
        valid_length: [14],
        cvc_length: [3],
        luhn: true
      }, {
        name: 'visa',
        range: '4',
        valid_length: [13, 14, 15, 16, 17, 18, 19],
        cvc_length: [3],
        luhn: true
      }, {
        name: 'mastercard',
        range: '51-55, 22-27',
        valid_length: [16],
        cvc_length: [3],
        luhn: true
      }
    ];

    var options = {};
    if (options.accept == null) {
      options.accept = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = card_types.length; j < len; j++) {
          card = card_types[j];
          results.push(card.name);
        }
        return results;
      })();
    }
    ref = options.accept;
    for (j = 0, len = ref.length; j < len; j++) {
      card_type = ref[j];
      if (indexOf.call((function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = card_types.length; k < len1; k++) {
            card = card_types[k];
            results.push(card.name);
          }
          return results;
        })(), card_type) < 0) {
        throw Error("Credit card type '" + card_type + "' is not supported");
      }
    }
    get_card_type = function(number) {
      var k, len1, r, ref1;
      ref1 = (function() {
        var l, len1, ref1, results;
        results = [];
        for (l = 0, len1 = card_types.length; l < len1; l++) {
          card = card_types[l];
          if (ref1 = card.name, indexOf.call(options.accept, ref1) >= 0) {
            results.push(card);
          }
        }
        return results;
      })();
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        card_type = ref1[k];
        r = Range.rangeWithString(card_type.range);
        if (r.match(number)) {
          return card_type;
        }
      }
      return null;
    };
    is_valid_luhn = function(number) {
      var digit, k, len1, n, ref1, sum;
      sum = 0;
      ref1 = number.split('').reverse();
      for (n = k = 0, len1 = ref1.length; k < len1; n = ++k) {
        digit = ref1[n];
        digit = +digit;
        if (n % 2) {
          digit *= 2;
          if (digit < 10) {
            sum += digit;
          } else {
            sum += digit - 9;
          }
        } else {
          sum += digit;
        }
      }
      return sum % 10 === 0;
    };
    is_valid_length = function(number, card_type) {
      var ref1;
      return ref1 = number.length, indexOf.call(card_type.valid_length, ref1) >= 0;
    };
    validate_number = function(number) {
      var length_valid, luhn_valid;
      card_type = get_card_type(number);
      luhn_valid = false;
      length_valid = false;
      if (card_type != null) {
        luhn_valid = is_valid_luhn(number);
        length_valid = is_valid_length(number, card_type);
      }
      return {
        card_type: card_type,
        valid: (!card_type.luhn || luhn_valid) && length_valid,
        luhn_valid: luhn_valid,
        length_valid: length_valid
      };
    };
    validate = (function(_this) {
      return function() {
        var number;
        number = normalize(input);
        return validate_number(number);
      };
    })(this);
    normalize = function(number) {
      return number.replace(/[ -]/g, '');
    };

    return validate(input);
  };

  return {
    validate: validateCreditCard
  };
})(this);