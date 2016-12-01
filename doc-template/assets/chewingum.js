/*global $, searchableItems */

var Search = (function () {
  var searchElem
  var resultElem
  var resultLinks
  var searchItems
  var filterContainer
  var filterButtons
  var activeFilterRegex

  var inputTerms

  var search = function search () {
    inputTerms = searchElem.val().toLowerCase()
    var results = fuzzyMatch(searchItems, inputTerms)
    if (results.length < 1) {
      // show all
      results = returnAll(searchItems)
    }
    results = formatResults(results)
    resultElem.html(results)
    navigateWithArrowKeys()
  }

  function fuzzyMatch (searchSet, query) {
    var tokens = query.toLowerCase().split('')
    var matches = []
    $.each(searchSet, function (index, item) {
      if (!underActiveTab(item[2])) return true // skip
      var tokenIndex = 0
      var stringIndex = 0
      var matchWithHighlights = ''
      var matchedPositions = []
      var string = item[0].toLowerCase()
      while (stringIndex < string.length) {
        if (string[stringIndex] === tokens[tokenIndex]) {
          matchWithHighlights += highlight(string[stringIndex])
          matchedPositions.push(stringIndex)
          tokenIndex++
          if (tokenIndex >= tokens.length) {
            matches.push({
              match: string,
              highlighted: matchWithHighlights + string.slice(
                stringIndex + 1
              ),
              // Maybe use this to weight matches?
              // More consecutive numbers = higher score?
              positions: matchedPositions,
              src: item[2]
            })
            break
          }
        } else {
          matchWithHighlights += string[stringIndex]
        }
        stringIndex++
      }
    })
    return matches
  }
  function highlight (string) {
    return '<span class="cl-resultlist__highlighted">' + string + '</span>'
  }
  // TODO: make it more simple
  function returnAll (resuts) {
    var output = []
    $.each(resuts, function (index, item) {
      if (underActiveTab(item[2])) {
        output.push({
          highlighted: item[0],
          src: item[2]
        })
      }
    })
    return output
  }
  function formatResults (results) {
    var output = ''

    $.each(results, function (index, item) {
      output += '<li class="cl-resultlist__item"><a class="cl-resultlist__link" href="' + item.src + '" role="button">' +
                  '<span class="cl-resultlist__ellipsis">' +
                    '<span class="cl-resultlist__text">' + item.highlighted + '</span> ' +
                    '<span class="cl-resultlist__descr">' + item.src + '</span>' +
                  '</span>' +
                '</a></li>'
    })
    return output
  }

  function underActiveTab (path) {
    if (path.match(activeFilterRegex)) {
      return true
    } else {
      return false
    }
  }

  function addFilter (tabs) {
    var filterHtml = ''
    $.each(tabs, function (index, item) {
      var filterItemActive = ''
      if (index === 0) {
        filterItemActive = ' cl-filter__button--active'
        activeFilterRegex = item.regex
      }
      filterHtml += '<li class="cl-filter__item">' +
                  '<button class="cl-filter__button' + filterItemActive + '" data-regex="' + item.regex + '" role="button">' +
                    item.title +
                  '</button>' +
                '</li>'
    })
    filterContainer.html(filterHtml)
  }

  // to support WCAG 2.0
  function navigateWithArrowKeys () {
    resultLinks = $('.cl-resultlist__link', '.cl-resultlist')
    // console.log($('.cl-resultlist__link', '.cl-resultlist'))
    var keys = {
      esc: 27,
      up: 38,
      down: 40
    }
    // from search go to results
    searchElem.keydown(function (event) {
      if (event.which === keys.down) {
        event.preventDefault()
        resultLinks[0].focus()
      } else if (event.which === keys.esc) {
        event.preventDefault()
        searchElem.val('')
      }
    })
    resultLinks.each(function () {
      $(this).keydown(function (event) {
        // go down & loop
        if (event.which === keys.down) {
          event.preventDefault()
          var $next = $(this).parent().next().children()
          console.log($next)
          if ($next.length) {
            $next.focus()
          } else {
            resultLinks[0].focus()
          }
        // go up and stop at search
        } else if (event.which === keys.up) {
          event.preventDefault()
          var $prev = $(this).parent().prev().children()
          if ($prev.length) {
            $prev.focus()
          } else {
            searchElem.select()
          }
        // hit esc - go to search
        } else if (event.which === keys.esc) {
          event.preventDefault()
          searchElem.select()
        }
      })
    })
  }

  function bindUIActions () {
    // when entering phrase call fuzzyMatch
    searchElem.bind('keyup', function () {
      search()
    })
    searchElem.keyup()

    // when filter button clicked
    filterButtons = $('.cl-filter__button', '.cl-filter')
    filterButtons.each(function () {
      $(this).bind('click', function () {
        if ($(this).hasClass('cl-filter__button--active')) return
        filterButtons.removeClass('cl-filter__button--active')
        $(this).addClass('cl-filter__button--active')

        activeFilterRegex = $(this).data('regex')
        search()

        searchElem.select()
      })
    })
  }

  return {
    init: function (searchId, resultsId, searchableItems, filterItems) {
      if (!window.jQuery) {
        console.warn('Error: jQuery is not loaded')
        return
      }
      if (typeof $('#' + searchId) === 'undefined' || typeof $('#' + resultsId) === 'undefined') {
        console.warn('Warning: Search or SearchResult element doesn\'t exist')
        return
      }
      searchElem = $('#' + searchId)
      resultElem = $('#' + resultsId)
      searchItems = searchableItems

      if (!(typeof filterItems === 'undefined')) {
        filterContainer = $('.cl-filter')
        addFilter(filterItems)
      }

      bindUIActions()
    }
  }
})()

var filterItems = [
  {
    "title": "All",
    "regex": ""
  },
  {
    "title": "Atoms",
    "regex": "00-atoms"
  },
  {
    "title": "Molecules",
    "regex": "01-molecules"
  },
  {
    "title": "Organisms",
    "regex": "02-organisms"
  }
]

Search.init('searchBox', 'searchResults', searchableItems, filterItems)

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
