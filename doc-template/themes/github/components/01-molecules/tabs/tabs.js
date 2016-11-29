/*globals $ */
var Tabs = (function () {
  var tabs = $('.cl-tabs')

  function bindUIActions () {
    tabs.each(function () {
      bindToggle.call(this)
    })
  }

  function bindToggle () {
    var container = $(this)
    var tabs = $('.cl-tabs__item', container)
    var panels = $('.cl-tabs__panel', container)
    tabs.bind('click', function () {
      // reset every single tab & panel
      tabs.each(function () {
        $(this).attr('aria-selected', false)
      })
      panels.each(function () {
        $(this).attr('aria-hidden', true)
      })
      // set right one active
      $(this).attr('aria-selected', true)
      var panelId = $(this).attr('aria-controls')
      $('#' + panelId).attr('aria-hidden', false)
    })
  }

  return {
    init: function () {
      if (!window.jQuery) {
        console.warn('Error: jQuery is not loaded')
        return
      }
      if (typeof $('.cl-tabs')[0] === 'undefined') {
        console.warn('Warning: Tabs doesn\'t exist')
        return
      }
      bindUIActions()
    }
  }
})()
Tabs.init()
