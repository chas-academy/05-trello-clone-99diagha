import $ from 'jquery';

import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';

// require('webpack-jquery-ui');
import '../css/styles.css';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function() {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$cards = $('.list ul');

    DOM.$addListForm = $('form.add-list');
  }

  function createTabs() {}
  function createDialogs() {}

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$addListForm.on('submit', createList);
    DOM.$board.on('submit', 'form.add-card', createCard);
    DOM.$board.on('click', function(event) {
      let target = event.target;
      if($(target).hasClass('delete')) {
        if($(target).parent().prop("tagName") === "LI") {
          deleteCard(target);
        } else {
          deleteList(target);
        }
      } else if (target.tagName === "LI") {
        //opens card dialog
        console.log("open dialog");
        //$('#dialog').dialog();
      }
    });
    DOM.$board.sortable({
      items: ".list:not(form.add-list)",
      opacity: 0.5,
      cursor: "grabbing"
    });
    DOM.$cards.sortable({
      opacity: 0.5,
      cursor: "grabbing",
      connectWith: ".list ul"
    });
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(event) {
    event.preventDefault();
    let title = $(this).children('input').val();
    if (title !== "") {
      let list = `
        <div class="list">
          <header>
              ${title}
              <button class="delete"></button>
          </header>
          <ul>
             <li>
                Card #1
                <button class="delete"></button>
             </li>
          </ul>
          <footer>
              <form class="add-card" action="index.html">
                  <input type="text" name="title" placeholder="Please name the card" />
                  <button class="add">Add Card</button>
              </form>
          </footer>
        </div>
        `;
      $(list).insertBefore($(this));
      $(this).children('input').val("");
      $(this).children('input').blur();
    }
  }

  function deleteList(target) {
    $(target).closest('.list').remove();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    let title = $(this).children('input').val();
    if (title !== "") {
      let card = `
        <li>
            ${title}
            <button class="delete"></button>
        </li>
        `;
      $(this).parent().siblings('ul').append(card);
      $(this).children('input').val("");
      $(this).children('input').blur();
    }
  }

  function deleteCard(target) {
    $(target).parent().remove();
  }

  // Metod för att rita ut element i DOM:en
  function render() {

  }

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();

    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function() {
  jtrello.init();
});
