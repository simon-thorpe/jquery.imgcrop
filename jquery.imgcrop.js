/*
 * jquery.imgcrop
 * Based on https://github.com/VuongN/jQuery-Fakecrop by Vuong Nguyen
 */
(function($) {
  var methods = {
    ratio: function(args) {
      var item = args.item,
        settings = args.settings;
      return {
        w: item.width() / settings.wrapperWidth,
        h: item.height() / settings.wrapperHeight
      };
    },
    center: function(long, short) {
      return parseInt((long - short) / 2, 10);
    },
    scaleToFill: function(args) {
      var item = args.item,
        settings = args.settings,
        ratio = settings.ratio,
        width = item.width(),
        height = item.height(),
        offset = {
          top: 0,
          left: 0
        };

      if (ratio.h > ratio.w) {
        width = settings.wrapperWidth;
        height = height / ratio.w;
        if (settings.center) {
          offset.top = methods.center(width, height);
        }
      } else {
        height = settings.wrapperHeight;
        width = width / ratio.h;
        if (settings.center) {
          offset.left = methods.center(height, width);
        }
      }

      if (settings.center) {
        args.wrapper.css('position', 'relative');
        item.css({
          'position': 'absolute',
          'top': ['-', offset.top, 'px'].join(''),
          'left': offset.left + 'px'
        });
      }

      return item.height(height).attr('height', height + 'px')
      .width(width).attr('width', width + 'px');
    },
    scaleToFit: function(args) {
      var item = args.item,
        settings = args.settings,
        ratio = settings.ratio,
        width = item.width(),
        height = item.height(),
        offset = {
          top: 0,
          left: 0
        };

      if (ratio.h > ratio.w) {
        height = settings.wrapperHeight,
        width = parseInt((item.width() * settings.wrapperHeight) / item.height(), 10);
        if (settings.center) {
          offset.left = methods.center(height, width);
        }
      } else {
        height = parseInt((item.height() * settings.wrapperWidth) / item.width(), 10),
        width = settings.wrapperWidth;
        if (settings.center) {
          offset.top = methods.center(width, height);
        }
      }

      args.wrapper.css({
        'width': settings.wrapperWidth + 'px',
        'height': settings.wrapperHeight + 'px'
      });

      if (settings.center) {
        args.wrapper.css('position', 'relative');
        item.css({
          'position': 'absolute',
          'top': offset.top + 'px',
          'left': offset.left + 'px'
        });
      }
      return item.height(height).attr('height', height + 'px')
      .width(width).attr('width', width + 'px');
    },
    init: function(options) {
      var settings = $.extend({
          wrapperSelector: null,
          wrapperWidth: 100,
          wrapperHeight: 100,
          center: true,
          fill: true,
          initClass: 'imgcrop-init',
          doneEvent: 'imgcropdone'
        }, options),
        _init = function() {
          var img = $(this),
            wrapper = settings.wrapperSelector ? img.closest(settings.wrapperSelector) : img.parent(),
            args = {
              item: img,
              settings: settings,
              wrapper: wrapper
            };
          settings.ratio = methods.ratio(args);
          if (settings.fill) {
            wrapper.css({
              'overflow': 'hidden',
              'width': settings.wrapperWidth + 'px',
              'height': settings.wrapperHeight + 'px'
            });
            methods.scaleToFill(args);
          } else {
            methods.scaleToFit(args);
          }

          img.data('fc.settings', settings)
            .addClass(settings.initClass) // Add class to container after initialization
            .trigger(settings.doneEvent); // Publish an event to announce that imgcrop in initialized

          // Center img element in wrapper.
          var wrapperWidth = wrapper.width();
          var wrapperHeight = wrapper.height();
          var imgWidth = img.width();
          var imgHeight = img.height();
          if (imgWidth > wrapperWidth) img.css({
              left: '-' + (imgWidth - wrapperWidth) / 2 + 'px'
            });
          else img.css({
              left: 0
            });
          if (imgHeight > wrapperHeight) img.css({
              top: '-' + (imgHeight - wrapperHeight) / 2 + 'px'
            });
        },
        images = this.filter('img'),
        others = this.filter(':not(img)');
      images.each(function() {
        // There is an issue on IE10 where images loading for first time (not from cache) would not fire the 'load' event.
        // Issue is explained here http://api.jquery.com/load-event/ under Caveats.
        // Creating a new temp img element and binding 'load' to this instead seems to fix it.
        var target = $(this),
          temp = $('<img>').attr('src', $(this).attr('src'));
        temp.bind('load', function() {
          _init.call(target);
          target.get(0).style.display = 'inline';
        }) /*.each(function() {
          // trick from paul irish's https://gist.github.com/797120/7176db676f1e0e20d7c23933f9fc655c2f120c58
          if (this.complete || this.complete === undefined) {
            var src = this.src;
            this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            this.src = src;
            //this.style.display = 'none'; // Commented out on 2013-11-08 because causing issue randomly with MSIE8. Doesn't look like it's needed for other browsers either.
          }
        });*/
      });
      if (others.length) {
        others.each(_init);
      }
      return this;
    }
  };
  $.fn.imgcrop = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.imgcrop');
    }
  };

  var applyToDataAttr = function() {
    $('img[data-crop-width]').each(function() { // On img element itself.
      var w = parseInt($(this).attr('data-crop-width'));
      var h = parseInt($(this).attr('data-crop-height'));
      var wrapper = $('<div/>').addClass('imgcrop-wrapper');
      $(this).removeAttr('data-crop-width');
      $(this).removeAttr('data-crop-height');
      $(this).wrap(wrapper).imgcrop({
        wrapperWidth: w,
        wrapperHeight: h
      });
    });
    $('[data-crop-width]>img').each(function() { // On custom wrapper for img element.
      var wrapper = $(this).parent();
      var w = parseInt(wrapper.attr('data-crop-width'));
      var h = parseInt(wrapper.attr('data-crop-height'));
      wrapper.addClass('imgcrop-wrapper').css({
        display: 'block'
      });
      wrapper.removeAttr('data-crop-width');
      wrapper.removeAttr('data-crop-height');
      $(this).imgcrop({
        wrapperWidth: w,
        wrapperHeight: h
      });
    });
  };
  applyToDataAttr();
  if (typeof(Sys) !== 'undefined') {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function(a, b) {
      applyToDataAttr();
    });
  }
})(jQuery);