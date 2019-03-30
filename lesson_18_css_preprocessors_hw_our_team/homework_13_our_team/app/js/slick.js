"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

/* global window, document, define, jQuery, setInterval, clearInterval */
;

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {
  'use strict';

  var Slick = window.Slick || {};

  Slick = function () {
    var instanceUid = 0;

    function Slick(element, settings) {
      var _ = this,
          dataSettings;

      _.defaults = {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function customPaging(slider, i) {
          return $('<button type="button" />').text(i + 1);
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        focusOnChange: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: true,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000
      };
      _.initials = {
        animating: false,
        dragging: false,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: false,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: false,
        slideOffset: 0,
        swipeLeft: null,
        swiping: false,
        $list: null,
        touchObject: {},
        transformsEnabled: false,
        unslicked: false
      };
      $.extend(_, _.initials);
      _.activeBreakpoint = null;
      _.animType = null;
      _.animProp = null;
      _.breakpoints = [];
      _.breakpointSettings = [];
      _.cssTransitions = false;
      _.focussed = false;
      _.interrupted = false;
      _.hidden = 'hidden';
      _.paused = true;
      _.positionProp = null;
      _.respondTo = null;
      _.rowCount = 1;
      _.shouldClick = true;
      _.$slider = $(element);
      _.$slidesCache = null;
      _.transformType = null;
      _.transitionType = null;
      _.visibilityChange = 'visibilitychange';
      _.windowWidth = 0;
      _.windowTimer = null;
      dataSettings = $(element).data('slick') || {};
      _.options = $.extend({}, _.defaults, settings, dataSettings);
      _.currentSlide = _.options.initialSlide;
      _.originalSettings = _.options;

      if (typeof document.mozHidden !== 'undefined') {
        _.hidden = 'mozHidden';
        _.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        _.hidden = 'webkitHidden';
        _.visibilityChange = 'webkitvisibilitychange';
      }

      _.autoPlay = $.proxy(_.autoPlay, _);
      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
      _.changeSlide = $.proxy(_.changeSlide, _);
      _.clickHandler = $.proxy(_.clickHandler, _);
      _.selectHandler = $.proxy(_.selectHandler, _);
      _.setPosition = $.proxy(_.setPosition, _);
      _.swipeHandler = $.proxy(_.swipeHandler, _);
      _.dragHandler = $.proxy(_.dragHandler, _);
      _.keyHandler = $.proxy(_.keyHandler, _);
      _.instanceUid = instanceUid++; // A simple way to check for HTML strings
      // Strict HTML recognition (must start with <)
      // Extracted from jQuery v1.11 source

      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

      _.registerBreakpoints();

      _.init(true);
    }

    return Slick;
  }();

  Slick.prototype.activateADA = function () {
    var _ = this;

    _.$slideTrack.find('.slick-active').attr({
      'aria-hidden': 'false'
    }).find('a, input, button, select').attr({
      'tabindex': '0'
    });
  };

  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
    var _ = this;

    if (typeof index === 'boolean') {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= _.slideCount) {
      return false;
    }

    _.unload();

    if (typeof index === 'number') {
      if (index === 0 && _.$slides.length === 0) {
        $(markup).appendTo(_.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(_.$slides.eq(index));
      } else {
        $(markup).insertAfter(_.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(_.$slideTrack);
      } else {
        $(markup).appendTo(_.$slideTrack);
      }
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index);
    });

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.animateHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.animate({
        height: targetHeight
      }, _.options.speed);
    }
  };

  Slick.prototype.animateSlide = function (targetLeft, callback) {
    var animProps = {},
        _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }

    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate({
          left: targetLeft
        }, _.options.speed, _.options.easing, callback);
      } else {
        _.$slideTrack.animate({
          top: targetLeft
        }, _.options.speed, _.options.easing, callback);
      }
    } else {
      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -_.currentLeft;
        }

        $({
          animStart: _.currentLeft
        }).animate({
          animStart: targetLeft
        }, {
          duration: _.options.speed,
          easing: _.options.easing,
          step: function step(now) {
            now = Math.ceil(now);

            if (_.options.vertical === false) {
              animProps[_.animType] = 'translate(' + now + 'px, 0px)';

              _.$slideTrack.css(animProps);
            } else {
              animProps[_.animType] = 'translate(0px,' + now + 'px)';

              _.$slideTrack.css(animProps);
            }
          },
          complete: function complete() {
            if (callback) {
              callback.call();
            }
          }
        });
      } else {
        _.applyTransition();

        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
        }

        _.$slideTrack.css(animProps);

        if (callback) {
          setTimeout(function () {
            _.disableTransition();

            callback.call();
          }, _.options.speed);
        }
      }
    }
  };

  Slick.prototype.getNavTarget = function () {
    var _ = this,
        asNavFor = _.options.asNavFor;

    if (asNavFor && asNavFor !== null) {
      asNavFor = $(asNavFor).not(_.$slider);
    }

    return asNavFor;
  };

  Slick.prototype.asNavFor = function (index) {
    var _ = this,
        asNavFor = _.getNavTarget();

    if (asNavFor !== null && _typeof(asNavFor) === 'object') {
      asNavFor.each(function () {
        var target = $(this).slick('getSlick');

        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  };

  Slick.prototype.applyTransition = function (slide) {
    var _ = this,
        transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
    } else {
      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.autoPlay = function () {
    var _ = this;

    _.autoPlayClear();

    if (_.slideCount > _.options.slidesToShow) {
      _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
    }
  };

  Slick.prototype.autoPlayClear = function () {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  };

  Slick.prototype.autoPlayIterator = function () {
    var _ = this,
        slideTo = _.currentSlide + _.options.slidesToScroll;

    if (!_.paused && !_.interrupted && !_.focussed) {
      if (_.options.infinite === false) {
        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
          _.direction = 0;
        } else if (_.direction === 0) {
          slideTo = _.currentSlide - _.options.slidesToScroll;

          if (_.currentSlide - 1 === 0) {
            _.direction = 1;
          }
        }
      }

      _.slideHandler(slideTo);
    }
  };

  Slick.prototype.buildArrows = function () {
    var _ = this;

    if (_.options.arrows === true) {
      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

      if (_.slideCount > _.options.slidesToShow) {
        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        }
      } else {
        _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
          'aria-disabled': 'true',
          'tabindex': '-1'
        });
      }
    }
  };

  Slick.prototype.buildDots = function () {
    var _ = this,
        i,
        dot;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$slider.addClass('slick-dotted');

      dot = $('<ul />').addClass(_.options.dotsClass);

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
      }

      _.$dots = dot.appendTo(_.options.appendDots);

      _.$dots.find('li').first().addClass('slick-active');
    }
  };

  Slick.prototype.buildOut = function () {
    var _ = this;

    _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
    _.slideCount = _.$slides.length;

    _.$slides.each(function (index, element) {
      $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
    });

    _.$slider.addClass('slick-slider');

    _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();

    _.$slideTrack.css('opacity', 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass('draggable');
    }
  };

  Slick.prototype.buildRows = function () {
    var _ = this,
        a,
        b,
        c,
        newSlides,
        numOfSlides,
        originalSlides,
        slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 0) {
      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div');

        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div');

          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);

            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }

          slide.appendChild(row);
        }

        newSlides.appendChild(slide);
      }

      _.$slider.empty().append(newSlides);

      _.$slider.children().children().children().css({
        'width': 100 / _.options.slidesPerRow + '%',
        'display': 'inline-block'
      });
    }
  };

  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
    var _ = this,
        breakpoint,
        targetBreakpoint,
        respondToWidth,
        triggerBreakpoint = false;

    var sliderWidth = _.$slider.width();

    var windowWidth = window.innerWidth || $(window).width();

    if (_.respondTo === 'window') {
      respondToWidth = windowWidth;
    } else if (_.respondTo === 'slider') {
      respondToWidth = sliderWidth;
    } else if (_.respondTo === 'min') {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (_.originalSettings.mobileFirst === false) {
            if (respondToWidth < _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          } else {
            if (respondToWidth > _.breakpoints[breakpoint]) {
              targetBreakpoint = _.breakpoints[breakpoint];
            }
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (_.activeBreakpoint !== null) {
          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
            _.activeBreakpoint = targetBreakpoint;

            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
              _.unslick(targetBreakpoint);
            } else {
              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

              if (initial === true) {
                _.currentSlide = _.options.initialSlide;
              }

              _.refresh(initial);
            }

            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          _.activeBreakpoint = targetBreakpoint;

          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
            _.unslick(targetBreakpoint);
          } else {
            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);

            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }

            _.refresh(initial);
          }

          triggerBreakpoint = targetBreakpoint;
        }
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          _.options = _.originalSettings;

          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }

          _.refresh(initial);

          triggerBreakpoint = targetBreakpoint;
        }
      } // only trigger breakpoints during an actual break. not on initialize.


      if (!initial && triggerBreakpoint !== false) {
        _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
      }
    }
  };

  Slick.prototype.changeSlide = function (event, dontAnimate) {
    var _ = this,
        $target = $(event.currentTarget),
        indexOffset,
        slideOffset,
        unevenOffset; // If target is a link, prevent default action.


    if ($target.is('a')) {
      event.preventDefault();
    } // If target is not the <li> element (ie: a child), find the <li>.


    if (!$target.is('li')) {
      $target = $target.closest('li');
    }

    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

    switch (event.data.message) {
      case 'previous':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
        }

        break;

      case 'next':
        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;

        if (_.slideCount > _.options.slidesToShow) {
          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
        }

        break;

      case 'index':
        var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

        _.slideHandler(_.checkNavigable(index), false, dontAnimate);

        $target.children().trigger('focus');
        break;

      default:
        return;
    }
  };

  Slick.prototype.checkNavigable = function (index) {
    var _ = this,
        navigables,
        prevNavigable;

    navigables = _.getNavigableIndexes();
    prevNavigable = 0;

    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }

        prevNavigable = navigables[n];
      }
    }

    return index;
  };

  Slick.prototype.cleanUpEvents = function () {
    var _ = this;

    if (_.options.dots && _.$dots !== null) {
      $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));

      if (_.options.accessibility === true) {
        _.$dots.off('keydown.slick', _.keyHandler);
      }
    }

    _.$slider.off('focus.slick blur.slick');

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
      }
    }

    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);

    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);

    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);

    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

    _.$list.off('click.slick', _.clickHandler);

    $(document).off(_.visibilityChange, _.visibility);

    _.cleanUpSlideEvents();

    if (_.options.accessibility === true) {
      _.$list.off('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().off('click.slick', _.selectHandler);
    }

    $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
  };

  Slick.prototype.cleanUpSlideEvents = function () {
    var _ = this;

    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));

    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
  };

  Slick.prototype.cleanUpRows = function () {
    var _ = this,
        originalSlides;

    if (_.options.rows > 0) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr('style');

      _.$slider.empty().append(originalSlides);
    }
  };

  Slick.prototype.clickHandler = function (event) {
    var _ = this;

    if (_.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  Slick.prototype.destroy = function (refresh) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $('.slick-cloned', _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.$prevArrow.length) {
      _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {
      _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }
    }

    if (_.$slides) {
      _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
        $(this).attr('style', $(this).data('originalStyling'));
      });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass('slick-slider');

    _.$slider.removeClass('slick-initialized');

    _.$slider.removeClass('slick-dotted');

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger('destroy', [_]);
    }
  };

  Slick.prototype.disableTransition = function (slide) {
    var _ = this,
        transition = {};

    transition[_.transitionType] = '';

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  };

  Slick.prototype.fadeSlide = function (slideIndex, callback) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).css({
        zIndex: _.options.zIndex
      });

      _.$slides.eq(slideIndex).animate({
        opacity: 1
      }, _.options.speed, _.options.easing, callback);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: _.options.zIndex
      });

      if (callback) {
        setTimeout(function () {
          _.disableTransition(slideIndex);

          callback.call();
        }, _.options.speed);
      }
    }
  };

  Slick.prototype.fadeSlideOut = function (slideIndex) {
    var _ = this;

    if (_.cssTransitions === false) {
      _.$slides.eq(slideIndex).animate({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      }, _.options.speed, _.options.easing);
    } else {
      _.applyTransition(slideIndex);

      _.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: _.options.zIndex - 2
      });
    }
  };

  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
    var _ = this;

    if (filter !== null) {
      _.$slidesCache = _.$slides;

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.focusHandler = function () {
    var _ = this;

    _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*', function (event) {
      event.stopImmediatePropagation();
      var $sf = $(this);
      setTimeout(function () {
        if (_.options.pauseOnFocus) {
          _.focussed = $sf.is(':focus');

          _.autoPlay();
        }
      }, 0);
    });
  };

  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
    var _ = this;

    return _.currentSlide;
  };

  Slick.prototype.getDotCount = function () {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      if (_.slideCount <= _.options.slidesToShow) {
        ++pagerQty;
      } else {
        while (breakPoint < _.slideCount) {
          ++pagerQty;
          breakPoint = counter + _.options.slidesToScroll;
          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else if (!_.options.asNavFor) {
      pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  };

  Slick.prototype.getLeft = function (slideIndex) {
    var _ = this,
        targetLeft,
        verticalHeight,
        verticalOffset = 0,
        targetSlide,
        coef;

    _.slideOffset = 0;
    verticalHeight = _.$slides.first().outerHeight(true);

    if (_.options.infinite === true) {
      if (_.slideCount > _.options.slidesToShow) {
        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
        coef = -1;

        if (_.options.vertical === true && _.options.centerMode === true) {
          if (_.options.slidesToShow === 2) {
            coef = -1.5;
          } else if (_.options.slidesToShow === 1) {
            coef = -2;
          }
        }

        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
      }

      if (_.slideCount % _.options.slidesToScroll !== 0) {
        if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
          if (slideIndex > _.slideCount) {
            _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
            verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
          } else {
            _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
            verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
          }
        }
      }
    } else {
      if (slideIndex + _.options.slidesToShow > _.slideCount) {
        _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
      }
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideOffset = 0;
      verticalOffset = 0;
    }

    if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
      _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2;
    } else if (_.options.centerMode === true && _.options.infinite === true) {
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
    } else if (_.options.centerMode === true) {
      _.slideOffset = 0;
      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.vertical === false) {
      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (_.options.variableWidth === true) {
      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
      } else {
        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
      }

      if (_.options.rtl === true) {
        if (targetSlide[0]) {
          targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
      }

      if (_.options.centerMode === true) {
        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
        } else {
          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
        }

        if (_.options.rtl === true) {
          if (targetSlide[0]) {
            targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
          } else {
            targetLeft = 0;
          }
        } else {
          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        }

        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  };

  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
    var _ = this;

    return _.options[option];
  };

  Slick.prototype.getNavigableIndexes = function () {
    var _ = this,
        breakPoint = 0,
        counter = 0,
        indexes = [],
        max;

    if (_.options.infinite === false) {
      max = _.slideCount;
    } else {
      breakPoint = _.options.slidesToScroll * -1;
      counter = _.options.slidesToScroll * -1;
      max = _.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + _.options.slidesToScroll;
      counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
    }

    return indexes;
  };

  Slick.prototype.getSlick = function () {
    return this;
  };

  Slick.prototype.getSlideCount = function () {
    var _ = this,
        slidesTraversed,
        swipedSlide,
        centerOffset;

    centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

    if (_.options.swipeToSlide === true) {
      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
        if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
          swipedSlide = slide;
          return false;
        }
      });

      slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
      return slidesTraversed;
    } else {
      return _.options.slidesToScroll;
    }
  };

  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'index',
        index: parseInt(slide)
      }
    }, dontAnimate);
  };

  Slick.prototype.init = function (creation) {
    var _ = this;

    if (!$(_.$slider).hasClass('slick-initialized')) {
      $(_.$slider).addClass('slick-initialized');

      _.buildRows();

      _.buildOut();

      _.setProps();

      _.startLoad();

      _.loadSlider();

      _.initializeEvents();

      _.updateArrows();

      _.updateDots();

      _.checkResponsive(true);

      _.focusHandler();
    }

    if (creation) {
      _.$slider.trigger('init', [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }

    if (_.options.autoplay) {
      _.paused = false;

      _.autoPlay();
    }
  };

  Slick.prototype.initADA = function () {
    var _ = this,
        numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
        tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
      return val >= 0 && val < _.slideCount;
    });

    _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
      'aria-hidden': 'true',
      'tabindex': '-1'
    }).find('a, input, button, select').attr({
      'tabindex': '-1'
    });

    if (_.$dots !== null) {
      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
        var slideControlIndex = tabControlIndexes.indexOf(i);
        $(this).attr({
          'role': 'tabpanel',
          'id': 'slick-slide' + _.instanceUid + i,
          'tabindex': -1
        });

        if (slideControlIndex !== -1) {
          var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex;

          if ($('#' + ariaButtonControl).length) {
            $(this).attr({
              'aria-describedby': ariaButtonControl
            });
          }
        }
      });

      _.$dots.attr('role', 'tablist').find('li').each(function (i) {
        var mappedSlideIndex = tabControlIndexes[i];
        $(this).attr({
          'role': 'presentation'
        });
        $(this).find('button').first().attr({
          'role': 'tab',
          'id': 'slick-slide-control' + _.instanceUid + i,
          'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
          'aria-label': i + 1 + ' of ' + numDotGroups,
          'aria-selected': null,
          'tabindex': '-1'
        });
      }).eq(_.currentSlide).find('button').attr({
        'aria-selected': 'true',
        'tabindex': '0'
      }).end();
    }

    for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
      if (_.options.focusOnChange) {
        _.$slides.eq(i).attr({
          'tabindex': '0'
        });
      } else {
        _.$slides.eq(i).removeAttr('tabindex');
      }
    }

    _.activateADA();
  };

  Slick.prototype.initArrowEvents = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.off('click.slick').on('click.slick', {
        message: 'previous'
      }, _.changeSlide);

      _.$nextArrow.off('click.slick').on('click.slick', {
        message: 'next'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$prevArrow.on('keydown.slick', _.keyHandler);

        _.$nextArrow.on('keydown.slick', _.keyHandler);
      }
    }
  };

  Slick.prototype.initDotEvents = function () {
    var _ = this;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('click.slick', {
        message: 'index'
      }, _.changeSlide);

      if (_.options.accessibility === true) {
        _.$dots.on('keydown.slick', _.keyHandler);
      }
    }

    if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
      $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initSlideEvents = function () {
    var _ = this;

    if (_.options.pauseOnHover) {
      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));

      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
    }
  };

  Slick.prototype.initializeEvents = function () {
    var _ = this;

    _.initArrowEvents();

    _.initDotEvents();

    _.initSlideEvents();

    _.$list.on('touchstart.slick mousedown.slick', {
      action: 'start'
    }, _.swipeHandler);

    _.$list.on('touchmove.slick mousemove.slick', {
      action: 'move'
    }, _.swipeHandler);

    _.$list.on('touchend.slick mouseup.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('touchcancel.slick mouseleave.slick', {
      action: 'end'
    }, _.swipeHandler);

    _.$list.on('click.slick', _.clickHandler);

    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

    if (_.options.accessibility === true) {
      _.$list.on('keydown.slick', _.keyHandler);
    }

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
    $(_.setPosition);
  };

  Slick.prototype.initUI = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.show();

      _.$nextArrow.show();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.show();
    }
  };

  Slick.prototype.keyHandler = function (event) {
    var _ = this; //Dont slide if the cursor is inside the form fields and arrow keys are pressed


    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (event.keyCode === 37 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'next' : 'previous'
          }
        });
      } else if (event.keyCode === 39 && _.options.accessibility === true) {
        _.changeSlide({
          data: {
            message: _.options.rtl === true ? 'previous' : 'next'
          }
        });
      }
    }
  };

  Slick.prototype.lazyLoad = function () {
    var _ = this,
        loadRange,
        cloneRange,
        rangeStart,
        rangeEnd;

    function loadImages(imagesScope) {
      $('img[data-lazy]', imagesScope).each(function () {
        var image = $(this),
            imageSource = $(this).attr('data-lazy'),
            imageSrcSet = $(this).attr('data-srcset'),
            imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
            imageToLoad = document.createElement('img');

        imageToLoad.onload = function () {
          image.animate({
            opacity: 0
          }, 100, function () {
            if (imageSrcSet) {
              image.attr('srcset', imageSrcSet);

              if (imageSizes) {
                image.attr('sizes', imageSizes);
              }
            }

            image.attr('src', imageSource).animate({
              opacity: 1
            }, 200, function () {
              image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
            });

            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
          });
        };

        imageToLoad.onerror = function () {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
        };

        imageToLoad.src = imageSource;
      });
    }

    if (_.options.centerMode === true) {
      if (_.options.infinite === true) {
        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + _.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
      }
    } else {
      rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);

      if (_.options.fade === true) {
        if (rangeStart > 0) rangeStart--;
        if (rangeEnd <= _.slideCount) rangeEnd++;
      }
    }

    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

    if (_.options.lazyLoad === 'anticipated') {
      var prevSlide = rangeStart - 1,
          nextSlide = rangeEnd,
          $slides = _.$slider.find('.slick-slide');

      for (var i = 0; i < _.options.slidesToScroll; i++) {
        if (prevSlide < 0) prevSlide = _.slideCount - 1;
        loadRange = loadRange.add($slides.eq(prevSlide));
        loadRange = loadRange.add($slides.eq(nextSlide));
        prevSlide--;
        nextSlide++;
      }
    }

    loadImages(loadRange);

    if (_.slideCount <= _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-slide');
      loadImages(cloneRange);
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
      cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
      loadImages(cloneRange);
    } else if (_.currentSlide === 0) {
      cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
      loadImages(cloneRange);
    }
  };

  Slick.prototype.loadSlider = function () {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1
    });

    _.$slider.removeClass('slick-loading');

    _.initUI();

    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad();
    }
  };

  Slick.prototype.next = Slick.prototype.slickNext = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'next'
      }
    });
  };

  Slick.prototype.orientationChange = function () {
    var _ = this;

    _.checkResponsive();

    _.setPosition();
  };

  Slick.prototype.pause = Slick.prototype.slickPause = function () {
    var _ = this;

    _.autoPlayClear();

    _.paused = true;
  };

  Slick.prototype.play = Slick.prototype.slickPlay = function () {
    var _ = this;

    _.autoPlay();

    _.options.autoplay = true;
    _.paused = false;
    _.focussed = false;
    _.interrupted = false;
  };

  Slick.prototype.postSlide = function (index) {
    var _ = this;

    if (!_.unslicked) {
      _.$slider.trigger('afterChange', [_, index]);

      _.animating = false;

      if (_.slideCount > _.options.slidesToShow) {
        _.setPosition();
      }

      _.swipeLeft = null;

      if (_.options.autoplay) {
        _.autoPlay();
      }

      if (_.options.accessibility === true) {
        _.initADA();

        if (_.options.focusOnChange) {
          var $currentSlide = $(_.$slides.get(_.currentSlide));
          $currentSlide.attr('tabindex', 0).focus();
        }
      }
    }
  };

  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'previous'
      }
    });
  };

  Slick.prototype.preventDefault = function (event) {
    event.preventDefault();
  };

  Slick.prototype.progressiveLazyLoad = function (tryCount) {
    tryCount = tryCount || 1;

    var _ = this,
        $imgsToLoad = $('img[data-lazy]', _.$slider),
        image,
        imageSource,
        imageSrcSet,
        imageSizes,
        imageToLoad;

    if ($imgsToLoad.length) {
      image = $imgsToLoad.first();
      imageSource = image.attr('data-lazy');
      imageSrcSet = image.attr('data-srcset');
      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
      imageToLoad = document.createElement('img');

      imageToLoad.onload = function () {
        if (imageSrcSet) {
          image.attr('srcset', imageSrcSet);

          if (imageSizes) {
            image.attr('sizes', imageSizes);
          }
        }

        image.attr('src', imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');

        if (_.options.adaptiveHeight === true) {
          _.setPosition();
        }

        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);

        _.progressiveLazyLoad();
      };

      imageToLoad.onerror = function () {
        if (tryCount < 3) {
          /**
           * try to load the image 3 times,
           * leave a slight delay so we don't get
           * servers blocking the request.
           */
          setTimeout(function () {
            _.progressiveLazyLoad(tryCount + 1);
          }, 500);
        } else {
          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

          _.progressiveLazyLoad();
        }
      };

      imageToLoad.src = imageSource;
    } else {
      _.$slider.trigger('allImagesLoaded', [_]);
    }
  };

  Slick.prototype.refresh = function (initializing) {
    var _ = this,
        currentSlide,
        lastVisibleIndex;

    lastVisibleIndex = _.slideCount - _.options.slidesToShow; // in non-infinite sliders, we don't want to go past the
    // last visible index.

    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
      _.currentSlide = lastVisibleIndex;
    } // if less slides than to show, go to start.


    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    $.extend(_, _.initials, {
      currentSlide: currentSlide
    });

    _.init();

    if (!initializing) {
      _.changeSlide({
        data: {
          message: 'index',
          index: currentSlide
        }
      }, false);
    }
  };

  Slick.prototype.registerBreakpoints = function () {
    var _ = this,
        breakpoint,
        currentBreakpoint,
        l,
        responsiveSettings = _.options.responsive || null;

    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
      _.respondTo = _.options.respondTo || 'window';

      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          currentBreakpoint = responsiveSettings[breakpoint].breakpoint; // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don't want dupes.

          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }

            l--;
          }

          _.breakpoints.push(currentBreakpoint);

          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return _.options.mobileFirst ? a - b : b - a;
      });
    }
  };

  Slick.prototype.reinit = function () {
    var _ = this;

    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();

    _.setupInfinite();

    _.buildArrows();

    _.updateArrows();

    _.initArrowEvents();

    _.buildDots();

    _.updateDots();

    _.initDotEvents();

    _.cleanUpSlideEvents();

    _.initSlideEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    _.setPosition();

    _.focusHandler();

    _.paused = !_.options.autoplay;

    _.autoPlay();

    _.$slider.trigger('reInit', [_]);
  };

  Slick.prototype.resize = function () {
    var _ = this;

    if ($(window).width() !== _.windowWidth) {
      clearTimeout(_.windowDelay);
      _.windowDelay = window.setTimeout(function () {
        _.windowWidth = $(window).width();

        _.checkResponsive();

        if (!_.unslicked) {
          _.setPosition();
        }
      }, 50);
    }
  };

  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
    var _ = this;

    if (typeof index === 'boolean') {
      removeBefore = index;
      index = removeBefore === true ? 0 : _.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
      return false;
    }

    _.unload();

    if (removeAll === true) {
      _.$slideTrack.children().remove();
    } else {
      _.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    _.$slides = _.$slideTrack.children(this.options.slide);

    _.$slideTrack.children(this.options.slide).detach();

    _.$slideTrack.append(_.$slides);

    _.$slidesCache = _.$slides;

    _.reinit();
  };

  Slick.prototype.setCSS = function (position) {
    var _ = this,
        positionProps = {},
        x,
        y;

    if (_.options.rtl === true) {
      position = -position;
    }

    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};

      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';

        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';

        _.$slideTrack.css(positionProps);
      }
    }
  };

  Slick.prototype.setDimensions = function () {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: '0px ' + _.options.centerPadding
        });
      }
    } else {
      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);

      if (_.options.centerMode === true) {
        _.$list.css({
          padding: _.options.centerPadding + ' 0px'
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();

    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

      _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);

      _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();

    if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
  };

  Slick.prototype.setFade = function () {
    var _ = this,
        targetLeft;

    _.$slides.each(function (index, element) {
      targetLeft = _.slideWidth * index * -1;

      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1
    });
  };

  Slick.prototype.setHeight = function () {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);

      _.$list.css('height', targetHeight);
    }
  };

  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
    /**
     * accepts arguments in format of:
     *
     *  - for changing a single option's value:
     *     .slick("setOption", option, value, refresh )
     *
     *  - for changing a set of responsive options:
     *     .slick("setOption", 'responsive', [{}, ...], refresh )
     *
     *  - for updating multiple values at once (not responsive)
     *     .slick("setOption", { 'option': value, ... }, refresh )
     */
    var _ = this,
        l,
        item,
        option,
        value,
        refresh = false,
        type;

    if ($.type(arguments[0]) === 'object') {
      option = arguments[0];
      refresh = arguments[1];
      type = 'multiple';
    } else if ($.type(arguments[0]) === 'string') {
      option = arguments[0];
      value = arguments[1];
      refresh = arguments[2];

      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
        type = 'responsive';
      } else if (typeof arguments[1] !== 'undefined') {
        type = 'single';
      }
    }

    if (type === 'single') {
      _.options[option] = value;
    } else if (type === 'multiple') {
      $.each(option, function (opt, val) {
        _.options[opt] = val;
      });
    } else if (type === 'responsive') {
      for (item in value) {
        if ($.type(_.options.responsive) !== 'array') {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1; // loop through the responsive object and splice out duplicates.

          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }

            l--;
          }

          _.options.responsive.push(value[item]);
        }
      }
    }

    if (refresh) {
      _.unload();

      _.reinit();
    }
  };

  Slick.prototype.setPosition = function () {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger('setPosition', [_]);
  };

  Slick.prototype.setProps = function () {
    var _ = this,
        bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? 'top' : 'left';

    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical');
    } else {
      _.$slider.removeClass('slick-vertical');
    }

    if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform';
      _.transformType = '-o-transform';
      _.transitionType = 'OTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform';
      _.transformType = '-moz-transform';
      _.transitionType = 'MozTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform';
      _.transformType = '-webkit-transform';
      _.transitionType = 'webkitTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }

    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform';
      _.transformType = '-ms-transform';
      _.transitionType = 'msTransition';
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }

    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform';
      _.transformType = 'transform';
      _.transitionType = 'transition';
    }

    _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
  };

  Slick.prototype.setSlideClasses = function (index) {
    var _ = this,
        centerOffset,
        allSlides,
        indexOffset,
        remainder;

    allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

    _.$slides.eq(index).addClass('slick-current');

    if (_.options.centerMode === true) {
      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {
        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
          _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          indexOffset = _.options.slidesToShow + index;
          allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
        }

        if (index === 0) {
          allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
        } else if (index === _.slideCount - 1) {
          allSlides.eq(_.options.slidesToShow).addClass('slick-center');
        }
      }

      _.$slides.eq(index).addClass('slick-center');
    } else {
      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
        _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
      } else if (allSlides.length <= _.options.slidesToShow) {
        allSlides.addClass('slick-active').attr('aria-hidden', 'false');
      } else {
        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {
          allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
        } else {
          allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
        }
      }
    }

    if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
      _.lazyLoad();
    }
  };

  Slick.prototype.setupInfinite = function () {
    var _ = this,
        i,
        slideIndex,
        infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {
      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {
        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
        }

        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
        }

        _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
          $(this).attr('id', '');
        });
      }
    }
  };

  Slick.prototype.interrupt = function (toggle) {
    var _ = this;

    if (!toggle) {
      _.autoPlay();
    }

    _.interrupted = toggle;
  };

  Slick.prototype.selectHandler = function (event) {
    var _ = this;

    var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');
    var index = parseInt(targetElement.attr('data-slick-index'));
    if (!index) index = 0;

    if (_.slideCount <= _.options.slidesToShow) {
      _.slideHandler(index, false, true);

      return;
    }

    _.slideHandler(index);
  };

  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
    var targetSlide,
        animSlide,
        oldSlide,
        slideLeft,
        targetLeft = null,
        _ = this,
        navTarget;

    sync = sync || false;

    if (_.animating === true && _.options.waitForAnimate === true) {
      return;
    }

    if (_.options.fade === true && _.currentSlide === index) {
      return;
    }

    if (sync === false) {
      _.asNavFor(index);
    }

    targetSlide = index;
    targetLeft = _.getLeft(targetSlide);
    slideLeft = _.getLeft(_.currentSlide);
    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

    if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
      if (_.options.fade === false) {
        targetSlide = _.currentSlide;

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
          _.animateSlide(slideLeft, function () {
            _.postSlide(targetSlide);
          });
        } else {
          _.postSlide(targetSlide);
        }
      }

      return;
    }

    if (_.options.autoplay) {
      clearInterval(_.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
      } else {
        animSlide = _.slideCount + targetSlide;
      }
    } else if (targetSlide >= _.slideCount) {
      if (_.slideCount % _.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - _.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    _.animating = true;

    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

    oldSlide = _.currentSlide;
    _.currentSlide = animSlide;

    _.setSlideClasses(_.currentSlide);

    if (_.options.asNavFor) {
      navTarget = _.getNavTarget();
      navTarget = navTarget.slick('getSlick');

      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
        navTarget.setSlideClasses(_.currentSlide);
      }
    }

    _.updateDots();

    _.updateArrows();

    if (_.options.fade === true) {
      if (dontAnimate !== true) {
        _.fadeSlideOut(oldSlide);

        _.fadeSlide(animSlide, function () {
          _.postSlide(animSlide);
        });
      } else {
        _.postSlide(animSlide);
      }

      _.animateHeight();

      return;
    }

    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
      _.animateSlide(targetLeft, function () {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
  };

  Slick.prototype.startLoad = function () {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
      _.$prevArrow.hide();

      _.$nextArrow.hide();
    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
      _.$dots.hide();
    }

    _.$slider.addClass('slick-loading');
  };

  Slick.prototype.swipeDirection = function () {
    var xDist,
        yDist,
        r,
        swipeAngle,
        _ = this;

    xDist = _.touchObject.startX - _.touchObject.curX;
    yDist = _.touchObject.startY - _.touchObject.curY;
    r = Math.atan2(yDist, xDist);
    swipeAngle = Math.round(r * 180 / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return _.options.rtl === false ? 'left' : 'right';
    }

    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return _.options.rtl === false ? 'right' : 'left';
    }

    if (_.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  };

  Slick.prototype.swipeEnd = function (event) {
    var _ = this,
        slideCount,
        direction;

    _.dragging = false;
    _.swiping = false;

    if (_.scrolling) {
      _.scrolling = false;
      return false;
    }

    _.interrupted = false;
    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

    if (_.touchObject.curX === undefined) {
      return false;
    }

    if (_.touchObject.edgeHit === true) {
      _.$slider.trigger('edge', [_, _.swipeDirection()]);
    }

    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
      direction = _.swipeDirection();

      switch (direction) {
        case 'left':
        case 'down':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
          _.currentDirection = 0;
          break;

        case 'right':
        case 'up':
          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
          _.currentDirection = 1;
          break;

        default:
      }

      if (direction != 'vertical') {
        _.slideHandler(slideCount);

        _.touchObject = {};

        _.$slider.trigger('swipe', [_, direction]);
      }
    } else {
      if (_.touchObject.startX !== _.touchObject.curX) {
        _.slideHandler(_.currentSlide);

        _.touchObject = {};
      }
    }
  };

  Slick.prototype.swipeHandler = function (event) {
    var _ = this;

    if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
      return;
    } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
      return;
    }

    _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

    if (_.options.verticalSwiping === true) {
      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
    }

    switch (event.data.action) {
      case 'start':
        _.swipeStart(event);

        break;

      case 'move':
        _.swipeMove(event);

        break;

      case 'end':
        _.swipeEnd(event);

        break;
    }
  };

  Slick.prototype.swipeMove = function (event) {
    var _ = this,
        edgeWasHit = false,
        curLeft,
        swipeDirection,
        swipeLength,
        positionOffset,
        touches,
        verticalSwipeLength;

    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

    if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
      return false;
    }

    curLeft = _.getLeft(_.currentSlide);
    _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
    _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
    _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
    verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
      _.scrolling = true;
      return false;
    }

    if (_.options.verticalSwiping === true) {
      _.touchObject.swipeLength = verticalSwipeLength;
    }

    swipeDirection = _.swipeDirection();

    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
      _.swiping = true;
      event.preventDefault();
    }

    positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

    if (_.options.verticalSwiping === true) {
      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
    }

    swipeLength = _.touchObject.swipeLength;
    _.touchObject.edgeHit = false;

    if (_.options.infinite === false) {
      if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
        _.touchObject.edgeHit = true;
      }
    }

    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
    }

    if (_.options.verticalSwiping === true) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (_.options.fade === true || _.options.touchMove === false) {
      return false;
    }

    if (_.animating === true) {
      _.swipeLeft = null;
      return false;
    }

    _.setCSS(_.swipeLeft);
  };

  Slick.prototype.swipeStart = function (event) {
    var _ = this,
        touches;

    _.interrupted = true;

    if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
      _.touchObject = {};
      return false;
    }

    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
      touches = event.originalEvent.touches[0];
    }

    _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
    _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
    _.dragging = true;
  };

  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
    var _ = this;

    if (_.$slidesCache !== null) {
      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();
    }
  };

  Slick.prototype.unload = function () {
    var _ = this;

    $('.slick-cloned', _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
  };

  Slick.prototype.unslick = function (fromBreakpoint) {
    var _ = this;

    _.$slider.trigger('unslick', [_, fromBreakpoint]);

    _.destroy();
  };

  Slick.prototype.updateArrows = function () {
    var _ = this,
        centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      if (_.currentSlide === 0) {
        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');

        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      }
    }
  };

  Slick.prototype.updateDots = function () {
    var _ = this;

    if (_.$dots !== null) {
      _.$dots.find('li').removeClass('slick-active').end();

      _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
    }
  };

  Slick.prototype.visibility = function () {
    var _ = this;

    if (_.options.autoplay) {
      if (document[_.hidden]) {
        _.interrupted = true;
      } else {
        _.interrupted = false;
      }
    }
  };

  $.fn.slick = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (_typeof(opt) == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
      if (typeof ret != 'undefined') return ret;
    }

    return _;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWNrLmpzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwicmVxdWlyZSIsImpRdWVyeSIsIiQiLCJTbGljayIsIndpbmRvdyIsImluc3RhbmNlVWlkIiwiZWxlbWVudCIsInNldHRpbmdzIiwiXyIsImRhdGFTZXR0aW5ncyIsImRlZmF1bHRzIiwiYWNjZXNzaWJpbGl0eSIsImFkYXB0aXZlSGVpZ2h0IiwiYXBwZW5kQXJyb3dzIiwiYXBwZW5kRG90cyIsImFycm93cyIsImFzTmF2Rm9yIiwicHJldkFycm93IiwibmV4dEFycm93IiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiY2VudGVyTW9kZSIsImNlbnRlclBhZGRpbmciLCJjc3NFYXNlIiwiY3VzdG9tUGFnaW5nIiwic2xpZGVyIiwiaSIsInRleHQiLCJkb3RzIiwiZG90c0NsYXNzIiwiZHJhZ2dhYmxlIiwiZWFzaW5nIiwiZWRnZUZyaWN0aW9uIiwiZmFkZSIsImZvY3VzT25TZWxlY3QiLCJmb2N1c09uQ2hhbmdlIiwiaW5maW5pdGUiLCJpbml0aWFsU2xpZGUiLCJsYXp5TG9hZCIsIm1vYmlsZUZpcnN0IiwicGF1c2VPbkhvdmVyIiwicGF1c2VPbkZvY3VzIiwicGF1c2VPbkRvdHNIb3ZlciIsInJlc3BvbmRUbyIsInJlc3BvbnNpdmUiLCJyb3dzIiwicnRsIiwic2xpZGUiLCJzbGlkZXNQZXJSb3ciLCJzbGlkZXNUb1Nob3ciLCJzbGlkZXNUb1Njcm9sbCIsInNwZWVkIiwic3dpcGUiLCJzd2lwZVRvU2xpZGUiLCJ0b3VjaE1vdmUiLCJ0b3VjaFRocmVzaG9sZCIsInVzZUNTUyIsInVzZVRyYW5zZm9ybSIsInZhcmlhYmxlV2lkdGgiLCJ2ZXJ0aWNhbCIsInZlcnRpY2FsU3dpcGluZyIsIndhaXRGb3JBbmltYXRlIiwiekluZGV4IiwiaW5pdGlhbHMiLCJhbmltYXRpbmciLCJkcmFnZ2luZyIsImF1dG9QbGF5VGltZXIiLCJjdXJyZW50RGlyZWN0aW9uIiwiY3VycmVudExlZnQiLCJjdXJyZW50U2xpZGUiLCJkaXJlY3Rpb24iLCIkZG90cyIsImxpc3RXaWR0aCIsImxpc3RIZWlnaHQiLCJsb2FkSW5kZXgiLCIkbmV4dEFycm93IiwiJHByZXZBcnJvdyIsInNjcm9sbGluZyIsInNsaWRlQ291bnQiLCJzbGlkZVdpZHRoIiwiJHNsaWRlVHJhY2siLCIkc2xpZGVzIiwic2xpZGluZyIsInNsaWRlT2Zmc2V0Iiwic3dpcGVMZWZ0Iiwic3dpcGluZyIsIiRsaXN0IiwidG91Y2hPYmplY3QiLCJ0cmFuc2Zvcm1zRW5hYmxlZCIsInVuc2xpY2tlZCIsImV4dGVuZCIsImFjdGl2ZUJyZWFrcG9pbnQiLCJhbmltVHlwZSIsImFuaW1Qcm9wIiwiYnJlYWtwb2ludHMiLCJicmVha3BvaW50U2V0dGluZ3MiLCJjc3NUcmFuc2l0aW9ucyIsImZvY3Vzc2VkIiwiaW50ZXJydXB0ZWQiLCJoaWRkZW4iLCJwYXVzZWQiLCJwb3NpdGlvblByb3AiLCJyb3dDb3VudCIsInNob3VsZENsaWNrIiwiJHNsaWRlciIsIiRzbGlkZXNDYWNoZSIsInRyYW5zZm9ybVR5cGUiLCJ0cmFuc2l0aW9uVHlwZSIsInZpc2liaWxpdHlDaGFuZ2UiLCJ3aW5kb3dXaWR0aCIsIndpbmRvd1RpbWVyIiwiZGF0YSIsIm9wdGlvbnMiLCJvcmlnaW5hbFNldHRpbmdzIiwiZG9jdW1lbnQiLCJtb3pIaWRkZW4iLCJ3ZWJraXRIaWRkZW4iLCJhdXRvUGxheSIsInByb3h5IiwiYXV0b1BsYXlDbGVhciIsImF1dG9QbGF5SXRlcmF0b3IiLCJjaGFuZ2VTbGlkZSIsImNsaWNrSGFuZGxlciIsInNlbGVjdEhhbmRsZXIiLCJzZXRQb3NpdGlvbiIsInN3aXBlSGFuZGxlciIsImRyYWdIYW5kbGVyIiwia2V5SGFuZGxlciIsImh0bWxFeHByIiwicmVnaXN0ZXJCcmVha3BvaW50cyIsImluaXQiLCJwcm90b3R5cGUiLCJhY3RpdmF0ZUFEQSIsImZpbmQiLCJhdHRyIiwiYWRkU2xpZGUiLCJzbGlja0FkZCIsIm1hcmt1cCIsImluZGV4IiwiYWRkQmVmb3JlIiwidW5sb2FkIiwibGVuZ3RoIiwiYXBwZW5kVG8iLCJpbnNlcnRCZWZvcmUiLCJlcSIsImluc2VydEFmdGVyIiwicHJlcGVuZFRvIiwiY2hpbGRyZW4iLCJkZXRhY2giLCJhcHBlbmQiLCJlYWNoIiwicmVpbml0IiwiYW5pbWF0ZUhlaWdodCIsInRhcmdldEhlaWdodCIsIm91dGVySGVpZ2h0IiwiYW5pbWF0ZSIsImhlaWdodCIsImFuaW1hdGVTbGlkZSIsInRhcmdldExlZnQiLCJjYWxsYmFjayIsImFuaW1Qcm9wcyIsImxlZnQiLCJ0b3AiLCJhbmltU3RhcnQiLCJkdXJhdGlvbiIsInN0ZXAiLCJub3ciLCJNYXRoIiwiY2VpbCIsImNzcyIsImNvbXBsZXRlIiwiY2FsbCIsImFwcGx5VHJhbnNpdGlvbiIsInNldFRpbWVvdXQiLCJkaXNhYmxlVHJhbnNpdGlvbiIsImdldE5hdlRhcmdldCIsIm5vdCIsInRhcmdldCIsInNsaWNrIiwic2xpZGVIYW5kbGVyIiwidHJhbnNpdGlvbiIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsInNsaWRlVG8iLCJidWlsZEFycm93cyIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmVBdHRyIiwidGVzdCIsImFkZCIsImJ1aWxkRG90cyIsImRvdCIsImdldERvdENvdW50IiwiZmlyc3QiLCJidWlsZE91dCIsIndyYXBBbGwiLCJwYXJlbnQiLCJ3cmFwIiwic2V0dXBJbmZpbml0ZSIsInVwZGF0ZURvdHMiLCJzZXRTbGlkZUNsYXNzZXMiLCJidWlsZFJvd3MiLCJhIiwiYiIsImMiLCJuZXdTbGlkZXMiLCJudW1PZlNsaWRlcyIsIm9yaWdpbmFsU2xpZGVzIiwic2xpZGVzUGVyU2VjdGlvbiIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJjcmVhdGVFbGVtZW50Iiwicm93IiwiZ2V0IiwiYXBwZW5kQ2hpbGQiLCJlbXB0eSIsImNoZWNrUmVzcG9uc2l2ZSIsImluaXRpYWwiLCJmb3JjZVVwZGF0ZSIsImJyZWFrcG9pbnQiLCJ0YXJnZXRCcmVha3BvaW50IiwicmVzcG9uZFRvV2lkdGgiLCJ0cmlnZ2VyQnJlYWtwb2ludCIsInNsaWRlcldpZHRoIiwid2lkdGgiLCJpbm5lcldpZHRoIiwibWluIiwiaGFzT3duUHJvcGVydHkiLCJ1bnNsaWNrIiwicmVmcmVzaCIsInRyaWdnZXIiLCJldmVudCIsImRvbnRBbmltYXRlIiwiJHRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJpbmRleE9mZnNldCIsInVuZXZlbk9mZnNldCIsImlzIiwicHJldmVudERlZmF1bHQiLCJjbG9zZXN0IiwibWVzc2FnZSIsImNoZWNrTmF2aWdhYmxlIiwibmF2aWdhYmxlcyIsInByZXZOYXZpZ2FibGUiLCJnZXROYXZpZ2FibGVJbmRleGVzIiwibiIsImNsZWFuVXBFdmVudHMiLCJvZmYiLCJpbnRlcnJ1cHQiLCJ2aXNpYmlsaXR5IiwiY2xlYW5VcFNsaWRlRXZlbnRzIiwib3JpZW50YXRpb25DaGFuZ2UiLCJyZXNpemUiLCJjbGVhblVwUm93cyIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsImRlc3Ryb3kiLCJyZW1vdmUiLCJmYWRlU2xpZGUiLCJzbGlkZUluZGV4Iiwib3BhY2l0eSIsImZhZGVTbGlkZU91dCIsImZpbHRlclNsaWRlcyIsInNsaWNrRmlsdGVyIiwiZmlsdGVyIiwiZm9jdXNIYW5kbGVyIiwib24iLCIkc2YiLCJnZXRDdXJyZW50Iiwic2xpY2tDdXJyZW50U2xpZGUiLCJicmVha1BvaW50IiwiY291bnRlciIsInBhZ2VyUXR5IiwiZ2V0TGVmdCIsInZlcnRpY2FsSGVpZ2h0IiwidmVydGljYWxPZmZzZXQiLCJ0YXJnZXRTbGlkZSIsImNvZWYiLCJmbG9vciIsIm9mZnNldExlZnQiLCJvdXRlcldpZHRoIiwiZ2V0T3B0aW9uIiwic2xpY2tHZXRPcHRpb24iLCJvcHRpb24iLCJpbmRleGVzIiwibWF4IiwicHVzaCIsImdldFNsaWNrIiwiZ2V0U2xpZGVDb3VudCIsInNsaWRlc1RyYXZlcnNlZCIsInN3aXBlZFNsaWRlIiwiY2VudGVyT2Zmc2V0IiwiYWJzIiwiZ29UbyIsInNsaWNrR29UbyIsInBhcnNlSW50IiwiY3JlYXRpb24iLCJoYXNDbGFzcyIsInNldFByb3BzIiwic3RhcnRMb2FkIiwibG9hZFNsaWRlciIsImluaXRpYWxpemVFdmVudHMiLCJ1cGRhdGVBcnJvd3MiLCJpbml0QURBIiwibnVtRG90R3JvdXBzIiwidGFiQ29udHJvbEluZGV4ZXMiLCJ2YWwiLCJzbGlkZUNvbnRyb2xJbmRleCIsImluZGV4T2YiLCJhcmlhQnV0dG9uQ29udHJvbCIsIm1hcHBlZFNsaWRlSW5kZXgiLCJlbmQiLCJpbml0QXJyb3dFdmVudHMiLCJpbml0RG90RXZlbnRzIiwiaW5pdFNsaWRlRXZlbnRzIiwiYWN0aW9uIiwiaW5pdFVJIiwic2hvdyIsInRhZ05hbWUiLCJtYXRjaCIsImtleUNvZGUiLCJsb2FkUmFuZ2UiLCJjbG9uZVJhbmdlIiwicmFuZ2VTdGFydCIsInJhbmdlRW5kIiwibG9hZEltYWdlcyIsImltYWdlc1Njb3BlIiwiaW1hZ2UiLCJpbWFnZVNvdXJjZSIsImltYWdlU3JjU2V0IiwiaW1hZ2VTaXplcyIsImltYWdlVG9Mb2FkIiwib25sb2FkIiwib25lcnJvciIsInNyYyIsInNsaWNlIiwicHJldlNsaWRlIiwibmV4dFNsaWRlIiwicHJvZ3Jlc3NpdmVMYXp5TG9hZCIsIm5leHQiLCJzbGlja05leHQiLCJwYXVzZSIsInNsaWNrUGF1c2UiLCJwbGF5Iiwic2xpY2tQbGF5IiwicG9zdFNsaWRlIiwiJGN1cnJlbnRTbGlkZSIsImZvY3VzIiwicHJldiIsInNsaWNrUHJldiIsInRyeUNvdW50IiwiJGltZ3NUb0xvYWQiLCJpbml0aWFsaXppbmciLCJsYXN0VmlzaWJsZUluZGV4IiwiY3VycmVudEJyZWFrcG9pbnQiLCJsIiwicmVzcG9uc2l2ZVNldHRpbmdzIiwidHlwZSIsInNwbGljZSIsInNvcnQiLCJjbGVhclRpbWVvdXQiLCJ3aW5kb3dEZWxheSIsInJlbW92ZVNsaWRlIiwic2xpY2tSZW1vdmUiLCJyZW1vdmVCZWZvcmUiLCJyZW1vdmVBbGwiLCJzZXRDU1MiLCJwb3NpdGlvbiIsInBvc2l0aW9uUHJvcHMiLCJ4IiwieSIsInNldERpbWVuc2lvbnMiLCJwYWRkaW5nIiwib2Zmc2V0Iiwic2V0RmFkZSIsInJpZ2h0Iiwic2V0SGVpZ2h0Iiwic2V0T3B0aW9uIiwic2xpY2tTZXRPcHRpb24iLCJpdGVtIiwidmFsdWUiLCJhcmd1bWVudHMiLCJvcHQiLCJib2R5U3R5bGUiLCJib2R5Iiwic3R5bGUiLCJXZWJraXRUcmFuc2l0aW9uIiwidW5kZWZpbmVkIiwiTW96VHJhbnNpdGlvbiIsIm1zVHJhbnNpdGlvbiIsIk9UcmFuc2Zvcm0iLCJwZXJzcGVjdGl2ZVByb3BlcnR5Iiwid2Via2l0UGVyc3BlY3RpdmUiLCJNb3pUcmFuc2Zvcm0iLCJNb3pQZXJzcGVjdGl2ZSIsIndlYmtpdFRyYW5zZm9ybSIsIm1zVHJhbnNmb3JtIiwidHJhbnNmb3JtIiwiYWxsU2xpZGVzIiwicmVtYWluZGVyIiwiZXZlbkNvZWYiLCJpbmZpbml0ZUNvdW50IiwiY2xvbmUiLCJ0b2dnbGUiLCJ0YXJnZXRFbGVtZW50IiwicGFyZW50cyIsInN5bmMiLCJhbmltU2xpZGUiLCJvbGRTbGlkZSIsInNsaWRlTGVmdCIsIm5hdlRhcmdldCIsImhpZGUiLCJzd2lwZURpcmVjdGlvbiIsInhEaXN0IiwieURpc3QiLCJyIiwic3dpcGVBbmdsZSIsInN0YXJ0WCIsImN1clgiLCJzdGFydFkiLCJjdXJZIiwiYXRhbjIiLCJyb3VuZCIsIlBJIiwic3dpcGVFbmQiLCJzd2lwZUxlbmd0aCIsImVkZ2VIaXQiLCJtaW5Td2lwZSIsImZpbmdlckNvdW50Iiwib3JpZ2luYWxFdmVudCIsInRvdWNoZXMiLCJzd2lwZVN0YXJ0Iiwic3dpcGVNb3ZlIiwiZWRnZVdhc0hpdCIsImN1ckxlZnQiLCJwb3NpdGlvbk9mZnNldCIsInZlcnRpY2FsU3dpcGVMZW5ndGgiLCJwYWdlWCIsImNsaWVudFgiLCJwYWdlWSIsImNsaWVudFkiLCJzcXJ0IiwicG93IiwidW5maWx0ZXJTbGlkZXMiLCJzbGlja1VuZmlsdGVyIiwiZnJvbUJyZWFrcG9pbnQiLCJmbiIsImFyZ3MiLCJBcnJheSIsInJldCIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBO0FBQ0E7O0FBQUUsV0FBU0EsT0FBVCxFQUFrQjtBQUNoQjs7QUFDQSxNQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE1BQU0sQ0FBQ0MsR0FBM0MsRUFBZ0Q7QUFDNUNELElBQUFBLE1BQU0sQ0FBQyxDQUFDLFFBQUQsQ0FBRCxFQUFhRCxPQUFiLENBQU47QUFDSCxHQUZELE1BRU8sSUFBSSxPQUFPRyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ3ZDQyxJQUFBQSxNQUFNLENBQUNELE9BQVAsR0FBaUJILE9BQU8sQ0FBQ0ssT0FBTyxDQUFDLFFBQUQsQ0FBUixDQUF4QjtBQUNILEdBRk0sTUFFQTtBQUNITCxJQUFBQSxPQUFPLENBQUNNLE1BQUQsQ0FBUDtBQUNIO0FBRUosQ0FWQyxFQVVBLFVBQVNDLENBQVQsRUFBWTtBQUNWOztBQUNBLE1BQUlDLEtBQUssR0FBR0MsTUFBTSxDQUFDRCxLQUFQLElBQWdCLEVBQTVCOztBQUVBQSxFQUFBQSxLQUFLLEdBQUksWUFBVztBQUVoQixRQUFJRSxXQUFXLEdBQUcsQ0FBbEI7O0FBRUEsYUFBU0YsS0FBVCxDQUFlRyxPQUFmLEVBQXdCQyxRQUF4QixFQUFrQztBQUU5QixVQUFJQyxDQUFDLEdBQUcsSUFBUjtBQUFBLFVBQWNDLFlBQWQ7O0FBRUFELE1BQUFBLENBQUMsQ0FBQ0UsUUFBRixHQUFhO0FBQ1RDLFFBQUFBLGFBQWEsRUFBRSxJQUROO0FBRVRDLFFBQUFBLGNBQWMsRUFBRSxLQUZQO0FBR1RDLFFBQUFBLFlBQVksRUFBRVgsQ0FBQyxDQUFDSSxPQUFELENBSE47QUFJVFEsUUFBQUEsVUFBVSxFQUFFWixDQUFDLENBQUNJLE9BQUQsQ0FKSjtBQUtUUyxRQUFBQSxNQUFNLEVB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WCxFQUFnQm1XLEdBQWhCLENBQWIsQ0FESixLQUdJbUUsR0FBRyxHQUFHeGIsQ0FBQyxDQUFDa0IsQ0FBRCxDQUFELENBQUt3SixLQUFMLENBQVcyTSxHQUFYLEVBQWdCb0UsS0FBaEIsQ0FBc0J6YixDQUFDLENBQUNrQixDQUFELENBQUQsQ0FBS3dKLEtBQTNCLEVBQWtDNFEsSUFBbEMsQ0FBTjtBQUNKLFVBQUksT0FBT0UsR0FBUCxJQUFjLFdBQWxCLEVBQStCLE9BQU9BLEdBQVA7QUFDbEM7O0FBQ0QsV0FBT3hiLENBQVA7QUFDSCxHQWZEO0FBaUJILENBajdGQyxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAgICAgXyBfICAgICAgXyAgICAgICBfXG4gX19ffCAoXykgX19ffCB8IF9fICAoXylfX19cbi8gX198IHwgfC8gX198IHwvIC8gIHwgLyBfX3xcblxcX18gXFwgfCB8IChfX3wgICA8IF8gfCBcXF9fIFxcXG58X19fL198X3xcXF9fX3xffFxcXyhfKS8gfF9fXy9cbiAgICAgICAgICAgICAgICAgICB8X18vXG5cbiBWZXJzaW9uOiAxLjguMFxuICBBdXRob3I6IEtlbiBXaGVlbGVyXG4gV2Vic2l0ZTogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvXG4gICAgRG9jczogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrXG4gICAgUmVwbzogaHR0cDovL2dpdGh1Yi5jb20va2Vud2hlZWxlci9zbGlja1xuICBJc3N1ZXM6IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2svaXNzdWVzXG5cbiAqL1xuLyogZ2xvYmFsIHdpbmRvdywgZG9jdW1lbnQsIGRlZmluZSwgalF1ZXJ5LCBzZXRJbnRlcnZhbCwgY2xlYXJJbnRlcnZhbCAqL1xuOyhmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeShqUXVlcnkpO1xuICAgIH1cblxufShmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBTbGljayA9IHdpbmRvdy5TbGljayB8fCB7fTtcblxuICAgIFNsaWNrID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpbnN0YW5jZVVpZCA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gU2xpY2soZWxlbWVudCwgc2V0dGluZ3MpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLCBkYXRhU2V0dGluZ3M7XG5cbiAgICAgICAgICAgIF8uZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzaWJpbGl0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXBwZW5kQXJyb3dzOiAkKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGFwcGVuZERvdHM6ICQoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yOiBudWxsLFxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gY2xhc3M9XCJzbGljay1wcmV2XCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdHlwZT1cImJ1dHRvblwiPlByZXZpb3VzPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwic2xpY2stbmV4dFwiIGFyaWEtbGFiZWw9XCJOZXh0XCIgdHlwZT1cImJ1dHRvblwiPk5leHQ8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAzMDAwLFxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICc1MHB4JyxcbiAgICAgICAgICAgICAgICBjc3NFYXNlOiAnZWFzZScsXG4gICAgICAgICAgICAgICAgY3VzdG9tUGFnaW5nOiBmdW5jdGlvbihzbGlkZXIsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIC8+JykudGV4dChpICsgMSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzQ2xhc3M6ICdzbGljay1kb3RzJyxcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgICBlZGdlRnJpY3Rpb246IDAuMzUsXG4gICAgICAgICAgICAgICAgZmFkZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZm9jdXNPbkNoYW5nZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFNsaWRlOiAwLFxuICAgICAgICAgICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwYXVzZU9uSG92ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgcGF1c2VPbkZvY3VzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhdXNlT25Eb3RzSG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlc3BvbmRUbzogJ3dpbmRvdycsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogbnVsbCxcbiAgICAgICAgICAgICAgICByb3dzOiAxLFxuICAgICAgICAgICAgICAgIHJ0bDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGU6ICcnLFxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclJvdzogMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDUwMCxcbiAgICAgICAgICAgICAgICBzd2lwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzd2lwZVRvU2xpZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRvdWNoTW92ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0b3VjaFRocmVzaG9sZDogNSxcbiAgICAgICAgICAgICAgICB1c2VDU1M6IHRydWUsXG4gICAgICAgICAgICAgICAgdXNlVHJhbnNmb3JtOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgXy5pbml0aWFscyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheVRpbWVyOiBudWxsLFxuICAgICAgICAgICAgICAgIGN1cnJlbnREaXJlY3Rpb246IDAsXG4gICAgICAgICAgICAgICAgY3VycmVudExlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlOiAwLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogMSxcbiAgICAgICAgICAgICAgICAkZG90czogbnVsbCxcbiAgICAgICAgICAgICAgICBsaXN0V2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgbGlzdEhlaWdodDogbnVsbCxcbiAgICAgICAgICAgICAgICBsb2FkSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgJG5leHRBcnJvdzogbnVsbCxcbiAgICAgICAgICAgICAgICAkcHJldkFycm93OiBudWxsLFxuICAgICAgICAgICAgICAgIHNjcm9sbGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVDb3VudDogbnVsbCxcbiAgICAgICAgICAgICAgICBzbGlkZVdpZHRoOiBudWxsLFxuICAgICAgICAgICAgICAgICRzbGlkZVRyYWNrOiBudWxsLFxuICAgICAgICAgICAgICAgICRzbGlkZXM6IG51bGwsXG4gICAgICAgICAgICAgICAgc2xpZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQ6IDAsXG4gICAgICAgICAgICAgICAgc3dpcGVMZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgIHN3aXBpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICRsaXN0OiBudWxsLFxuICAgICAgICAgICAgICAgIHRvdWNoT2JqZWN0OiB7fSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdW5zbGlja2VkOiBmYWxzZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJC5leHRlbmQoXywgXy5pbml0aWFscyk7XG5cbiAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gbnVsbDtcbiAgICAgICAgICAgIF8uYW5pbVByb3AgPSBudWxsO1xuICAgICAgICAgICAgXy5icmVha3BvaW50cyA9IFtdO1xuICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3MgPSBbXTtcbiAgICAgICAgICAgIF8uY3NzVHJhbnNpdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uZm9jdXNzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uaGlkZGVuID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBfLnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICBfLnBvc2l0aW9uUHJvcCA9IG51bGw7XG4gICAgICAgICAgICBfLnJlc3BvbmRUbyA9IG51bGw7XG4gICAgICAgICAgICBfLnJvd0NvdW50ID0gMTtcbiAgICAgICAgICAgIF8uc2hvdWxkQ2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgXy4kc2xpZGVyID0gJChlbGVtZW50KTtcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gbnVsbDtcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9IG51bGw7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gbnVsbDtcbiAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIF8ud2luZG93V2lkdGggPSAwO1xuICAgICAgICAgICAgXy53aW5kb3dUaW1lciA9IG51bGw7XG5cbiAgICAgICAgICAgIGRhdGFTZXR0aW5ncyA9ICQoZWxlbWVudCkuZGF0YSgnc2xpY2snKSB8fCB7fTtcblxuICAgICAgICAgICAgXy5vcHRpb25zID0gJC5leHRlbmQoe30sIF8uZGVmYXVsdHMsIHNldHRpbmdzLCBkYXRhU2V0dGluZ3MpO1xuXG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XG5cbiAgICAgICAgICAgIF8ub3JpZ2luYWxTZXR0aW5ncyA9IF8ub3B0aW9ucztcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgXy5oaWRkZW4gPSAnbW96SGlkZGVuJztcbiAgICAgICAgICAgICAgICBfLnZpc2liaWxpdHlDaGFuZ2UgPSAnbW96dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgXy5oaWRkZW4gPSAnd2Via2l0SGlkZGVuJztcbiAgICAgICAgICAgICAgICBfLnZpc2liaWxpdHlDaGFuZ2UgPSAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uYXV0b1BsYXkgPSAkLnByb3h5KF8uYXV0b1BsYXksIF8pO1xuICAgICAgICAgICAgXy5hdXRvUGxheUNsZWFyID0gJC5wcm94eShfLmF1dG9QbGF5Q2xlYXIsIF8pO1xuICAgICAgICAgICAgXy5hdXRvUGxheUl0ZXJhdG9yID0gJC5wcm94eShfLmF1dG9QbGF5SXRlcmF0b3IsIF8pO1xuICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSA9ICQucHJveHkoXy5jaGFuZ2VTbGlkZSwgXyk7XG4gICAgICAgICAgICBfLmNsaWNrSGFuZGxlciA9ICQucHJveHkoXy5jbGlja0hhbmRsZXIsIF8pO1xuICAgICAgICAgICAgXy5zZWxlY3RIYW5kbGVyID0gJC5wcm94eShfLnNlbGVjdEhhbmRsZXIsIF8pO1xuICAgICAgICAgICAgXy5zZXRQb3NpdGlvbiA9ICQucHJveHkoXy5zZXRQb3NpdGlvbiwgXyk7XG4gICAgICAgICAgICBfLnN3aXBlSGFuZGxlciA9ICQucHJveHkoXy5zd2lwZUhhbmRsZXIsIF8pO1xuICAgICAgICAgICAgXy5kcmFnSGFuZGxlciA9ICQucHJveHkoXy5kcmFnSGFuZGxlciwgXyk7XG4gICAgICAgICAgICBfLmtleUhhbmRsZXIgPSAkLnByb3h5KF8ua2V5SGFuZGxlciwgXyk7XG5cbiAgICAgICAgICAgIF8uaW5zdGFuY2VVaWQgPSBpbnN0YW5jZVVpZCsrO1xuXG4gICAgICAgICAgICAvLyBBIHNpbXBsZSB3YXkgdG8gY2hlY2sgZm9yIEhUTUwgc3RyaW5nc1xuICAgICAgICAgICAgLy8gU3RyaWN0IEhUTUwgcmVjb2duaXRpb24gKG11c3Qgc3RhcnQgd2l0aCA8KVxuICAgICAgICAgICAgLy8gRXh0cmFjdGVkIGZyb20galF1ZXJ5IHYxLjExIHNvdXJjZVxuICAgICAgICAgICAgXy5odG1sRXhwciA9IC9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKikkLztcblxuXG4gICAgICAgICAgICBfLnJlZ2lzdGVyQnJlYWtwb2ludHMoKTtcbiAgICAgICAgICAgIF8uaW5pdCh0cnVlKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFNsaWNrO1xuXG4gICAgfSgpKTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hY3RpdmF0ZUFEQSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stYWN0aXZlJykuYXR0cih7XG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAnZmFsc2UnXG4gICAgICAgIH0pLmZpbmQoJ2EsIGlucHV0LCBidXR0b24sIHNlbGVjdCcpLmF0dHIoe1xuICAgICAgICAgICAgJ3RhYmluZGV4JzogJzAnXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hZGRTbGlkZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0FkZCA9IGZ1bmN0aW9uKG1hcmt1cCwgaW5kZXgsIGFkZEJlZm9yZSkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBhZGRCZWZvcmUgPSBpbmRleDtcbiAgICAgICAgICAgIGluZGV4ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IDAgfHwgKGluZGV4ID49IF8uc2xpZGVDb3VudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8udW5sb2FkKCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDAgJiYgXy4kc2xpZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICQobWFya3VwKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkQmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmluc2VydEJlZm9yZShfLiRzbGlkZXMuZXEoaW5kZXgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmluc2VydEFmdGVyKF8uJHNsaWRlcy5lcShpbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICQobWFya3VwKS5wcmVwZW5kVG8oXy4kc2xpZGVUcmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQobWFya3VwKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlcyA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKTtcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjay5hcHBlbmQoXy4kc2xpZGVzKTtcblxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgJChlbGVtZW50KS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcblxuICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hbmltYXRlSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfID0gdGhpcztcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgXy4kbGlzdC5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRhcmdldEhlaWdodFxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYW5pbWF0ZVNsaWRlID0gZnVuY3Rpb24odGFyZ2V0TGVmdCwgY2FsbGJhY2spIHtcblxuICAgICAgICB2YXIgYW5pbVByb3BzID0ge30sXG4gICAgICAgICAgICBfID0gdGhpcztcblxuICAgICAgICBfLmFuaW1hdGVIZWlnaHQoKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gLXRhcmdldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8udHJhbnNmb3Jtc0VuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnRcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0YXJnZXRMZWZ0XG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50TGVmdCA9IC0oXy5jdXJyZW50TGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoe1xuICAgICAgICAgICAgICAgICAgICBhbmltU3RhcnQ6IF8uY3VycmVudExlZnRcbiAgICAgICAgICAgICAgICB9KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiB0YXJnZXRMZWZ0XG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogXy5vcHRpb25zLnNwZWVkLFxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IF8ub3B0aW9ucy5lYXNpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IGZ1bmN0aW9uKG5vdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gTWF0aC5jZWlsKG5vdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdyArICdweCwgMHB4KSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgwcHgsJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdyArICdweCknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKGFuaW1Qcm9wcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gTWF0aC5jZWlsKHRhcmdldExlZnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKCcgKyB0YXJnZXRMZWZ0ICsgJ3B4LCAwcHgsIDBweCknO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgwcHgsJyArIHRhcmdldExlZnQgKyAncHgsIDBweCknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGlzYWJsZVRyYW5zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TmF2VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgYXNOYXZGb3IgPSBfLm9wdGlvbnMuYXNOYXZGb3I7XG5cbiAgICAgICAgaWYgKCBhc05hdkZvciAmJiBhc05hdkZvciAhPT0gbnVsbCApIHtcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gJChhc05hdkZvcikubm90KF8uJHNsaWRlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNOYXZGb3I7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmFzTmF2Rm9yID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBhc05hdkZvciA9IF8uZ2V0TmF2VGFyZ2V0KCk7XG5cbiAgICAgICAgaWYgKCBhc05hdkZvciAhPT0gbnVsbCAmJiB0eXBlb2YgYXNOYXZGb3IgPT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgYXNOYXZGb3IuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKS5zbGljaygnZ2V0U2xpY2snKTtcbiAgICAgICAgICAgICAgICBpZighdGFyZ2V0LnVuc2xpY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc2xpZGVIYW5kbGVyKGluZGV4LCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hcHBseVRyYW5zaXRpb24gPSBmdW5jdGlvbihzbGlkZSkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSB7fTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gXy50cmFuc2Zvcm1UeXBlICsgJyAnICsgXy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyBfLm9wdGlvbnMuY3NzRWFzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnb3BhY2l0eSAnICsgXy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyBfLm9wdGlvbnMuY3NzRWFzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHRyYW5zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlKS5jc3ModHJhbnNpdGlvbik7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXkgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5hdXRvUGxheUNsZWFyKCk7XG5cbiAgICAgICAgaWYgKCBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xuICAgICAgICAgICAgXy5hdXRvUGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoIF8uYXV0b1BsYXlJdGVyYXRvciwgXy5vcHRpb25zLmF1dG9wbGF5U3BlZWQgKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUNsZWFyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLmF1dG9QbGF5VGltZXIpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuXG4gICAgICAgIGlmICggIV8ucGF1c2VkICYmICFfLmludGVycnVwdGVkICYmICFfLmZvY3Vzc2VkICkge1xuXG4gICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIF8uZGlyZWN0aW9uID09PSAxICYmICggXy5jdXJyZW50U2xpZGUgKyAxICkgPT09ICggXy5zbGlkZUNvdW50IC0gMSApKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlbHNlIGlmICggXy5kaXJlY3Rpb24gPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlIC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggXy5jdXJyZW50U2xpZGUgLSAxID09PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5kaXJlY3Rpb24gPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIHNsaWRlVG8gKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkQXJyb3dzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICkge1xuXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cgPSAkKF8ub3B0aW9ucy5wcmV2QXJyb3cpLmFkZENsYXNzKCdzbGljay1hcnJvdycpO1xuICAgICAgICAgICAgXy4kbmV4dEFycm93ID0gJChfLm9wdGlvbnMubmV4dEFycm93KS5hZGRDbGFzcygnc2xpY2stYXJyb3cnKTtcblxuICAgICAgICAgICAgaWYoIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZUNsYXNzKCdzbGljay1oaWRkZW4nKS5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiB0YWJpbmRleCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMucHJldkFycm93KSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucHJlcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmRBcnJvd3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLm5leHRBcnJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFwcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmRBcnJvd3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93XG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cuYWRkKCBfLiRuZXh0QXJyb3cgKVxuXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2staGlkZGVuJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FyaWEtZGlzYWJsZWQnOiAndHJ1ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZERvdHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBpLCBkb3Q7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1kb3R0ZWQnKTtcblxuICAgICAgICAgICAgZG90ID0gJCgnPHVsIC8+JykuYWRkQ2xhc3MoXy5vcHRpb25zLmRvdHNDbGFzcyk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPD0gXy5nZXREb3RDb3VudCgpOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBkb3QuYXBwZW5kKCQoJzxsaSAvPicpLmFwcGVuZChfLm9wdGlvbnMuY3VzdG9tUGFnaW5nLmNhbGwodGhpcywgXywgaSkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy4kZG90cyA9IGRvdC5hcHBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kRG90cyk7XG5cbiAgICAgICAgICAgIF8uJGRvdHMuZmluZCgnbGknKS5maXJzdCgpLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkT3V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uJHNsaWRlcyA9XG4gICAgICAgICAgICBfLiRzbGlkZXJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oIF8ub3B0aW9ucy5zbGlkZSArICc6bm90KC5zbGljay1jbG9uZWQpJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlJyk7XG5cbiAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgJChlbGVtZW50KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpXG4gICAgICAgICAgICAgICAgLmRhdGEoJ29yaWdpbmFsU3R5bGluZycsICQoZWxlbWVudCkuYXR0cignc3R5bGUnKSB8fCAnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stc2xpZGVyJyk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjayA9IChfLnNsaWRlQ291bnQgPT09IDApID9cbiAgICAgICAgICAgICQoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5hcHBlbmRUbyhfLiRzbGlkZXIpIDpcbiAgICAgICAgICAgIF8uJHNsaWRlcy53cmFwQWxsKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykucGFyZW50KCk7XG5cbiAgICAgICAgXy4kbGlzdCA9IF8uJHNsaWRlVHJhY2sud3JhcChcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2xpY2stbGlzdFwiLz4nKS5wYXJlbnQoKTtcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoJ29wYWNpdHknLCAwKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2ltZ1tkYXRhLWxhenldJywgXy4kc2xpZGVyKS5ub3QoJ1tzcmNdJykuYWRkQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcblxuICAgICAgICBfLnNldHVwSW5maW5pdGUoKTtcblxuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XG5cbiAgICAgICAgXy5idWlsZERvdHMoKTtcblxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcblxuXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRsaXN0LmFkZENsYXNzKCdkcmFnZ2FibGUnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZFJvd3MgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsIGEsIGIsIGMsIG5ld1NsaWRlcywgbnVtT2ZTbGlkZXMsIG9yaWdpbmFsU2xpZGVzLHNsaWRlc1BlclNlY3Rpb247XG5cbiAgICAgICAgbmV3U2xpZGVzID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlci5jaGlsZHJlbigpO1xuXG4gICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMCkge1xuXG4gICAgICAgICAgICBzbGlkZXNQZXJTZWN0aW9uID0gXy5vcHRpb25zLnNsaWRlc1BlclJvdyAqIF8ub3B0aW9ucy5yb3dzO1xuICAgICAgICAgICAgbnVtT2ZTbGlkZXMgPSBNYXRoLmNlaWwoXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMubGVuZ3RoIC8gc2xpZGVzUGVyU2VjdGlvblxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZm9yKGEgPSAwOyBhIDwgbnVtT2ZTbGlkZXM7IGErKyl7XG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZm9yKGIgPSAwOyBiIDwgXy5vcHRpb25zLnJvd3M7IGIrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihjID0gMDsgYyA8IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3c7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IChhICogc2xpZGVzUGVyU2VjdGlvbiArICgoYiAqIF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cpICsgYykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXdTbGlkZXMuYXBwZW5kQ2hpbGQoc2xpZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQobmV3U2xpZGVzKTtcbiAgICAgICAgICAgIF8uJHNsaWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOigxMDAgLyBfLm9wdGlvbnMuc2xpZGVzUGVyUm93KSArICclJyxcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnaW5saW5lLWJsb2NrJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuY2hlY2tSZXNwb25zaXZlID0gZnVuY3Rpb24oaW5pdGlhbCwgZm9yY2VVcGRhdGUpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBicmVha3BvaW50LCB0YXJnZXRCcmVha3BvaW50LCByZXNwb25kVG9XaWR0aCwgdHJpZ2dlckJyZWFrcG9pbnQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHNsaWRlcldpZHRoID0gXy4kc2xpZGVyLndpZHRoKCk7XG4gICAgICAgIHZhciB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIHx8ICQod2luZG93KS53aWR0aCgpO1xuXG4gICAgICAgIGlmIChfLnJlc3BvbmRUbyA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gd2luZG93V2lkdGg7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5yZXNwb25kVG8gPT09ICdzbGlkZXInKSB7XG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IHNsaWRlcldpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnbWluJykge1xuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSBNYXRoLm1pbih3aW5kb3dXaWR0aCwgc2xpZGVyV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLm9wdGlvbnMucmVzcG9uc2l2ZSAmJlxuICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoICYmXG4gICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yIChicmVha3BvaW50IGluIF8uYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5icmVha3BvaW50cy5oYXNPd25Qcm9wZXJ0eShicmVha3BvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbmRUb1dpZHRoIDwgXy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbmRUb1dpZHRoID4gXy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QnJlYWtwb2ludCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEJyZWFrcG9pbnQgIT09IF8uYWN0aXZlQnJlYWtwb2ludCB8fCBmb3JjZVVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludFNldHRpbmdzW3RhcmdldEJyZWFrcG9pbnRdID09PSAndW5zbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLnVuc2xpY2sodGFyZ2V0QnJlYWtwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLm9yaWdpbmFsU2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludFNldHRpbmdzW3RhcmdldEJyZWFrcG9pbnRdID09PSAndW5zbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5zbGljayh0YXJnZXRCcmVha3BvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLm9yaWdpbmFsU2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zID0gXy5vcmlnaW5hbFNldHRpbmdzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSB0cmlnZ2VyIGJyZWFrcG9pbnRzIGR1cmluZyBhbiBhY3R1YWwgYnJlYWsuIG5vdCBvbiBpbml0aWFsaXplLlxuICAgICAgICAgICAgaWYoICFpbml0aWFsICYmIHRyaWdnZXJCcmVha3BvaW50ICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYnJlYWtwb2ludCcsIFtfLCB0cmlnZ2VyQnJlYWtwb2ludF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNoYW5nZVNsaWRlID0gZnVuY3Rpb24oZXZlbnQsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICBpbmRleE9mZnNldCwgc2xpZGVPZmZzZXQsIHVuZXZlbk9mZnNldDtcblxuICAgICAgICAvLyBJZiB0YXJnZXQgaXMgYSBsaW5rLCBwcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuICAgICAgICBpZigkdGFyZ2V0LmlzKCdhJykpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0YXJnZXQgaXMgbm90IHRoZSA8bGk+IGVsZW1lbnQgKGllOiBhIGNoaWxkKSwgZmluZCB0aGUgPGxpPi5cbiAgICAgICAgaWYoISR0YXJnZXQuaXMoJ2xpJykpIHtcbiAgICAgICAgICAgICR0YXJnZXQgPSAkdGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB1bmV2ZW5PZmZzZXQgPSAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKTtcbiAgICAgICAgaW5kZXhPZmZzZXQgPSB1bmV2ZW5PZmZzZXQgPyAwIDogKF8uc2xpZGVDb3VudCAtIF8uY3VycmVudFNsaWRlKSAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEubWVzc2FnZSkge1xuXG4gICAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSBpbmRleE9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmN1cnJlbnRTbGlkZSAtIHNsaWRlT2Zmc2V0LCBmYWxzZSwgZG9udEFuaW1hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IGluZGV4T2Zmc2V0O1xuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY3VycmVudFNsaWRlICsgc2xpZGVPZmZzZXQsIGZhbHNlLCBkb250QW5pbWF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdpbmRleCc6XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZXZlbnQuZGF0YS5pbmRleCA9PT0gMCA/IDAgOlxuICAgICAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4IHx8ICR0YXJnZXQuaW5kZXgoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY2hlY2tOYXZpZ2FibGUoaW5kZXgpLCBmYWxzZSwgZG9udEFuaW1hdGUpO1xuICAgICAgICAgICAgICAgICR0YXJnZXQuY2hpbGRyZW4oKS50cmlnZ2VyKCdmb2N1cycpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGVja05hdmlnYWJsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgbmF2aWdhYmxlcywgcHJldk5hdmlnYWJsZTtcblxuICAgICAgICBuYXZpZ2FibGVzID0gXy5nZXROYXZpZ2FibGVJbmRleGVzKCk7XG4gICAgICAgIHByZXZOYXZpZ2FibGUgPSAwO1xuICAgICAgICBpZiAoaW5kZXggPiBuYXZpZ2FibGVzW25hdmlnYWJsZXMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgIGluZGV4ID0gbmF2aWdhYmxlc1tuYXZpZ2FibGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgbiBpbiBuYXZpZ2FibGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbmF2aWdhYmxlc1tuXSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHByZXZOYXZpZ2FibGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2TmF2aWdhYmxlID0gbmF2aWdhYmxlc1tuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzICYmIF8uJGRvdHMgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKVxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSlcbiAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uJGRvdHMub2ZmKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlci5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpO1xuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93ICYmIF8uJG5leHRBcnJvdy5vZmYoJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2snLCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xuXG4gICAgICAgIF8uJGxpc3Qub2ZmKCdjbGljay5zbGljaycsIF8uY2xpY2tIYW5kbGVyKTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXy52aXNpYmlsaXR5Q2hhbmdlLCBfLnZpc2liaWxpdHkpO1xuXG4gICAgICAgIF8uY2xlYW5VcFNsaWRlRXZlbnRzKCk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRsaXN0Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQod2luZG93KS5vZmYoJ29yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLm9yaWVudGF0aW9uQ2hhbmdlKTtcblxuICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ucmVzaXplKTtcblxuICAgICAgICAkKCdbZHJhZ2dhYmxlIT10cnVlXScsIF8uJHNsaWRlVHJhY2spLm9mZignZHJhZ3N0YXJ0JywgXy5wcmV2ZW50RGVmYXVsdCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9mZignbG9hZC5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBTbGlkZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcbiAgICAgICAgXy4kbGlzdC5vZmYoJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwUm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcywgb3JpZ2luYWxTbGlkZXM7XG5cbiAgICAgICAgaWYoXy5vcHRpb25zLnJvd3MgPiAwKSB7XG4gICAgICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlcy5jaGlsZHJlbigpLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICBvcmlnaW5hbFNsaWRlcy5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG9yaWdpbmFsU2xpZGVzKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGlja0hhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5zaG91bGRDbGljayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihyZWZyZXNoKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xuXG4gICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcblxuICAgICAgICBfLmNsZWFuVXBFdmVudHMoKTtcblxuICAgICAgICAkKCcuc2xpY2stY2xvbmVkJywgXy4kc2xpZGVyKS5kZXRhY2goKTtcblxuICAgICAgICBpZiAoXy4kZG90cykge1xuICAgICAgICAgICAgXy4kZG90cy5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy4kcHJldkFycm93ICYmIF8uJHByZXZBcnJvdy5sZW5ndGggKSB7XG5cbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJycpO1xuXG4gICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLnByZXZBcnJvdyApKSB7XG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lmxlbmd0aCApIHtcblxuICAgICAgICAgICAgXy4kbmV4dEFycm93XG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW4nKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4JylcbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywnJyk7XG5cbiAgICAgICAgICAgIGlmICggXy5odG1sRXhwci50ZXN0KCBfLm9wdGlvbnMubmV4dEFycm93ICkpIHtcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChfLiRzbGlkZXMpIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1zbGljay1pbmRleCcpXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzdHlsZScsICQodGhpcykuZGF0YSgnb3JpZ2luYWxTdHlsaW5nJykpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJGxpc3QuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci5hcHBlbmQoXy4kc2xpZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uY2xlYW5VcFJvd3MoKTtcblxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlcicpO1xuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJyk7XG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stZG90dGVkJyk7XG5cbiAgICAgICAgXy51bnNsaWNrZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmKCFyZWZyZXNoKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignZGVzdHJveScsIFtfXSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZGlzYWJsZVRyYW5zaXRpb24gPSBmdW5jdGlvbihzbGlkZSkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSB7fTtcblxuICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gJyc7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5mYWRlU2xpZGUgPSBmdW5jdGlvbihzbGlkZUluZGV4LCBjYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5kaXNhYmxlVHJhbnNpdGlvbihzbGlkZUluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmZhZGVTbGlkZU91dCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDJcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZyk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oc2xpZGVJbmRleCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tGaWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKGZpbHRlciAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcblxuICAgICAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZS5maWx0ZXIoZmlsdGVyKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcblxuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmZvY3VzSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLiRzbGlkZXJcbiAgICAgICAgICAgIC5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKVxuICAgICAgICAgICAgLm9uKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJywgJyonLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHZhciAkc2YgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5wYXVzZU9uRm9jdXMgKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9jdXNzZWQgPSAkc2YuaXMoJzpmb2N1cycpO1xuICAgICAgICAgICAgICAgICAgICBfLmF1dG9QbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCAwKTtcblxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldEN1cnJlbnQgPSBTbGljay5wcm90b3R5cGUuc2xpY2tDdXJyZW50U2xpZGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBfLmN1cnJlbnRTbGlkZTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0RG90Q291bnQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGJyZWFrUG9pbnQgPSAwO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHZhciBwYWdlclF0eSA9IDA7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHBhZ2VyUXR5ID0gXy5zbGlkZUNvdW50O1xuICAgICAgICB9IGVsc2UgaWYoIV8ub3B0aW9ucy5hc05hdkZvcikge1xuICAgICAgICAgICAgcGFnZXJRdHkgPSAxICsgTWF0aC5jZWlsKChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAvIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgKytwYWdlclF0eTtcbiAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWdlclF0eSAtIDE7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbihzbGlkZUluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgdGFyZ2V0TGVmdCxcbiAgICAgICAgICAgIHZlcnRpY2FsSGVpZ2h0LFxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwLFxuICAgICAgICAgICAgdGFyZ2V0U2xpZGUsXG4gICAgICAgICAgICBjb2VmO1xuXG4gICAgICAgIF8uc2xpZGVPZmZzZXQgPSAwO1xuICAgICAgICB2ZXJ0aWNhbEhlaWdodCA9IF8uJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IChfLnNsaWRlV2lkdGggKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIC0xO1xuICAgICAgICAgICAgICAgIGNvZWYgPSAtMVxuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZiA9IC0xLjU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29lZiA9IC0yXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAodmVydGljYWxIZWlnaHQgKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIGNvZWY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPiBfLnNsaWRlQ291bnQgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVJbmRleCA+IF8uc2xpZGVDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiBfLnNsaWRlV2lkdGgpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiBfLnNsaWRlV2lkdGgpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID4gXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIF8uc2xpZGVXaWR0aDtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIHZlcnRpY2FsSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSkgLyAyKSAtICgoXy5zbGlkZVdpZHRoICogXy5zbGlkZUNvdW50KSAvIDIpO1xuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlICYmIF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCArPSBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKSAtIF8uc2xpZGVXaWR0aDtcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ICs9IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoKHNsaWRlSW5kZXggKiBfLnNsaWRlV2lkdGgpICogLTEpICsgXy5zbGlkZU9mZnNldDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoKHNsaWRlSW5kZXggKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMSkgKyB2ZXJ0aWNhbE9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgfHwgXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTbGlkZVswXSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uJHNsaWRlVHJhY2sud2lkdGgoKSAtIHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgLSB0YXJnZXRTbGlkZS53aWR0aCgpKSAqIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAgMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSB0YXJnZXRTbGlkZVswXSA/IHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgKiAtMSA6IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyB8fCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIDEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTbGlkZVswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLiRzbGlkZVRyYWNrLndpZHRoKCkgLSB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0IC0gdGFyZ2V0U2xpZGUud2lkdGgoKSkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAgMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSB0YXJnZXRTbGlkZVswXSA/IHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgKiAtMSA6IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCArPSAoXy4kbGlzdC53aWR0aCgpIC0gdGFyZ2V0U2xpZGUub3V0ZXJXaWR0aCgpKSAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0TGVmdDtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0T3B0aW9uID0gU2xpY2sucHJvdG90eXBlLnNsaWNrR2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBfLm9wdGlvbnNbb3B0aW9uXTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TmF2aWdhYmxlSW5kZXhlcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSAwLFxuICAgICAgICAgICAgY291bnRlciA9IDAsXG4gICAgICAgICAgICBpbmRleGVzID0gW10sXG4gICAgICAgICAgICBtYXg7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1heCA9IF8uc2xpZGVDb3VudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgKiAtMTtcbiAgICAgICAgICAgIGNvdW50ZXIgPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgKiAtMTtcbiAgICAgICAgICAgIG1heCA9IF8uc2xpZGVDb3VudCAqIDI7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IG1heCkge1xuICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGJyZWFrUG9pbnQpO1xuICAgICAgICAgICAgYnJlYWtQb2ludCA9IGNvdW50ZXIgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleGVzO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGljayA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgc2xpZGVzVHJhdmVyc2VkLCBzd2lwZWRTbGlkZSwgY2VudGVyT2Zmc2V0O1xuXG4gICAgICAgIGNlbnRlck9mZnNldCA9IF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlID8gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMikgOiAwO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1zbGlkZScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIHNsaWRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlLm9mZnNldExlZnQgLSBjZW50ZXJPZmZzZXQgKyAoJChzbGlkZSkub3V0ZXJXaWR0aCgpIC8gMikgPiAoXy5zd2lwZUxlZnQgKiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpcGVkU2xpZGUgPSBzbGlkZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzbGlkZXNUcmF2ZXJzZWQgPSBNYXRoLmFicygkKHN3aXBlZFNsaWRlKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykgLSBfLmN1cnJlbnRTbGlkZSkgfHwgMTtcblxuICAgICAgICAgICAgcmV0dXJuIHNsaWRlc1RyYXZlcnNlZDtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nb1RvID0gU2xpY2sucHJvdG90eXBlLnNsaWNrR29UbyA9IGZ1bmN0aW9uKHNsaWRlLCBkb250QW5pbWF0ZSkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnLFxuICAgICAgICAgICAgICAgIGluZGV4OiBwYXJzZUludChzbGlkZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZG9udEFuaW1hdGUpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oY3JlYXRpb24pIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCEkKF8uJHNsaWRlcikuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuICAgICAgICAgICAgJChfLiRzbGlkZXIpLmFkZENsYXNzKCdzbGljay1pbml0aWFsaXplZCcpO1xuXG4gICAgICAgICAgICBfLmJ1aWxkUm93cygpO1xuICAgICAgICAgICAgXy5idWlsZE91dCgpO1xuICAgICAgICAgICAgXy5zZXRQcm9wcygpO1xuICAgICAgICAgICAgXy5zdGFydExvYWQoKTtcbiAgICAgICAgICAgIF8ubG9hZFNsaWRlcigpO1xuICAgICAgICAgICAgXy5pbml0aWFsaXplRXZlbnRzKCk7XG4gICAgICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xuICAgICAgICAgICAgXy51cGRhdGVEb3RzKCk7XG4gICAgICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZSh0cnVlKTtcbiAgICAgICAgICAgIF8uZm9jdXNIYW5kbGVyKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVhdGlvbikge1xuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2luaXQnLCBbX10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLmluaXRBREEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xuXG4gICAgICAgICAgICBfLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdEFEQSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAgICAgbnVtRG90R3JvdXBzID0gTWF0aC5jZWlsKF8uc2xpZGVDb3VudCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpLFxuICAgICAgICAgICAgICAgIHRhYkNvbnRyb2xJbmRleGVzID0gXy5nZXROYXZpZ2FibGVJbmRleGVzKCkuZmlsdGVyKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHZhbCA+PSAwKSAmJiAodmFsIDwgXy5zbGlkZUNvdW50KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZXMuYWRkKF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpKS5hdHRyKHtcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgfSkuZmluZCgnYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0JykuYXR0cih7XG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXMubm90KF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVDb250cm9sSW5kZXggPSB0YWJDb250cm9sSW5kZXhlcy5pbmRleE9mKGkpO1xuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAndGFicGFuZWwnLFxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGksXG4gICAgICAgICAgICAgICAgICAgICd0YWJpbmRleCc6IC0xXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2xpZGVDb250cm9sSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgdmFyIGFyaWFCdXR0b25Db250cm9sID0gJ3NsaWNrLXNsaWRlLWNvbnRyb2wnICsgXy5pbnN0YW5jZVVpZCArIHNsaWRlQ29udHJvbEluZGV4XG4gICAgICAgICAgICAgICAgICAgaWYgKCQoJyMnICsgYXJpYUJ1dHRvbkNvbnRyb2wpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYXJpYS1kZXNjcmliZWRieSc6IGFyaWFCdXR0b25Db250cm9sXG4gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uJGRvdHMuYXR0cigncm9sZScsICd0YWJsaXN0JykuZmluZCgnbGknKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwcGVkU2xpZGVJbmRleCA9IHRhYkNvbnRyb2xJbmRleGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdidXR0b24nKS5maXJzdCgpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAncm9sZSc6ICd0YWInLFxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUtY29udHJvbCcgKyBfLmluc3RhbmNlVWlkICsgaSxcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIG1hcHBlZFNsaWRlSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLWxhYmVsJzogKGkgKyAxKSArICcgb2YgJyArIG51bURvdEdyb3VwcyxcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pLmVxKF8uY3VycmVudFNsaWRlKS5maW5kKCdidXR0b24nKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcbiAgICAgICAgICAgIH0pLmVuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaT1fLmN1cnJlbnRTbGlkZSwgbWF4PWkrXy5vcHRpb25zLnNsaWRlc1RvU2hvdzsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uQ2hhbmdlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoaSkuYXR0cih7J3RhYmluZGV4JzogJzAnfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShpKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF8uYWN0aXZhdGVBREEoKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdEFycm93RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xuICAgICAgICAgICAgICAgLm9mZignY2xpY2suc2xpY2snKVxuICAgICAgICAgICAgICAgLm9uKCdjbGljay5zbGljaycsIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3dcbiAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcbiAgICAgICAgICAgICAgIC5vbignY2xpY2suc2xpY2snLCB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5vbigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93Lm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0RG90RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpLm9uKCdjbGljay5zbGljaycsIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnXG4gICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy4kZG90cy5vbigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXIgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRTbGlkZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5wYXVzZU9uSG92ZXIgKSB7XG5cbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSk7XG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRpYWxpemVFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcblxuICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcbiAgICAgICAgXy5pbml0U2xpZGVFdmVudHMoKTtcblxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3N0YXJ0J1xuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2snLCB7XG4gICAgICAgICAgICBhY3Rpb246ICdtb3ZlJ1xuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2snLCB7XG4gICAgICAgICAgICBhY3Rpb246ICdlbmQnXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xuXG4gICAgICAgIF8uJGxpc3Qub24oJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKF8udmlzaWJpbGl0eUNoYW5nZSwgJC5wcm94eShfLnZpc2liaWxpdHksIF8pKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQod2luZG93KS5vbignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5vcmllbnRhdGlvbkNoYW5nZSwgXykpO1xuXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCAkLnByb3h5KF8ucmVzaXplLCBfKSk7XG5cbiAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vbignZHJhZ3N0YXJ0JywgXy5wcmV2ZW50RGVmYXVsdCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcbiAgICAgICAgJChfLnNldFBvc2l0aW9uKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdFVJID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy4kcHJldkFycm93LnNob3coKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5zaG93KCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgIF8uJGRvdHMuc2hvdygpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUua2V5SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICAgLy9Eb250IHNsaWRlIGlmIHRoZSBjdXJzb3IgaXMgaW5zaWRlIHRoZSBmb3JtIGZpZWxkcyBhbmQgYXJyb3cga2V5cyBhcmUgcHJlc3NlZFxuICAgICAgICBpZighZXZlbnQudGFyZ2V0LnRhZ05hbWUubWF0Y2goJ1RFWFRBUkVBfElOUFVUfFNFTEVDVCcpKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICduZXh0JyA6ICAncHJldmlvdXMnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICdwcmV2aW91cycgOiAnbmV4dCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmxhenlMb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgbG9hZFJhbmdlLCBjbG9uZVJhbmdlLCByYW5nZVN0YXJ0LCByYW5nZUVuZDtcblxuICAgICAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlc1Njb3BlKSB7XG5cbiAgICAgICAgICAgICQoJ2ltZ1tkYXRhLWxhenldJywgaW1hZ2VzU2NvcGUpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNvdXJjZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXp5JyksXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU3JjU2V0ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXNyY3NldCcpLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNpemVzICA9ICQodGhpcykuYXR0cignZGF0YS1zaXplcycpIHx8IF8uJHNsaWRlci5hdHRyKCdkYXRhLXNpemVzJyksXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAwIH0sIDEwMCwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VTcmNTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzcmNzZXQnLCBpbWFnZVNyY1NldCApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZVNpemVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzaXplcycsIGltYWdlU2l6ZXMgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzcmMnLCBpbWFnZVNvdXJjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAxIH0sIDIwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLWxhenkgZGF0YS1zcmNzZXQgZGF0YS1zaXplcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZGVkJywgW18sIGltYWdlLCBpbWFnZVNvdXJjZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCAnc2xpY2stbG9hZGluZycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkRXJyb3InLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBfLmN1cnJlbnRTbGlkZSArIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpO1xuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gcmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZVN0YXJ0ID0gTWF0aC5tYXgoMCwgXy5jdXJyZW50U2xpZGUgLSAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKSk7XG4gICAgICAgICAgICAgICAgcmFuZ2VFbmQgPSAyICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkgKyBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBfLm9wdGlvbnMuaW5maW5pdGUgPyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgXy5jdXJyZW50U2xpZGUgOiBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gTWF0aC5jZWlsKHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChyYW5nZVN0YXJ0ID4gMCkgcmFuZ2VTdGFydC0tO1xuICAgICAgICAgICAgICAgIGlmIChyYW5nZUVuZCA8PSBfLnNsaWRlQ291bnQpIHJhbmdlRW5kKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykuc2xpY2UocmFuZ2VTdGFydCwgcmFuZ2VFbmQpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdhbnRpY2lwYXRlZCcpIHtcbiAgICAgICAgICAgIHZhciBwcmV2U2xpZGUgPSByYW5nZVN0YXJ0IC0gMSxcbiAgICAgICAgICAgICAgICBuZXh0U2xpZGUgPSByYW5nZUVuZCxcbiAgICAgICAgICAgICAgICAkc2xpZGVzID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZTbGlkZSA8IDApIHByZXZTbGlkZSA9IF8uc2xpZGVDb3VudCAtIDE7XG4gICAgICAgICAgICAgICAgbG9hZFJhbmdlID0gbG9hZFJhbmdlLmFkZCgkc2xpZGVzLmVxKHByZXZTbGlkZSkpO1xuICAgICAgICAgICAgICAgIGxvYWRSYW5nZSA9IGxvYWRSYW5nZS5hZGQoJHNsaWRlcy5lcShuZXh0U2xpZGUpKTtcbiAgICAgICAgICAgICAgICBwcmV2U2xpZGUtLTtcbiAgICAgICAgICAgICAgICBuZXh0U2xpZGUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRJbWFnZXMobG9hZFJhbmdlKTtcblxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJyk7XG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKDAsIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcbiAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICAgICAgY2xvbmVSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stY2xvbmVkJykuc2xpY2UoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAqIC0xKTtcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoY2xvbmVSYW5nZSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUubG9hZFNsaWRlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3Moe1xuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcblxuICAgICAgICBfLmluaXRVSSgpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdwcm9ncmVzc2l2ZScpIHtcbiAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLm5leHQgPSBTbGljay5wcm90b3R5cGUuc2xpY2tOZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUub3JpZW50YXRpb25DaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wYXVzZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1BhdXNlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xuICAgICAgICBfLnBhdXNlZCA9IHRydWU7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnBsYXkgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQbGF5ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYXV0b1BsYXkoKTtcbiAgICAgICAgXy5vcHRpb25zLmF1dG9wbGF5ID0gdHJ1ZTtcbiAgICAgICAgXy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xuICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnBvc3RTbGlkZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdhZnRlckNoYW5nZScsIFtfLCBpbmRleF0pO1xuXG4gICAgICAgICAgICBfLmFuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgIF8uc2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcbiAgICAgICAgICAgICAgICBfLmF1dG9QbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uaW5pdEFEQSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY3VycmVudFNsaWRlID0gJChfLiRzbGlkZXMuZ2V0KF8uY3VycmVudFNsaWRlKSk7XG4gICAgICAgICAgICAgICAgICAgICRjdXJyZW50U2xpZGUuYXR0cigndGFiaW5kZXgnLCAwKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXYgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQcmV2ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdwcmV2aW91cydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkID0gZnVuY3Rpb24oIHRyeUNvdW50ICkge1xuXG4gICAgICAgIHRyeUNvdW50ID0gdHJ5Q291bnQgfHwgMTtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAkaW1nc1RvTG9hZCA9ICQoICdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlciApLFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBpbWFnZVNvdXJjZSxcbiAgICAgICAgICAgIGltYWdlU3JjU2V0LFxuICAgICAgICAgICAgaW1hZ2VTaXplcyxcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkO1xuXG4gICAgICAgIGlmICggJGltZ3NUb0xvYWQubGVuZ3RoICkge1xuXG4gICAgICAgICAgICBpbWFnZSA9ICRpbWdzVG9Mb2FkLmZpcnN0KCk7XG4gICAgICAgICAgICBpbWFnZVNvdXJjZSA9IGltYWdlLmF0dHIoJ2RhdGEtbGF6eScpO1xuICAgICAgICAgICAgaW1hZ2VTcmNTZXQgPSBpbWFnZS5hdHRyKCdkYXRhLXNyY3NldCcpO1xuICAgICAgICAgICAgaW1hZ2VTaXplcyAgPSBpbWFnZS5hdHRyKCdkYXRhLXNpemVzJykgfHwgXy4kc2xpZGVyLmF0dHIoJ2RhdGEtc2l6ZXMnKTtcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGltYWdlU3JjU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3Jjc2V0JywgaW1hZ2VTcmNTZXQgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VTaXplcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc2l6ZXMnLCBpbWFnZVNpemVzICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAuYXR0ciggJ3NyYycsIGltYWdlU291cmNlIClcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtbGF6eSBkYXRhLXNyY3NldCBkYXRhLXNpemVzJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZGVkJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XG4gICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICggdHJ5Q291bnQgPCAzICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiB0cnkgdG8gbG9hZCB0aGUgaW1hZ2UgMyB0aW1lcyxcbiAgICAgICAgICAgICAgICAgICAgICogbGVhdmUgYSBzbGlnaHQgZGVsYXkgc28gd2UgZG9uJ3QgZ2V0XG4gICAgICAgICAgICAgICAgICAgICAqIHNlcnZlcnMgYmxvY2tpbmcgdGhlIHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCggdHJ5Q291bnQgKyAxICk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCApO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoICdkYXRhLWxhenknIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3NsaWNrLWxvYWRpbmcnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ3NsaWNrLWxhenlsb2FkLWVycm9yJyApO1xuXG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZEVycm9yJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLnNyYyA9IGltYWdlU291cmNlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdhbGxJbWFnZXNMb2FkZWQnLCBbIF8gXSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oIGluaXRpYWxpemluZyApIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsIGN1cnJlbnRTbGlkZSwgbGFzdFZpc2libGVJbmRleDtcblxuICAgICAgICBsYXN0VmlzaWJsZUluZGV4ID0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcblxuICAgICAgICAvLyBpbiBub24taW5maW5pdGUgc2xpZGVycywgd2UgZG9uJ3Qgd2FudCB0byBnbyBwYXN0IHRoZVxuICAgICAgICAvLyBsYXN0IHZpc2libGUgaW5kZXguXG4gICAgICAgIGlmKCAhXy5vcHRpb25zLmluZmluaXRlICYmICggXy5jdXJyZW50U2xpZGUgPiBsYXN0VmlzaWJsZUluZGV4ICkpIHtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gbGFzdFZpc2libGVJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGxlc3Mgc2xpZGVzIHRoYW4gdG8gc2hvdywgZ28gdG8gc3RhcnQuXG4gICAgICAgIGlmICggXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IDA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xuXG4gICAgICAgIF8uZGVzdHJveSh0cnVlKTtcblxuICAgICAgICAkLmV4dGVuZChfLCBfLmluaXRpYWxzLCB7IGN1cnJlbnRTbGlkZTogY3VycmVudFNsaWRlIH0pO1xuXG4gICAgICAgIF8uaW5pdCgpO1xuXG4gICAgICAgIGlmKCAhaW5pdGlhbGl6aW5nICkge1xuXG4gICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCcsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiBjdXJyZW50U2xpZGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWdpc3RlckJyZWFrcG9pbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLCBicmVha3BvaW50LCBjdXJyZW50QnJlYWtwb2ludCwgbCxcbiAgICAgICAgICAgIHJlc3BvbnNpdmVTZXR0aW5ncyA9IF8ub3B0aW9ucy5yZXNwb25zaXZlIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKCAkLnR5cGUocmVzcG9uc2l2ZVNldHRpbmdzKSA9PT0gJ2FycmF5JyAmJiByZXNwb25zaXZlU2V0dGluZ3MubGVuZ3RoICkge1xuXG4gICAgICAgICAgICBfLnJlc3BvbmRUbyA9IF8ub3B0aW9ucy5yZXNwb25kVG8gfHwgJ3dpbmRvdyc7XG5cbiAgICAgICAgICAgIGZvciAoIGJyZWFrcG9pbnQgaW4gcmVzcG9uc2l2ZVNldHRpbmdzICkge1xuXG4gICAgICAgICAgICAgICAgbCA9IF8uYnJlYWtwb2ludHMubGVuZ3RoLTE7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2l2ZVNldHRpbmdzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCcmVha3BvaW50ID0gcmVzcG9uc2l2ZVNldHRpbmdzW2JyZWFrcG9pbnRdLmJyZWFrcG9pbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBicmVha3BvaW50cyBhbmQgY3V0IG91dCBhbnkgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gb25lcyB3aXRoIHRoZSBzYW1lIGJyZWFrcG9pbnQgbnVtYmVyLCB3ZSBkb24ndCB3YW50IGR1cGVzLlxuICAgICAgICAgICAgICAgICAgICB3aGlsZSggbCA+PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8uYnJlYWtwb2ludHNbbF0gJiYgXy5icmVha3BvaW50c1tsXSA9PT0gY3VycmVudEJyZWFrcG9pbnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50cy5zcGxpY2UobCwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGwtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMucHVzaChjdXJyZW50QnJlYWtwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW2N1cnJlbnRCcmVha3BvaW50XSA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5zZXR0aW5ncztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIF8ub3B0aW9ucy5tb2JpbGVGaXJzdCApID8gYS1iIDogYi1hO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy4kc2xpZGVzID1cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2tcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oXy5vcHRpb25zLnNsaWRlKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stc2xpZGUnKTtcblxuICAgICAgICBfLnNsaWRlQ291bnQgPSBfLiRzbGlkZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgJiYgXy5jdXJyZW50U2xpZGUgIT09IDApIHtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIF8ucmVnaXN0ZXJCcmVha3BvaW50cygpO1xuXG4gICAgICAgIF8uc2V0UHJvcHMoKTtcbiAgICAgICAgXy5zZXR1cEluZmluaXRlKCk7XG4gICAgICAgIF8uYnVpbGRBcnJvd3MoKTtcbiAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcbiAgICAgICAgXy5idWlsZERvdHMoKTtcbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XG4gICAgICAgIF8uaW5pdERvdEV2ZW50cygpO1xuICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xuICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xuXG4gICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKGZhbHNlLCB0cnVlKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXModHlwZW9mIF8uY3VycmVudFNsaWRlID09PSAnbnVtYmVyJyA/IF8uY3VycmVudFNsaWRlIDogMCk7XG5cbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuICAgICAgICBfLmZvY3VzSGFuZGxlcigpO1xuXG4gICAgICAgIF8ucGF1c2VkID0gIV8ub3B0aW9ucy5hdXRvcGxheTtcbiAgICAgICAgXy5hdXRvUGxheSgpO1xuXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdyZUluaXQnLCBbX10pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpICE9PSBfLndpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoXy53aW5kb3dEZWxheSk7XG4gICAgICAgICAgICBfLndpbmRvd0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgICAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKCk7XG4gICAgICAgICAgICAgICAgaWYoICFfLnVuc2xpY2tlZCApIHsgXy5zZXRQb3NpdGlvbigpOyB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnJlbW92ZVNsaWRlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgsIHJlbW92ZUJlZm9yZSwgcmVtb3ZlQWxsKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJlbW92ZUJlZm9yZSA9IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSByZW1vdmVCZWZvcmUgPT09IHRydWUgPyAwIDogXy5zbGlkZUNvdW50IC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZGV4ID0gcmVtb3ZlQmVmb3JlID09PSB0cnVlID8gLS1pbmRleCA6IGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8IDEgfHwgaW5kZXggPCAwIHx8IGluZGV4ID4gXy5zbGlkZUNvdW50IC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICBpZiAocmVtb3ZlQWxsID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoaW5kZXgpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmFwcGVuZChfLiRzbGlkZXMpO1xuXG4gICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xuXG4gICAgICAgIF8ucmVpbml0KCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldENTUyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9LFxuICAgICAgICAgICAgeCwgeTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcG9zaXRpb24gPSAtcG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgeCA9IF8ucG9zaXRpb25Qcm9wID09ICdsZWZ0JyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XG4gICAgICAgIHkgPSBfLnBvc2l0aW9uUHJvcCA9PSAndG9wJyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XG5cbiAgICAgICAgcG9zaXRpb25Qcm9wc1tfLnBvc2l0aW9uUHJvcF0gPSBwb3NpdGlvbjtcblxuICAgICAgICBpZiAoXy50cmFuc2Zvcm1zRW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9O1xuICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoJyArIHggKyAnLCAnICsgeSArICcpJztcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgnICsgeCArICcsICcgKyB5ICsgJywgMHB4KSc7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoJzBweCAnICsgXy5vcHRpb25zLmNlbnRlclBhZGRpbmcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRsaXN0LmhlaWdodChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoXy5vcHRpb25zLmNlbnRlclBhZGRpbmcgKyAnIDBweCcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfLmxpc3RXaWR0aCA9IF8uJGxpc3Qud2lkdGgoKTtcbiAgICAgICAgXy5saXN0SGVpZ2h0ID0gXy4kbGlzdC5oZWlnaHQoKTtcblxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlICYmIF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5zbGlkZVdpZHRoID0gTWF0aC5jZWlsKF8ubGlzdFdpZHRoIC8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKE1hdGguY2VpbCgoXy5zbGlkZVdpZHRoICogXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykubGVuZ3RoKSkpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sud2lkdGgoNTAwMCAqIF8uc2xpZGVDb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLnNsaWRlV2lkdGggPSBNYXRoLmNlaWwoXy5saXN0V2lkdGgpO1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5oZWlnaHQoTWF0aC5jZWlsKChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmxlbmd0aCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvZmZzZXQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKHRydWUpIC0gXy4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTtcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkgXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykud2lkdGgoXy5zbGlkZVdpZHRoIC0gb2Zmc2V0KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0RmFkZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHRhcmdldExlZnQ7XG5cbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy5zbGlkZVdpZHRoICogaW5kZXgpICogLTE7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0YXJnZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDIsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGFyZ2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkuY3NzKHtcbiAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDEsXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgXy4kbGlzdC5jc3MoJ2hlaWdodCcsIHRhcmdldEhlaWdodCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0T3B0aW9uID1cbiAgICBTbGljay5wcm90b3R5cGUuc2xpY2tTZXRPcHRpb24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYWNjZXB0cyBhcmd1bWVudHMgaW4gZm9ybWF0IG9mOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgLSBmb3IgY2hhbmdpbmcgYSBzaW5nbGUgb3B0aW9uJ3MgdmFsdWU6XG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgb3B0aW9uLCB2YWx1ZSwgcmVmcmVzaCApXG4gICAgICAgICAqXG4gICAgICAgICAqICAtIGZvciBjaGFuZ2luZyBhIHNldCBvZiByZXNwb25zaXZlIG9wdGlvbnM6XG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgJ3Jlc3BvbnNpdmUnLCBbe30sIC4uLl0sIHJlZnJlc2ggKVxuICAgICAgICAgKlxuICAgICAgICAgKiAgLSBmb3IgdXBkYXRpbmcgbXVsdGlwbGUgdmFsdWVzIGF0IG9uY2UgKG5vdCByZXNwb25zaXZlKVxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsIHsgJ29wdGlvbic6IHZhbHVlLCAuLi4gfSwgcmVmcmVzaCApXG4gICAgICAgICAqL1xuXG4gICAgICAgIHZhciBfID0gdGhpcywgbCwgaXRlbSwgb3B0aW9uLCB2YWx1ZSwgcmVmcmVzaCA9IGZhbHNlLCB0eXBlO1xuXG4gICAgICAgIGlmKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnb2JqZWN0JyApIHtcblxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHJlZnJlc2ggPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB0eXBlID0gJ211bHRpcGxlJztcblxuICAgICAgICB9IGVsc2UgaWYgKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnc3RyaW5nJyApIHtcblxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHZhbHVlID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgcmVmcmVzaCA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgICAgICAgaWYgKCBhcmd1bWVudHNbMF0gPT09ICdyZXNwb25zaXZlJyAmJiAkLnR5cGUoIGFyZ3VtZW50c1sxXSApID09PSAnYXJyYXknICkge1xuXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdyZXNwb25zaXZlJztcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZ3VtZW50c1sxXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAgICAgICAgICAgICB0eXBlID0gJ3NpbmdsZSc7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0eXBlID09PSAnc2luZ2xlJyApIHtcblxuICAgICAgICAgICAgXy5vcHRpb25zW29wdGlvbl0gPSB2YWx1ZTtcblxuXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdtdWx0aXBsZScgKSB7XG5cbiAgICAgICAgICAgICQuZWFjaCggb3B0aW9uICwgZnVuY3Rpb24oIG9wdCwgdmFsICkge1xuXG4gICAgICAgICAgICAgICAgXy5vcHRpb25zW29wdF0gPSB2YWw7XG5cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3Jlc3BvbnNpdmUnICkge1xuXG4gICAgICAgICAgICBmb3IgKCBpdGVtIGluIHZhbHVlICkge1xuXG4gICAgICAgICAgICAgICAgaWYoICQudHlwZSggXy5vcHRpb25zLnJlc3BvbnNpdmUgKSAhPT0gJ2FycmF5JyApIHtcblxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSA9IFsgdmFsdWVbaXRlbV0gXTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbCA9IF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aC0xO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgcmVzcG9uc2l2ZSBvYmplY3QgYW5kIHNwbGljZSBvdXQgZHVwbGljYXRlcy5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5yZXNwb25zaXZlW2xdLmJyZWFrcG9pbnQgPT09IHZhbHVlW2l0ZW1dLmJyZWFrcG9pbnQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZS5zcGxpY2UobCwxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLnB1c2goIHZhbHVlW2l0ZW1dICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCByZWZyZXNoICkge1xuXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uc2V0RGltZW5zaW9ucygpO1xuXG4gICAgICAgIF8uc2V0SGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5zZXRDU1MoXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLnNldEZhZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdzZXRQb3NpdGlvbicsIFtfXSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFByb3BzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgYm9keVN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcblxuICAgICAgICBfLnBvc2l0aW9uUHJvcCA9IF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gdHJ1ZSA/ICd0b3AnIDogJ2xlZnQnO1xuXG4gICAgICAgIGlmIChfLnBvc2l0aW9uUHJvcCA9PT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stdmVydGljYWwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stdmVydGljYWwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChib2R5U3R5bGUuV2Via2l0VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBib2R5U3R5bGUuTW96VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBib2R5U3R5bGUubXNUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudXNlQ1NTID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy5jc3NUcmFuc2l0aW9ucyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5mYWRlICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgXy5vcHRpb25zLnpJbmRleCA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy56SW5kZXggPCAzICkge1xuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuekluZGV4ID0gMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy56SW5kZXggPSBfLmRlZmF1bHRzLnpJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChib2R5U3R5bGUuT1RyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ09UcmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1vLXRyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ09UcmFuc2l0aW9uJztcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHlTdHlsZS5Nb3pUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdNb3pUcmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tb3otdHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnTW96VHJhbnNpdGlvbic7XG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUuTW96UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2R5U3R5bGUud2Via2l0VHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnd2Via2l0VHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctd2Via2l0LXRyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ3dlYmtpdFRyYW5zaXRpb24nO1xuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLndlYmtpdFBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYm9keVN0eWxlLm1zVHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnbXNUcmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tcy10cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdtc1RyYW5zaXRpb24nO1xuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5tc1RyYW5zZm9ybSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHlTdHlsZS50cmFuc2Zvcm0gIT09IHVuZGVmaW5lZCAmJiBfLmFuaW1UeXBlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ3RyYW5zaXRpb24nO1xuICAgICAgICB9XG4gICAgICAgIF8udHJhbnNmb3Jtc0VuYWJsZWQgPSBfLm9wdGlvbnMudXNlVHJhbnNmb3JtICYmIChfLmFuaW1UeXBlICE9PSBudWxsICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKTtcbiAgICB9O1xuXG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBjZW50ZXJPZmZzZXQsIGFsbFNsaWRlcywgaW5kZXhPZmZzZXQsIHJlbWFpbmRlcjtcblxuICAgICAgICBhbGxTbGlkZXMgPSBfLiRzbGlkZXJcbiAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGUnKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLWN1cnJlbnQnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgIC5lcShpbmRleClcbiAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY3VycmVudCcpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICB2YXIgZXZlbkNvZWYgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICUgMiA9PT0gMCA/IDEgOiAwO1xuXG4gICAgICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IGNlbnRlck9mZnNldCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gMSkgLSBjZW50ZXJPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXggLSBjZW50ZXJPZmZzZXQgKyBldmVuQ29lZiwgaW5kZXggKyBjZW50ZXJPZmZzZXQgKyAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4O1xuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCAtIGNlbnRlck9mZnNldCArIDEgKyBldmVuQ29lZiwgaW5kZXhPZmZzZXQgKyBjZW50ZXJPZmZzZXQgKyAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShhbGxTbGlkZXMubGVuZ3RoIC0gMSAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWNlbnRlcicpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gXy5zbGlkZUNvdW50IC0gMSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWNlbnRlcicpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uJHNsaWRlc1xuICAgICAgICAgICAgICAgIC5lcShpbmRleClcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWNlbnRlcicpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDw9IChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSkge1xuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleCwgaW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsbFNsaWRlcy5sZW5ndGggPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgYWxsU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICByZW1haW5kZXIgPSBfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xuICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlID8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4IDogaW5kZXg7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgJiYgKF8uc2xpZGVDb3VudCAtIGluZGV4KSA8IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCAtIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC0gcmVtYWluZGVyKSwgaW5kZXhPZmZzZXQgKyByZW1haW5kZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQsIGluZGV4T2Zmc2V0ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdvbmRlbWFuZCcgfHwgXy5vcHRpb25zLmxhenlMb2FkID09PSAnYW50aWNpcGF0ZWQnKSB7XG4gICAgICAgICAgICBfLmxhenlMb2FkKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldHVwSW5maW5pdGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBpLCBzbGlkZUluZGV4LCBpbmZpbml0ZUNvdW50O1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5vcHRpb25zLmNlbnRlck1vZGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIHNsaWRlSW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZUNvdW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBfLnNsaWRlQ291bnQ7IGkgPiAoXy5zbGlkZUNvdW50IC1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQpOyBpIC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVJbmRleCA9IGkgLSAxO1xuICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wcmVwZW5kVG8oXy4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoJ3NsaWNrLWNsb25lZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5maW5pdGVDb3VudCAgKyBfLnNsaWRlQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgJChfLiRzbGlkZXNbc2xpZGVJbmRleF0pLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcsIHNsaWRlSW5kZXggKyBfLnNsaWRlQ291bnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oXy4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoJ3NsaWNrLWNsb25lZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKS5maW5kKCdbaWRdJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdpZCcsICcnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oIHRvZ2dsZSApIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYoICF0b2dnbGUgKSB7XG4gICAgICAgICAgICBfLmF1dG9QbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRvZ2dsZTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2VsZWN0SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIHZhciB0YXJnZXRFbGVtZW50ID1cbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5pcygnLnNsaWNrLXNsaWRlJykgP1xuICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KSA6XG4gICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpLnBhcmVudHMoJy5zbGljay1zbGlkZScpO1xuXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KHRhcmdldEVsZW1lbnQuYXR0cignZGF0YS1zbGljay1pbmRleCcpKTtcblxuICAgICAgICBpZiAoIWluZGV4KSBpbmRleCA9IDA7XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKGluZGV4LCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF8uc2xpZGVIYW5kbGVyKGluZGV4KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2xpZGVIYW5kbGVyID0gZnVuY3Rpb24oaW5kZXgsIHN5bmMsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgdmFyIHRhcmdldFNsaWRlLCBhbmltU2xpZGUsIG9sZFNsaWRlLCBzbGlkZUxlZnQsIHRhcmdldExlZnQgPSBudWxsLFxuICAgICAgICAgICAgXyA9IHRoaXMsIG5hdlRhcmdldDtcblxuICAgICAgICBzeW5jID0gc3luYyB8fCBmYWxzZTtcblxuICAgICAgICBpZiAoXy5hbmltYXRpbmcgPT09IHRydWUgJiYgXy5vcHRpb25zLndhaXRGb3JBbmltYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgJiYgXy5jdXJyZW50U2xpZGUgPT09IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3luYyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uYXNOYXZGb3IoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0U2xpZGUgPSBpbmRleDtcbiAgICAgICAgdGFyZ2V0TGVmdCA9IF8uZ2V0TGVmdCh0YXJnZXRTbGlkZSk7XG4gICAgICAgIHNsaWRlTGVmdCA9IF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSk7XG5cbiAgICAgICAgXy5jdXJyZW50TGVmdCA9IF8uc3dpcGVMZWZ0ID09PSBudWxsID8gc2xpZGVMZWZ0IDogXy5zd2lwZUxlZnQ7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IGZhbHNlICYmIChpbmRleCA8IDAgfHwgaW5kZXggPiBfLmdldERvdENvdW50KCkgKiBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSB7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBfLmFuaW1hdGVTbGlkZShzbGlkZUxlZnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChfLmF1dG9QbGF5VGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldFNsaWRlIDwgMCkge1xuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IF8uc2xpZGVDb3VudCAtIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSBfLnNsaWRlQ291bnQgKyB0YXJnZXRTbGlkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRTbGlkZSA+PSBfLnNsaWRlQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZSAtIF8uc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1TbGlkZSA9IHRhcmdldFNsaWRlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5hbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdiZWZvcmVDaGFuZ2UnLCBbXywgXy5jdXJyZW50U2xpZGUsIGFuaW1TbGlkZV0pO1xuXG4gICAgICAgIG9sZFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG4gICAgICAgIF8uY3VycmVudFNsaWRlID0gYW5pbVNsaWRlO1xuXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKF8uY3VycmVudFNsaWRlKTtcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hc05hdkZvciApIHtcblxuICAgICAgICAgICAgbmF2VGFyZ2V0ID0gXy5nZXROYXZUYXJnZXQoKTtcbiAgICAgICAgICAgIG5hdlRhcmdldCA9IG5hdlRhcmdldC5zbGljaygnZ2V0U2xpY2snKTtcblxuICAgICAgICAgICAgaWYgKCBuYXZUYXJnZXQuc2xpZGVDb3VudCA8PSBuYXZUYXJnZXQub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XG4gICAgICAgICAgICAgICAgbmF2VGFyZ2V0LnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF8udXBkYXRlRG90cygpO1xuICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICBfLmZhZGVTbGlkZU91dChvbGRTbGlkZSk7XG5cbiAgICAgICAgICAgICAgICBfLmZhZGVTbGlkZShhbmltU2xpZGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfLmFuaW1hdGVIZWlnaHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLmFuaW1hdGVTbGlkZSh0YXJnZXRMZWZ0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnN0YXJ0TG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5oaWRlKCk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cuaGlkZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICBfLiRkb3RzLmhpZGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlRGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHhEaXN0LCB5RGlzdCwgciwgc3dpcGVBbmdsZSwgXyA9IHRoaXM7XG5cbiAgICAgICAgeERpc3QgPSBfLnRvdWNoT2JqZWN0LnN0YXJ0WCAtIF8udG91Y2hPYmplY3QuY3VyWDtcbiAgICAgICAgeURpc3QgPSBfLnRvdWNoT2JqZWN0LnN0YXJ0WSAtIF8udG91Y2hPYmplY3QuY3VyWTtcbiAgICAgICAgciA9IE1hdGguYXRhbjIoeURpc3QsIHhEaXN0KTtcblxuICAgICAgICBzd2lwZUFuZ2xlID0gTWF0aC5yb3VuZChyICogMTgwIC8gTWF0aC5QSSk7XG4gICAgICAgIGlmIChzd2lwZUFuZ2xlIDwgMCkge1xuICAgICAgICAgICAgc3dpcGVBbmdsZSA9IDM2MCAtIE1hdGguYWJzKHN3aXBlQW5nbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlIDw9IDQ1KSAmJiAoc3dpcGVBbmdsZSA+PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdsZWZ0JyA6ICdyaWdodCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA8PSAzNjApICYmIChzd2lwZUFuZ2xlID49IDMxNSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPj0gMTM1KSAmJiAoc3dpcGVBbmdsZSA8PSAyMjUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ3JpZ2h0JyA6ICdsZWZ0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICgoc3dpcGVBbmdsZSA+PSAzNSkgJiYgKHN3aXBlQW5nbGUgPD0gMTM1KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnZG93bic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAndXAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBzbGlkZUNvdW50LFxuICAgICAgICAgICAgZGlyZWN0aW9uO1xuXG4gICAgICAgIF8uZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgXy5zd2lwaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKF8uc2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICBfLnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xuICAgICAgICBfLnNob3VsZENsaWNrID0gKCBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID4gMTAgKSA/IGZhbHNlIDogdHJ1ZTtcblxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuY3VyWCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPT09IHRydWUgKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignZWRnZScsIFtfLCBfLnN3aXBlRGlyZWN0aW9uKCkgXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPj0gXy50b3VjaE9iamVjdC5taW5Td2lwZSApIHtcblxuICAgICAgICAgICAgZGlyZWN0aW9uID0gXy5zd2lwZURpcmVjdGlvbigpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCBkaXJlY3Rpb24gKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdkb3duJzpcblxuICAgICAgICAgICAgICAgICAgICBzbGlkZUNvdW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY2hlY2tOYXZpZ2FibGUoIF8uY3VycmVudFNsaWRlICsgXy5nZXRTbGlkZUNvdW50KCkgKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgKyBfLmdldFNsaWRlQ291bnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnREaXJlY3Rpb24gPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3VwJzpcblxuICAgICAgICAgICAgICAgICAgICBzbGlkZUNvdW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY2hlY2tOYXZpZ2FibGUoIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCkgKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgLSBfLmdldFNsaWRlQ291bnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnREaXJlY3Rpb24gPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcblxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBkaXJlY3Rpb24gIT0gJ3ZlcnRpY2FsJyApIHtcblxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBzbGlkZUNvdW50ICk7XG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdzd2lwZScsIFtfLCBkaXJlY3Rpb24gXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAoIF8udG91Y2hPYmplY3Quc3RhcnRYICE9PSBfLnRvdWNoT2JqZWN0LmN1clggKSB7XG5cbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggXy5jdXJyZW50U2xpZGUgKTtcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICgoXy5vcHRpb25zLnN3aXBlID09PSBmYWxzZSkgfHwgKCdvbnRvdWNoZW5kJyBpbiBkb2N1bWVudCAmJiBfLm9wdGlvbnMuc3dpcGUgPT09IGZhbHNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5kcmFnZ2FibGUgPT09IGZhbHNlICYmIGV2ZW50LnR5cGUuaW5kZXhPZignbW91c2UnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF8udG91Y2hPYmplY3QuZmluZ2VyQ291bnQgPSBldmVudC5vcmlnaW5hbEV2ZW50ICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGggOiAxO1xuXG4gICAgICAgIF8udG91Y2hPYmplY3QubWluU3dpcGUgPSBfLmxpc3RXaWR0aCAvIF8ub3B0aW9uc1xuICAgICAgICAgICAgLnRvdWNoVGhyZXNob2xkO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0SGVpZ2h0IC8gXy5vcHRpb25zXG4gICAgICAgICAgICAgICAgLnRvdWNoVGhyZXNob2xkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChldmVudC5kYXRhLmFjdGlvbikge1xuXG4gICAgICAgICAgICBjYXNlICdzdGFydCc6XG4gICAgICAgICAgICAgICAgXy5zd2lwZVN0YXJ0KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbW92ZSc6XG4gICAgICAgICAgICAgICAgXy5zd2lwZU1vdmUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgIF8uc3dpcGVFbmQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBlZGdlV2FzSGl0ID0gZmFsc2UsXG4gICAgICAgICAgICBjdXJMZWZ0LCBzd2lwZURpcmVjdGlvbiwgc3dpcGVMZW5ndGgsIHBvc2l0aW9uT2Zmc2V0LCB0b3VjaGVzLCB2ZXJ0aWNhbFN3aXBlTGVuZ3RoO1xuXG4gICAgICAgIHRvdWNoZXMgPSBldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgPyBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgOiBudWxsO1xuXG4gICAgICAgIGlmICghXy5kcmFnZ2luZyB8fCBfLnNjcm9sbGluZyB8fCB0b3VjaGVzICYmIHRvdWNoZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJMZWZ0ID0gXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKTtcblxuICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcbiAgICAgICAgXy50b3VjaE9iamVjdC5jdXJZID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlc1swXS5wYWdlWSA6IGV2ZW50LmNsaWVudFk7XG5cbiAgICAgICAgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxuICAgICAgICAgICAgTWF0aC5wb3coXy50b3VjaE9iamVjdC5jdXJYIC0gXy50b3VjaE9iamVjdC5zdGFydFgsIDIpKSk7XG5cbiAgICAgICAgdmVydGljYWxTd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxuICAgICAgICAgICAgTWF0aC5wb3coXy50b3VjaE9iamVjdC5jdXJZIC0gXy50b3VjaE9iamVjdC5zdGFydFksIDIpKSk7XG5cbiAgICAgICAgaWYgKCFfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nICYmICFfLnN3aXBpbmcgJiYgdmVydGljYWxTd2lwZUxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIF8uc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID0gdmVydGljYWxTd2lwZUxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXBlRGlyZWN0aW9uID0gXy5zd2lwZURpcmVjdGlvbigpO1xuXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIF8uc3dpcGluZyA9IHRydWU7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb25PZmZzZXQgPSAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAxIDogLTEpICogKF8udG91Y2hPYmplY3QuY3VyWCA+IF8udG91Y2hPYmplY3Quc3RhcnRYID8gMSA6IC0xKTtcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uT2Zmc2V0ID0gXy50b3VjaE9iamVjdC5jdXJZID4gXy50b3VjaE9iamVjdC5zdGFydFkgPyAxIDogLTE7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXBlTGVuZ3RoID0gXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aDtcblxuICAgICAgICBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKChfLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ3JpZ2h0JykgfHwgKF8uY3VycmVudFNsaWRlID49IF8uZ2V0RG90Q291bnQoKSAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ2xlZnQnKSkge1xuICAgICAgICAgICAgICAgIHN3aXBlTGVuZ3RoID0gXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCAqIF8ub3B0aW9ucy5lZGdlRnJpY3Rpb247XG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdC5lZGdlSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IGN1ckxlZnQgKyBzd2lwZUxlbmd0aCAqIHBvc2l0aW9uT2Zmc2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgKHN3aXBlTGVuZ3RoICogKF8uJGxpc3QuaGVpZ2h0KCkgLyBfLmxpc3RXaWR0aCkpICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnRvdWNoTW92ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmFuaW1hdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5zZXRDU1MoXy5zd2lwZUxlZnQpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZVN0YXJ0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICB0b3VjaGVzO1xuXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ICE9PSAxIHx8IF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFggPSBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFkgPSBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcblxuICAgICAgICBfLmRyYWdnaW5nID0gdHJ1ZTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudW5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tVbmZpbHRlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy4kc2xpZGVzQ2FjaGUgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcblxuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnVubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAkKCcuc2xpY2stY2xvbmVkJywgXy4kc2xpZGVyKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoXy4kZG90cykge1xuICAgICAgICAgICAgXy4kZG90cy5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLiRwcmV2QXJyb3cgJiYgXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5wcmV2QXJyb3cpKSB7XG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy4kbmV4dEFycm93ICYmIF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xuICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnQnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuICAgICAgICAgICAgLmNzcygnd2lkdGgnLCAnJyk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnVuc2xpY2sgPSBmdW5jdGlvbihmcm9tQnJlYWtwb2ludCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcbiAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3Vuc2xpY2snLCBbXywgZnJvbUJyZWFrcG9pbnRdKTtcbiAgICAgICAgXy5kZXN0cm95KCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZUFycm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGNlbnRlck9mZnNldDtcblxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiZcbiAgICAgICAgICAgIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiZcbiAgICAgICAgICAgICFfLm9wdGlvbnMuaW5maW5pdGUgKSB7XG5cbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcblxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSAxICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlRG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBfLiRkb3RzXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAuZW5kKCk7XG5cbiAgICAgICAgICAgIF8uJGRvdHNcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxuICAgICAgICAgICAgICAgIC5lcShNYXRoLmZsb29yKF8uY3VycmVudFNsaWRlIC8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSlcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudmlzaWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcblxuICAgICAgICAgICAgaWYgKCBkb2N1bWVudFtfLmhpZGRlbl0gKSB7XG5cbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAkLmZuLnNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIG9wdCA9IGFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICAgICAgbCA9IF8ubGVuZ3RoLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIHJldDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9wdCA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICBfW2ldLnNsaWNrID0gbmV3IFNsaWNrKF9baV0sIG9wdCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0ID0gX1tpXS5zbGlja1tvcHRdLmFwcGx5KF9baV0uc2xpY2ssIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgIT0gJ3VuZGVmaW5lZCcpIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF87XG4gICAgfTtcblxufSkpO1xuIl0sImZpbGUiOiJzbGljay5qcyJ9
