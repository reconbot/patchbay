'use strict'
const h = require('../h')
const fs = require('fs')


exports.needs = {
  suggest_search: 'map', //REWRITE
  build_suggest_box: 'first'
}

exports.gives = {
  search_box: true,
  mcss: true
}

exports.create = function (api) {

  return {
    search_box,
    mcss: () => fs.readFileSync(__filename.replace(/js$/, 'mcss'), 'utf8')
  }
  
  function search_box (go) {
    var search = h('Search', [
      h('input', {
        type: 'search',
        placeholder: 'Commands',
        'ev-click': ev => {
          switch (ev.keyCode) {
            case 13: // enter
              ev.stopPropagation()
              suggestBox.complete()

              if (go(search.value.trim(), !ev.ctrlKey))
                search.blur()
              return
            case 27: // escape
              ev.preventDefault()
              search.blur()
              return
          }
        }
      })
    ])

    search.activate = (sigil, ev) => {
      search.focus()
      ev.preventDefault()
      if (search.value[0] === sigil) {
        search.selectionStart = 1
        search.selectionEnd = search.value.length
      } else {
        search.value = sigil
      }
    }

    var suggestBox = api.build_suggest_box(search, api.suggest_search)

    return search
  }

}

