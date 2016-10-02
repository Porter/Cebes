(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.frontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const editHelper = require('../helpers/edit_helper');

let text, lastSentText;

let div;

function getDivText() {
  return div.textContent;
}

function check(div, eventEmmitter) {
  let newText = div.textContent;

  let diff = editHelper.textDiff(text, newText);
  if (diff.length != 0) {
    eventEmmitter.emit("text diff", diff);
    text = lastSentText = newText;
  }

  setTimeout(function() {
    check(div, eventEmmitter);
  }, 100);
}

function watch(eventEmmitter) {
  div = document.getElementById("rootDiv");
  text = lastSentText = getDivText();
  check(div, eventEmmitter);
}

function isUpToDate() {
  return getDivText() == lastSentText;
}

module.exports = {
  watch: watch,
  isUpToDate: isUpToDate
};

},{"../helpers/edit_helper":4}],2:[function(require,module,exports){
var queryParams = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

module.exports = queryParams;

},{}],3:[function(require,module,exports){
const EventEmitter = require('events');
const Edit = require("../models/edit");
const divWatcher = require("./div_watcher");
const queryParams = require("./query_params");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

const documentId = parseInt(queryParams['id']);

let socket = io();
socket.on('connect', function() {
  socket.emit('init', documentId);
});


window.addEventListener('load', function() {
  divWatcher.watch(myEmitter);
}, false);

myEmitter.on('text diff', diff => {
  let edit = new Edit({diff: diff, documentId: documentId})
  socket.emit("edit", edit);
});


module.exports = {
  isUpToDate: divWatcher.isUpToDate
};

},{"../models/edit":5,"./div_watcher":1,"./query_params":2,"events":6}],4:[function(require,module,exports){
module.exports = {
  textDiff: textDiff,
  applyTextDiff: applyTextDiff
}

function charsAreEqual(a, b) {
	if (a == b) return true;
	a = a.charCodeAt(0);
	b = b.charCodeAt(0);
	return (a == 32 || b == 32) && (a == 160 || b == 160);
}


function condenseTextDiff(diff) {
  let index;
  for (let i = 0; i < diff.length; i++) {
    let change = diff[i];
    if (change.i == index) {
      let last = diff[i-1];
      if (typeof last.val == typeof change.val && typeof last.val == "string") {
        diff[i-1].val += change.val;
        diff.splice(i, 1);
        i--;
      }
    }
    if (change.i == index + 1) {
      let last = diff[i-1];
      if (typeof last.val == typeof change.val && typeof last.val == "number") {
        diff[i-1].val += change.val;
        diff.splice(i, 1);
        i--;
      }
    }
    index = change.i;
  }
  return diff;
}

function textDiff(text1, text2) {
  var M = text1.length, N = text2.length;
  var MAX = M + N;


  var v = new Array(Math.max( 2*MAX - 1, 1) );
  var paths = new Array(Math.max( 2*MAX - 1, 1) );

  v[N] = 0;
  while (v[N] < M && v[N] < N && charsAreEqual(text1.charAt(v[N]), text2.charAt(v[N]))) {
    v[N]++;
  }

  paths[N] = [];

  if (v[N] == M && v[N] == N) {
    return [];
  }


  for (var d = 1; d <= MAX; d++) {
    for (var k = -d; k <= d; k += 2) {
      var path = k+N;

      var x, y;

      /*if (k == -d) {
        x = v[k + N + 1];
      }
      else if (k == d) {
        x = v[k + N - 1] + 1;
      }
      else {
        if (v[k + N -1 ] + 1 > v[k + N + 1]) {
          x = v[k + N - 1] + 1;
        }
        else {
          x = v[k + N + 1];
        }
      }*/


      if ((k == -d || v[path - 1] < v[path + 1]) && k != d) { // compact version of above if else statements
        x = v[path + 1];
        var cpy = paths[path + 1].slice();
        cpy.push({i:x, val:text2.charAt(x-k-1)});
        paths[path] = cpy;
      }
      else {
        x = v[path - 1] + 1;

        var cpy = paths[path - 1].slice();
        cpy.push({i:x-1, val:1});
        paths[path] = cpy;
      }

      y = x-k;

      while (x < M && y < N && charsAreEqual(text1.charAt(x), text2.charAt(y))) {
        x++; y++;
      }

      if (x >= M && y >= N) {
        return condenseTextDiff(paths[path]);
      }

      v[path] = x;
    }
  }
}

function applyTextDiff(text, diff) {
  diff.forEach(change => {
    let type = typeof change.val;
    if (type == "string") {
      text = text.substring(0, change.i) + change.val + text.substring(change.i);
    }
    else if (type == "number"){
      text = text.substring(0, change.i) + text.substring(change.i + change.val);
    }
    else {
      throw new Error(`typeof diff[i].val must be 'string' or 'number', not '${type}'`);
    }
  });
  return text;
}

},{}],5:[function(require,module,exports){
class Edit {
  constructor(options) {
    this.diff = options.diff;
    this.number = options.number;
    this.confirmed = options.confirmed;
    this.documentId = options.documentId;
  }

  getDiff() { return this.diff; }
  getNumber() { return this.number; }
  getDocumentId() { return this.documentId; }
  isConfirmed() { return this.confirmed; }
}

module.exports = Edit;

},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[3])(3)
});
