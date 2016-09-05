(function(window, $) {
  $(document).ready(function() {
    $( '.burr-flipped-content-inner .pane-1 p:last-child' ).addClass( 'show-read-more' );
    $('#search-block-form #edit-search-block-form--2')
    .attr('placeholder', 'Search opensource.com');

    var addthis_config = addthis_config || {};
    addthis_config.data_track_clickback = false;

    $menuItems =  $('.sf-main-menu > li');
    $mainMenu = $('.sf-main-menu');

    if ($menuItems.size() == 5) {
      $mainMenu.addClass('sf-menu-5');
    }
    if ($menuItems.size() == 6) {
      $mainMenu.addClass('sf-menu-6');
    }
    var store = 0;
    var whole = 960;
    var list = jQuery('.sf-menu li.sf-depth-1');
    var count = jQuery('.sf-menu li.sf-depth-1').length;

    jQuery.each(list, function(index, item) {
      store += jQuery(item).width();
    });

    var diff = 960 - (store + (6 * (count -1)));

    jQuery.each(list, function(index, item) {
      jQuery(item).find('.sf-depth-1').css('padding', '12px ' + (diff/(count * 2)) + 'px');
    });


    var maxLength = 540;

    $('.show-read-more').each(function(){
      var myStr = $(this).text();
      if($.trim(myStr).length > maxLength){
        var newStr = myStr.substring(0, maxLength);
        var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
        $(this).empty().html(newStr);
        $(this).append('<a href="javascript:void(0);" class="read-more">Read more  ></a>');
        $(this).append('<span class="more-text">' + removedStr + '</span>');
      }
    });
    $(".read-more").click(function(){
      $(this).siblings(".more-text").contents().unwrap();
      $(this).remove();
    });

    $(".form-text").placeholder = "Search ... ";
  });
})(window, jQuery)


document.addEventListener('DOMContentLoaded', function() {
  Element.prototype.toggleKlass = function(classToToggle) {
    if(this.classList) {
      this.classList.toggle(classToToggle);
    } else {
      var classes = this.className.split(' ');
      var existingIndex = -1;

      for(var i = classes.length; i--;) {
        if(classes[i] === classToToggle) {
          existingIndex = i;
        }
      }
      if(existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(classToToggle);
      }

      this.className = classes.join(' ');
    }
  }
  Element.prototype.containsKlass = function(classToToggle) {
    if(this.classList) {
      return this.classList.contains(classToToggle);
    } else {
      var classes = this.className.split(' ');
      var existingIndex = -1;

      for(var i = classes.length; i--;) {
        if(classes[i] === classToToggle) {
          existingIndex = i;
        }
      }
      if(existingIndex >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  // Mobile Main Menu
  var topMenuLinks = document.querySelectorAll('#block-system-main-menu .menu .menu__item');
  var menuButton =document.querySelector('.menu-button');


  menuButton.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#block-system-main-menu').toggleKlass('show-mobile-menu');
  });

  Array.prototype.forEach.call(topMenuLinks, function(el, index) {
    var backButton = document.createElement('a');
    backButton.innerText = "Back";
    backButton.className += "back-button";
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      el.toggleKlass('is-active');
    });

    if(el.containsKlass('is-expanded')) {
      el.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.toggleKlass('is-active');
      });

      var subList = el.querySelector('ul');
      var mainLink = el.firstChild.cloneNode(true);
      mainLink.className += ' parent-link';
      subList.insertBefore(mainLink, subList.firstChild);
      subList.insertBefore(backButton, subList.firstChild);
    }

  });

  // Move images in DOM
  if (window.innerWidth < 640 && document.querySelector('.section-open-organization')) {
    var images = document.querySelectorAll('.views-field-field-lead-image');

    Array.prototype.forEach.call(images, function(image, index) {
      var parent = image.parentElement;
      parent.insertBefore(image, parent.firstChild);
    });
  }
});