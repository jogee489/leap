;(function($) {
  var methods = {
    init: function(settings) {

      return this.each(function() {
        var self = this;
        if (typeof self.pleaseWait != 'undefined')
          return;       
        self.pleaseWait = {
          opt:  $.extend(true, {}, $.fn.pleaseWait.defaults, settings),
          cog: document.createElement('img'),
          timer: false,
          overlay: document.createElement('div'),
                    degrees: 1
        };
                
        var targetWidth = $(self).outerWidth();
        var targetHeight = $(self).outerHeight();
        var verticalMidpoint = (targetHeight / 2) - (self.pleaseWait.opt.height / 2);
        var horizontalMidpoint = (targetWidth / 2) - (self.pleaseWait.opt.width / 2);
        var offset = $(self).offset();

        $(self.pleaseWait.cog).css({
          'position':'absolute',
          'z-index':'999999',
          'left':offset.left + horizontalMidpoint,
          'top':offset.top + verticalMidpoint
        });
        $(document.body).append(self.pleaseWait.cog);

        self.pleaseWait.overlay = document.createElement('div');
        $(self.pleaseWait.overlay).css({
          'position':'absolute',
          'z-index':'999998',
          'left':offset.left,
          'top':offset.top,
          'width':targetWidth,
          'height':targetHeight,
          'background-color':'rgba(107,66,88,0.90)',
          'display':'none'
        });
        $(document.body).append(self.pleaseWait.overlay);

        if (self.pleaseWait.opt.imageType != 'encoded' && self.pleaseWait.opt.image.length > 0) {
          self.pleaseWait.cog.src = image;
        } else {
          self.pleaseWait.cog.src = 'data:image/png;base64,'+self.pleaseWait.opt.image;
        }

        $(self).attr('data-pleaseWait', '1');

        methods.start.call(self);

          });
      },
    start: function () {
      var self = $(this);
      if (typeof self.length != 'undefined' && self.length > 0)
        self = self[0];
      if (typeof self.pleaseWait == 'undefined')
        return;

      var targetWidth = $(self).outerWidth();
      var targetHeight = $(self).outerHeight();
      var verticalMidpoint = (targetHeight / 2) - (self.pleaseWait.opt.height / 2);
      var horizontalMidpoint = (targetWidth / 2) - (self.pleaseWait.opt.width / 2);
      var offset = $(self).offset();
      $(self.pleaseWait.cog).css({
        'left':offset.left + horizontalMidpoint,
        'top':offset.top + verticalMidpoint
      });
      $(self.pleaseWait.overlay).css({
        'left':offset.left,
        'top':offset.top,
        'width':targetWidth,
        'height':targetHeight,
      });

      $(self.pleaseWait.cog).css('display', '');
      $(self.pleaseWait.overlay).css('display', '');
        if (self.pleaseWait.timer != false)
          clearTimeout(self.pleaseWait.timer);
        var drawMethod = methods.draw;
      var removeMethod = methods.remove;
      self.pleaseWait.timer = setInterval(function () {
        if (document.body.contains(self)) {
          drawMethod.call(self)
        } else {
          removeMethod.call(self);
        }
      },self.pleaseWait.opt.speed);
      return self;
    },
    stop: function () {
      var self = $(this);
      if (typeof self.length != 'undefined' && self.length > 0)
        self = self[0];
      if (typeof self.pleaseWait == 'undefined')
        return;
        if (self.pleaseWait.timer != false)
          clearTimeout(self.pleaseWait.timer);
      self.pleaseWait.timer = false;
      $(self.pleaseWait.cog).css('display', 'none');
      $(self.pleaseWait.overlay).css('display', 'none');
      return self;
    },
    draw: function () {
      var self = this;
      if (typeof self.length != 'undefined' && self.length > 0)
        self = self[0];
      if (typeof self.pleaseWait == 'undefined')
        return;

            var rotateTarget = self.pleaseWait.cog;
            if (self.pleaseWait.opt.crazy)
                rotateTarget = self;
            
            if(navigator.userAgent.match("MSIE")){
                rotateTarget.style.msTransform = "rotate("+self.pleaseWait.degrees+"deg)";
            } else if(navigator.userAgent.match("Opera")){
                rotateTarget.style.OTransform = "rotate("+self.pleaseWait.degrees+"deg)";
            } else {
                rotateTarget.style.transform = "rotate("+self.pleaseWait.degrees+"deg)";
            }
            self.pleaseWait.degrees = parseInt(self.pleaseWait.degrees) + parseInt(self.pleaseWait.opt.increment);
            if(self.pleaseWait.degrees > 359){
                self.pleaseWait.degrees = 1;
            }
      },
      remove: function () {
      var self = this;
      if (typeof self.length != 'undefined' && self.length > 0)
        self = self[0];
        if (typeof self.pleaseWait != 'undefined'){
          if (self.pleaseWait.timer != false)
            clearTimeout(self.pleaseWait.timer);

        $(self.pleaseWait.cog).remove();
        $(self.pleaseWait.overlay).remove();
  
        $(self).removeAttr('data-pleaseWait');
        delete self.pleaseWait.overlay;
            delete self.pleaseWait.opt;
          delete self.pleaseWait.cog;
          delete self.pleaseWait.timer;
          delete self.pleaseWait;
      }
    }
  };
  $.fn.pleaseWait = function(method) {
    if (!methods[method]) {
      var attr = $(this).attr('data-pleaseWait');
      if (typeof attr == 'undefined' || attr == false)
        return methods.init.apply(this, arguments);
      method = 'start';
    }
      if (methods[method]) {
          return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
          return methods.init.apply(this, arguments);
      } else {
          $.error('pleaseWait plugin :: method "' + method + '" does not exist!');
      }
  };
  // reverse image
  // 'iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABEFJREFUeNrsW1tIFFEYPpuG2ZppGl3QUInAl8igCxZdiKCHKKwIeuitCCKoHoIopHqo6CGKqCB66SIEPtiFiOglwgysSBGiCCnBJK00b+ul3Xb6f+YbPJ40d2Yvs7tnfvjYOcPOmdlv/tv5/7M+wzCE7jLNpfseJxjAeV1J8DQhHUnII+xKZRIyo7g2g7CPcJTgJ3wgvNdNE/4QNhFyQchZXc3hDMhgWUmo0pEEVv8aaXyMMF1Hx3iB0IvjEsIBHUnoBRGWHCbM1zFPqJEiA0eKah1JYOd4UhpXwVFqlzG+JjyTxqd0TZtPE4I4rkiVkDkZCcUO52sj3JDG1fARSS2+CeoJawmXCQ8J1wndNufkH10vRYirhHPKd5ZJPqMZppQ0JHCiUytpwiDhJs4FbczLZnANx98JK2xe7yoJ+YQThI3K99oJVwjPbcxdi7B5idCfauYg8OY4BS5Tzr+CqXxOp3qC7z81RnaaOwgHsVK0JEyog60PpjsJluQQDoEQOZr0w3HWgZi0JsESNo0jhErlPJvGRUKjDiRYsk6Y1SQ1l9grzOqSFiRYoXQ3YT/M5SW0ROhEgiUFcJy3EEa1JCHtQ6RHgkeCR4KeJHALbY3D698R7qY6CdyGm0tY7PD6jnTQBK8rDXNgTZjt8PoBQpfnGL3o4JHgkeCRMF7mEX6IxFeXMnBPw00SsglbCRuEWVl+kWASOKr5hFnmG3GDhPWE7WKsuxQQZrcpkCAC/EpYHyX0EUKJIGGJMCtKamntE+E24WeCSMgGCWqyF0DuEo4HCYXC3KZXoZzn7hJXm5tcynZniX97nWEQEYgVCVmELYTNYvxeJFa/p8JsxYeEu5IJrchSzodgIqPRkLCasFOMb7ywNBAeiORrrc3As6p7M0fwrCE7JJQQ9uBTljbCPXxGImUwl2i7VHlQ7Ugauj6YR47iLwzJXxhTkTBHmJsy5Ql6CPeFvfa5Hw6UH6oZCDtwfsWwe36GLzb9BWvFTOX8MOHXVEtpvlk9jpn5J8LcfWJ3/8Aq+BBWzVKHCU0GCLBeTo6Na5nwXiRxv6Xzg5Gagx++4DFIsSu8OWObNH5E6FS+w0Wcchy3isk7V6UggGWI8NEhodl4IQORFlXYdu44JIDVXy7VtU5AgB35KpkRq3a+w3mGJyMgHpUlfrsFkjlF26QNwrlaUhSHZ47phOwDlkvjphil0d+kyMD3WJDMJFRI3ph/fEuM5g3DLORVa1YyksDhaKk0bozx0rpH8uw+4XyLYVxJqJTm6oRDjLW0S5FhthQ+k4KERYCVmTXEKS0eUiJWEbTCdRJ8WGNYwvG+W8RPOpSQWZgMJJQjtxfIzN7EeZEURLSwZKGI7s9sMSPBkuZIlq0xkC7pPpnSS3CNBN7//Ba22iISIwac5BAqWlFXs9wquUe6dkhYiUp78Uhw0RxypRVhnxj7S6Er8leAAQAs1TY2lWgC2wAAAABJRU5ErkJggg=='
  $.fn.pleaseWait.defaults = {
        crazy:false,
      speed:3,
        increment: 1,
    //image:'iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNrsXFtIFFEYPqsbZl7S1G5oqETgS2SghUUXIughCiuCHnrrAhFUD0EUUj1E9BBFVBC9RAWBD92IiF4iykCLlCCKkBLU0i5meU/b7f/b79DxtLo7t53dnf3hw5lxZ+bMN//9nF1fMBgUsRSfzxf2eKzHoUqaS/c9xM8NnBQuS5pIifDbqdKRxE2Vd1oT8ghbPKcJkHTCDsIBQhbhDeF1IpJgRRN+E9YQckHIiUTVBKvmcBxksFQTar1IAqv/dWX/IGGK10hgOUXoxXYpYbcXSegFEVL2EWZ7jQQBk5CRgSNFnRdJYOd4RNmvhaP0FAksTYSHyv7RhCOBU+FoMYkcI4xiuzJRQuZEmlBi8npthEvKfh18RHwLFzVaYbOc8AIPUGDikvzQLwkfgcNhCqhFhF1AtToON+CTA4Oac6JTr2hCP+Eyjo0aIILN4AK2PxOq+Py/N4zDpopOQj7e3Grtc+2Ec4RHBq5dj7B5hvAznktpnQQpVUiBy7XPPyOcJbxPpn7CRCRIp7mJsAeVopQA4SbhPMwlqUmQkk3YC0LUaMIqfhGEBOL9Qa2SIIVNYz+hRjvOpnGa0OgFEqSsQDdJzyW2c3fJKyTIULqVsBPm8hRaIrxEgpQCOM4rCKOeJCFhIkBUJHhZUiSkSAAJXvUDOgk8hbbM5PlcMl9LdBJ4Gq6IMN/k+Z3JYA6pqXmYA2vCdJPn9xG6k8EnpBxjKkSmSEjM2sGOcepjtIOEWYQvAt2lGJKQjnsG3SQhk7CesEqEOsuPY0xCERw7t/mG3SBhJWGj+De7NCBCkzUDMSIhSwvrI4QfhDEzJBhduLVAhDpKJWEyx0yQEQsJADLZyyDMxP37hNL4tdMxFqLGqNSO8+wSd5ubXXCMTECO+H+uMwAiBuwyB2Z4HWGtGL8WidXvgQhNxY+5HB38MI0M7fgYTGTECglLCZvF+IkXlgbCbTgkR8KnyUg1FWPVTXwYYx0zQkIpYRv+qtJGuIG/0Ug5zKXfIgl5UO1oJoR9MI9srTgMKv4iGImEGSK0KFO9QA/hlgitRIlWsuBA+aItQMAgCZlwwDkYwweD1TFrxTTt+BDhuz4OvZTmmz3BNjN/X4RWnzQZVM0l8CGsmmVqQmNg9Us6CJAvJ9tg9OhFEvdLOd4fbXTIgi+4B1KMCi/f26Ds3yV0SXPAfbiJU4H/twpt5koZSxkIYBkkvDWTIUKr/DAHEUkTZOJz1SQBPHq1VdcqCTApHUrMZ9XON3mdIUlAOPGbCW2TeG9+uwWKOTVajIijcK5ycWgx1DxgZ+FmZ3uNfcBiZb/ZpgzykxIZ+B5z7M497CShUvHG/PCvbEyRO7SqNSMeSeBwtFDZbzSav0eQHsWz+4T5JYaOklCjXKsLDtFuaVciw3QlfMYFCfMAmZk1OFQ2DGoRq1jY1Ci2SoIPNYYU/h7UNwfrp04tZBbGAwkVyO0FMrPnDvcRRhEtpMwV1r7MZhsJUlrCla0OSLdyH7/yElwj4Y4IrYPusTEkRqzI4STZR7wjfLXcozCTaVn5hqzB2sH2XoXTyVLCit/sG3VU32P9cwYu/X5CrlIRch+w183pwD8CDAC/RBaBiIoXIgAAAABJRU5ErkJggg==',
    //image: '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',
    image: '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',
    imageType: 'encoded',
    height:80,
    width:30
  };
})(jQuery);