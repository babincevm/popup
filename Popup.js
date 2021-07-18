/**
 * @typedef {Object} Selectors
 * @property {(HTMLElement|String)} [opener=popup__opener] - Selector or DOMNode of element that will open popup
 * @property {(HTMLElement|String)} [container=popup__container] - Selector or DOMNode of popup container
 * @property {(HTMLElement|String)} [wrapper=popup__wrapper] - Selector or DOMNode of popup content wrapper
 * @property {(HTMLElement|String)} [content=popup__content] - Selector or DOMNode of popup content content
 * @property {(HTMLElement|String)} [closeButton=popup__close] - Selector or DOMNode of popup close button
 */
/**
 * @typedef {Object} PopupClasses
 * @property {String} [hidden=popup--hidden] - Class for hidden popup
 * @property {String} [opening=popup--opening] - Class for popup while opening
 * @property {String} [opened=popup--opened] - Class for opened popup
 * @property {String} [closing=popup--closing] - Class for popup while closing
 */

/**
 * @typedef {Object} AnimationTimingFunctions
 * @property {String} [opening=cubic-bezier(.44,1.29,.55,1.15)] - animation timing function for popup opening
 * @property {String} [closing=ease] - animation timing function for popup closing
 */


/**
 * @typedef {Object} Timings
 * @property {Number|String} [openingTime=500] - popup opening timing
 * @property {Number|String} [closingTime=500] - popup closing timing
 */

/**
 * @typedef {Object} Options
 * @property {Selectors} [selectors]
 * @property {PopupClasses} [classes] - Popup classes
 * @property {Timings} [timings] - Popup timings
 * @property {Boolean} [useEscapeToClose=true] - Popup close on escape pressed
 * @property {String} [containerBackgroundColor=] - Popup container background color
 * @property {AnimationTimingFunctions} [animationTimingFunctions] - Popup animation timing functions
 * @property {HTMLElement|String|Array} [setGrabListenerOn=popup__wrapper] - Set grab listener on passed DOM Node
 */

class Popup {
  /**
   * =================================== FIELDS ===================================
   */
  _version = '1.0.0';
  _nodes = {
    _opener: null,
    _container: null,
    _wrapper: null,
    _content: null,
    _closeButton: null,
    _html: null,
  };
  _animationClasses = {
    _hidden: 'popup--hidden',
    _opening: 'popup--opening',
    _opened: 'popup--opened',
    _closing: 'popup--closing',
  };
  _animationTimingFunctions = {
    _opening: 'cubic-bezier(.44,1.29,.55,1.15)',
    _closing: 'ease',
  };
  _timings = {
    _opening: 500,
    _closing: 500,
  };
  _backgroundColor = 'rgba(0,0,0,0.5)';
  _useEscapeToClose = true;
  _grabListenerOn = null;

  _isMoveEventsAdded = false;
  _isCloseEventAdded = false;

  _isAnimating = false;


  /**
   * @param {Options} [options] Options for popup
   */
  constructor (options) {
    this.classes = options?.classes;
    this.nodes = options?.selectors;
    this.timings = options?.timings;
    this.useEscapeToClose = options?.useEscapeToClose;
    this.backgroundColor = options?.containerBackgroundColor;
    this.GrabListenerOn = options?.setGrabListenerOn;

    this._nodes._container.classList.add(this._animationClasses._hidden);
    Object.seal(this);

    this.addOpenListener();
  }


  /**
   * =================================== ACCESSORS ===================================
   */

  /**
   * @param {Selectors} selectors
   */
  set nodes (selectors) {
    if ( selectors ) {
      if ( selectors.opener ) {
        if ( this.isNode(selectors.opener) ) {
          this._nodes._opener = selectors.opener;
        } else if ( this.isString(selectors.opener) ) {
          let node = this.selectNode(selectors.opener);
          if ( !node ) {
            console.error('Invalid selector for popup opener');
          } else {
            this._nodes._opener = node;
          }
        } else {
          console.error('Opener is not a valid selector or HTMLElement');
        }
      }

      if ( selectors.container ) {
        if ( this.isNode(selectors.container) ) {
          this._nodes._container = selectors.container;
        } else if ( this.isString(selectors.container) ) {
          let node = this.selectNode(selectors.container);
          if ( !node ) {
            console.error('Invalid selector for popup container');
          } else {
            this._nodes._container = node;
          }
        } else {
          console.error('Popup container is not a valid selector or HTMLElement');
        }
      }

      if ( selectors.wrapper ) {
        if ( this.isNode(selectors.wrapper) ) {
          this._nodes._wrapper = selectors.wrapper;
        } else if ( this.isString(selectors.wrapper) ) {
          let node = this.selectNode(selectors.wrapper);
          if ( !node ) {
            console.error('Invalid selector for popup wrapper');
          } else {
            this._nodes._wrapper = node;
          }
        } else {
          console.error('Popup wrapper is not a valid selector or HTMLElement');
        }
      }

      if ( selectors.closeButton ) {
        if ( this.isNode(selectors.closeButton) ) {
          this._nodes._closeButton = selectors.closeButton;
        } else if ( this.isString(selectors.closeButton) ) {
          let node = this.selectNode(selectors.closeButton);
          if ( !node ) {
            console.error('Invalid selector for popup close button');
          } else {
            this._nodes._closeButton = node;
          }
        } else {
          console.error('Popup close button is not a valid selector or HTMLElement');
        }
      }

      if ( selectors.content ) {
        if ( this.isNode(selectors.content) ) {
          this._nodes._content = selectors.content;
        } else if ( this.isString(selectors.content) ) {
          let node = this.selectNode(selectors.content);
          if ( !node ) {
            console.error('Invalid selector for popup content');
          } else {
            this._nodes._content = node;
          }
        } else {
          console.error('Popup content is not a valid selector or HTMLElement');
        }
      }
    }

    if ( !this._nodes._opener ) {
      let node = this.selectNode('.popup__opener');
      if ( !node ) {
        console.error('Unable to select default popup opener');
      } else {
        this._nodes._opener = node;
      }
    }
    if ( !this._nodes._container ) {
      let node = this.selectNode('.popup__container');
      if ( !node ) {
        console.error('Unable to select default popup container');
      } else {
        this._nodes._container = node;
      }
    }

    if ( !this._nodes._wrapper ) {
      let node = this.selectNode('.popup__wrapper');
      if ( !node ) {
        console.error('Unable to select default popup wrapper');
      } else {
        this._nodes._wrapper = node;
      }
    }

    if ( !this._nodes._content ) {
      let node = this.selectNode('.popup__content');
      if ( !node ) {
        console.error('Unable to select default popup content');
      } else {
        this._nodes._content = node;
      }
    }

    if ( !this._nodes._closeButton ) {
      let node = this.selectNode('.popup__close');
      if ( !node ) {
        console.error('Unable to select default popup close button');
      } else {
        this._nodes._closeButton = node;
      }
    }
    this._nodes._html = document.getElementsByTagName('html')[0];
  }

  /**
   * @param {PopupClasses} classes
   */
  set classes (classes) {
    if ( classes ) {
      if ( classes.hidden && this.isString(classes.hidden) ) {
        this._animationClasses._hidden = classes.hidden;
      }
      if ( classes.opening && this.isString(classes.opening) ) {
        this._animationClasses._opening = classes.opening;
      }
      if ( classes.opened && this.isString(classes.opened) ) {
        this._animationClasses._opened = classes.opened;
      }
      if ( classes.closing && this.isString(classes.closing) ) {
        this._animationClasses._closing = classes.closing;
      }
    }
  }

  set useEscapeToClose (value) {
    if ( value !== null && value !== undefined ) {
      this._useEscapeToClose = value;
    } else {
      this._useEscapeToClose = true;
    }
  }

  /**
   * @param {Timings} timings
   */
  set timings (timings) {
    if ( timings ) {
      if ( timings.openingTime && this.isNumber(timings.openingTime) ) {
        this._timings._opening = timings.openingTime - 0;
      }
      if ( timings.closingTime && this.isNumber(timings.closingTime) ) {
        this._timings._closing = timings.closingTime - 0;
      }
    }
  }

  set backgroundColor (value) {
    if ( value && this.isString(value) ) {
      this._backgroundColor = value;
    }

    this.setNodeCSSProperties(this._nodes._container, [
      {
        name: 'popup-background',
        value: this._backgroundColor,
      },
    ]);
  }

  /**
   * @param {AnimationTimingFunctions} functions
   */
  set animationTimingFunctions (functions) {
    if ( functions ) {
      if ( functions.opening && this.isString(functions.opening) ) {
        this._animationTimingFunctions._opening = functions.opening;
      }
      if ( functions.closing && this.isString(functions.closing) ) {
        this._animationTimingFunctions._closing = functions.closing;
      }
    }
  }

  set GrabListenerOn (selector) {
    if ( selector ) {
      if ( this.isNode(selector) ) {
        this._grabListenerOn = selector;
      } else if ( this.isString(selector) ) {
        let node = document.querySelectorAll(selector);
        if ( !node || node.length === 0 ) {
          console.error('Unable to set grab event handlers on passed selector');
        } else {
          this._grabListenerOn = node;
        }
      } else if ( Array.isArray(selector) ) {
        selector.forEach(sel => this.GrabListenerOn = sel);
      } else {
        console.error('Grab event handler selector is invalid');
      }
    }

    if ( !this._grabListenerOn ) {
      if ( this._nodes._wrapper ) {
        this._grabListenerOn = [this._nodes._wrapper];
      } else {
        console.error('Grab event handlers can not be added');
      }
    }
  }

  /**
   * @return {String} Current version
   */
  get version () {
    return this._version;
  }

  /**
   * @return {{closing: String, hidden: String, opened: String, opening: String}}
   */
  get classes () {
    return {
      hidden: this._animationClasses._hidden,
      opening: this._animationClasses._opening,
      opened: this._animationClasses._opened,
      closing: this._animationClasses._closing,
    };
  }

  /**
   * @return {{closing: Number, opening: Number}}
   */
  get timings () {
    return {
      opening: this._timings._opening,
      closing: this._timings._closing,
    };
  }


  /**
   * =================================== METHODS ===================================
   */

  /**
   * Select DOMNode
   * @param {String} selector - String selector
   * @return {(HTMLElement|Boolean)} - is DOMNode selected
   */
  selectNode (selector) {
    if ( !selector ) return false;

    let htmlElement = document.querySelector(selector);
    if ( !htmlElement ) return false;

    return htmlElement;
  }

  /**
   * Check if variable is a DOM Node
   * @param {*} variable - Variable to check
   * @return {boolean} - variable is a DOM Element
   */
  isNode (variable) {
    return variable instanceof HTMLElement || variable instanceof Element || variable instanceof HTMLDocument;
  }

  /**
   * Check if variable is a string
   * @param {*} variable - variable to check
   * @return {boolean} - variable is a string
   */
  isString (variable) {
    return typeof variable === 'string' || variable instanceof String;
  }

  isNumber (variable) {
    return !isNaN(parseFloat(variable)) && !isNaN(variable - 0);
  }

  /**
   *
   * @param {HTMLElement} node
   * @param {Array} properties
   */
  setNodeCSSProperties (node, properties) {
    properties.forEach(property => {
      node.style.setProperty(`--${property.name}`, property.value);
    });
  }

  openPopup () {
    if ( this._isAnimating ) return;

    this._isAnimating = true;
    this._nodes._html.classList.add('has-popup');
    let coordinates = this._nodes._opener.getBoundingClientRect();
    let xTransformOrigin = coordinates.x + (coordinates.width / 2);
    let yTransformOrigin = coordinates.y + (coordinates.height / 2);

    this._nodes._container.classList.replace(this._animationClasses._hidden, this._animationClasses._opening);
    this.setNodeCSSProperties(this._nodes._container, [
      {
        name: 'animating-transform-origin',
        value: `${xTransformOrigin}px ${yTransformOrigin}px`,
      },
      {
        name: 'scale-start',
        value: '0',
      },
      {
        name: 'opening-timing',
        value: `${this._timings._opening}ms`,
      },
      {
        name: 'opening-animation-timing-func',
        value: this._animationTimingFunctions._opening,
      },
    ]);

    setTimeout(() => {
      this._nodes._container.classList.replace(this._animationClasses._opening, this._animationClasses._opened);
      !this._isCloseEventAdded && this.addCloseListener();
      !this._isMoveEventsAdded && this.addGrabListener();
      this._isAnimating = false;
    }, this._timings._opening);
  }

  closePopup () {
    if ( this._isAnimating ) return;

    this._isAnimating = true;
    this._nodes._container.classList.replace(this._animationClasses._opened, this._animationClasses._closing);
    this.setNodeCSSProperties(this._nodes._container, [
      {
        name: 'scale-end',
        value: '0',
      },
      {
        name: 'closing-timing',
        value: `${this._timings._closing}ms`,
      },
      {
        name: 'closing-animation-timing-func',
        value: this._animationTimingFunctions._closing,
      },
    ]);
    setTimeout(() => {
      this._nodes._container.classList.replace(this._animationClasses._closing, this._animationClasses._hidden);
      this.addOpenListener();
      this._nodes._html.classList.remove('has-popup');
      this._isAnimating = false;
    }, this._timings._closing);
  }

  addOpenListener () {
    this._nodes._opener.addEventListener('click', () => {
      this.openPopup();
    }, {once: true});
  }

  addCloseListener () {
    this._nodes._container.addEventListener('click', event => {
      if ( !event.target.isSameNode(this._nodes._content) ) return;
      this.closePopup();
    });
    this._useEscapeToClose && document.addEventListener('keyup', event => {
      if ( event.code === 'Escape' ) this.closePopup();
    });
  }

  addGrabListener () {
    let locked = false;
    let isReturning = false;
    let offset, initialPosition;
    let percentage = 1;
    let rect;

    this._isMoveEventsAdded = true;

    console.log(this._grabListenerOn);
    this._grabListenerOn.forEach(node => node.addEventListener('mousedown', event => {
      if ( locked || isReturning ) return;

      event.preventDefault();
      rect = this._nodes._wrapper.getBoundingClientRect();
      rect.initialCenter = rect.top + (rect.height / 2);
      offset = [Math.round(event.clientX - rect.left), Math.round(event.clientY - rect.top)];
      initialPosition = [
        rect.x,
        rect.y,
      ];
      this._nodes._container.classList.add('popup--moving');
      this.setNodeCSSProperties(this._nodes._wrapper, [
        {
          name: 'popup-moving-transform-origin',
          value: `${event.clientX - initialPosition[0]}px ${event.clientY - initialPosition[1]}px`,
        },
      ]);
      this.setNodeCSSProperties(this._nodes._container, [
        {
          name: 'popup-moving-transition',
          value: null,
        },
      ]);

      locked = true;
    }, true));

    document.addEventListener('mouseup', event => {
      if ( !locked || isReturning ) return;
      event.preventDefault();
      locked = false;

      isReturning = true;
      this._nodes._wrapper.classList.replace('popup__wrapper--moving', 'popup__wrapper--moving-back');
      this.setNodeCSSProperties(this._nodes._wrapper, [
        {
          name: 'popup-moving-back-transition',
          value: 'all .5s',
        },
        {
          name: 'popup-moving-back-left',
          value: `${initialPosition[0]}px`,
        },
        {
          name: 'popup-moving-back-top',
          value: `${initialPosition[1]}px`,
        },
      ]);


      this.setNodeCSSProperties(this._nodes._container, [
        {
          name: 'popup-moving-opacity',
          value: null,
        },
        {
          name: 'popup-moving-transition',
          value: 'all .5s',
        },
      ]);

      setTimeout(() => {
        this._nodes._wrapper.classList.remove('popup__wrapper--moving-back');
        this._nodes._container.classList.remove('popup--moving');
        isReturning = false;
      }, 500);


      if ( percentage <= 0.7 ) {
        this.closePopup();
      }


    }, true);

    document.addEventListener('mousemove', event => {
      if ( !locked || isReturning ) return;
      event.preventDefault();

      let mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };

      let top = mousePosition.y - offset[1];

      if ( Math.abs(top - initialPosition[1]) < 10 ) return;
      percentage = 1 - (initialPosition[1] - top) / (4.5 * initialPosition[1]);
      percentage = percentage > 1 ? 1 : percentage;
      percentage = percentage < 0.3 ? 0.3 : percentage;

      this._nodes._wrapper.classList.add('popup__wrapper--moving');
      this.setNodeCSSProperties(this._nodes._wrapper, [
        {
          name: 'popup-moving-top',
          value: `${top}px`,
        },
        {
          name: 'popup-moving-left',
          value: `${mousePosition.x - offset[0]}px`,
        },
        {
          name: 'popup-moving-scale',
          value: percentage,
        },

      ]);
      this.setNodeCSSProperties(this._nodes._container, [
        {
          name: 'popup-moving-opacity',
          value: percentage,
        },
      ]);
    }, true);

  }
}
