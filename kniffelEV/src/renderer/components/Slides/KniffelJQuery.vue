<template>
  <v-app>
    <div class="container-fluid">
      <div class="Kniffel_box container">
        <h3>Kniffel</h3>
        <v-layout row wrap>
          <v-flex md7 class="kniffel_left container">
            <div class="kniffel_sheet container-fluid co">
              <h4>Sheet</h4>
            </div>
          </v-flex>
          <v-flex md5 class="kniffel_right container">
            <v-btn type="button" id="button_sheet_settings" class="button">Show/Hide settings</v-btn>
            <div class='kniffel_settings container' style='display: none'>
              <ul>
                <li>
                  <label for="player_count">Amount of players:</label>
                  <input id='player_count' type='number' value='1' list='' placeholder='Players from 1 to over 9000...not really, max. 6' min='1'
                    max='6'>
                </li>
                <li>
                  <label for="dice_count">Number of dices:</label>
                  <input id='dice_count' type='number' value='5' list='' placeholder='1-10' min='1' max='10'>
                </li>
                <li>
                  <label for="roll_count">Number of rolls:</label>
                  <input id='roll_count' type='number' value='3' list='' placeholder='1-10' min='1' max='10'>
                </li>
                <li>
                  <label for="dice_sort">Sort the dice?</label>
                  <input id='dice_sort' type='checkbox' value='0'>
                </li>
              </ul>
              <v-btn type="button" id="button_sheet_reset" class="button">reset</v-btn>
            </div>
            <div class="kniffel_rolls container">
              <h4>rolls</h4>
              <v-btn type="button" id="button_roll" class="button roll">roll!</v-btn>
              <v-btn type="button" id="button_undo" class="button undo" disabled>Undo select</v-btn>
              <p>Remaining rolls:
                <span id='remaining_rolls'>3</span>
              </p>
              <!--    
                            <button type="button" id="button_nextTurn" class="button roll">next turn!</button>                        
                            -->
            </div>
            <div class="kniffel_win container" style='display: none'>
              <h4>Game Finished</h4>
              <p id='winningText'></p>
              <v-btn type="button" id="button_sheet_newGame" class="button">new Game</v-btn>
            </div>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex md6>
            <ul style='text-align: left; position: relative; left: 20%;'>
              <br> Features
              <li>change amount of columns=players (max 6)</li>
              <li>sort dices when none are fixed
                <br> (maybe add possibility to sort fixed dices, too)</li>
            </ul>
          </v-flex>
          <v-flex md6>
            <ul style='text-align: left; position: relative; left: 20%;'>
              <br> to do, bugs/features
              <li>sort out the (useless) classes</li>
              <li>add child to dice-divs for easier/better CSS</li>
              <li>variable dice-amount (between 1 and 10 dices?!)</li>
              <li>extra lines in sheet</li>
              <li>...</li>
            </ul>
          </v-flex>
        </v-layout>
      </div>
    </div>
    </div>
    </div>
    <!--
    </body>
    
    </html>-->
  </v-app>
</template>

<script>
  /* eslint-disable */
  import $ from "jquery"

  /* eslint-env jquery */ // settings for ESLint
  $(document).ready(function () {

    /*
        ------------------------------------------------------------------------------------------------------------
                        some objects and variables:
        ------------------------------------------------------------------------------------------------------------
    */

    var currentPlayer; // has to start at 0 (or blank)
    var remaining_rolls; // gets the value during newTurn (included in newGame)

    var rollsArray = []; // no easy/obvious way to get rid of this "global" variable for now

    var sheetSettings = {
      player_amount: 0, // get new player-count from the form-element
      dice_amount: 0, // get new dice-count from the form-element
      roll_amount: 0,
      adjust_settings: function () {
        this.player_amount = parseInt($('#player_count').val());
        this.dice_amount = parseInt($('#dice_count').val());
        this.roll_amount = parseInt($('#roll_count').val());
      },
    }

    // to make "Undo select" work
    var lastTurn = {
      rolls: '',
      player: '',
      cell: '',
      remainingRolls: '',
      state: '',
    }

    // helper for sheet, bundles classes for created table-rows/cells
    var classes = {
      blockAll: '  ',
      block1: function () {
        return this.blockAll + " " + 'block1 clickable ';
      },
      block2: function () {
        return this.blockAll + " " + 'block2 ';
      },
      block3: function () {
        return this.blockAll + " " + 'block3 clickable';
      },
    }

    // has all the info about the rows, used to create and fill the table
    var sheet = [{
      name: "-",
      classBlock: classes.blockAll + ' header',
      methode: 'none',
      line: 'tl0',
    },
    {
      name: "Einer",
      classBlock: classes.block1(),
      methode: 'matching',
      line: 'tl1',
      sums: '1'
    },
    {
      name: "Zweier",
      classBlock: classes.block1(),
      methode: 'matching',
      line: 'tl2',
      sums: '2'
    },
    {
      name: "Dreier",
      classBlock: classes.block1(),
      methode: 'matching',
      line: 'tl3',
      sums: '3'
    },
    {
      name: "Vierer",
      classBlock: classes.block1(),
      methode: 'matching',
      line: 'tl4',
      sums: '4'
    },
    {
      name: "Fünfer",
      classBlock: classes.block1(),
      methode: 'matching',
      line: 'tl5',
      sums: '5'
    },
    {
      name: "Sechser",
      classBlock: classes.block1(),
      methode: 'matching',
      line: 'tl6',
      sums: '6'
    },
    {
      name: "Summe oben",
      classBlock: classes.block2() + 'sum_upper',
      methode: 'sum_sums',
      line: 'tl7',
      sums: '.block1.fixed',
    },
    {
      name: "Bonus bei 63 oder mehr",
      classBlock: classes.block2() + 'bonus_upper',
      methode: 'bonus_oben',
      line: 'tl8',
    },
    {
      name: "gesamt oberer Teil",
      classBlock: classes.block2() + 'total_upper0',
      methode: 'sum_sums',
      line: 'tl9',
      sums: '.sum_upper, .bonus_upper',
    },
    {
      name: "Dreierpasch",
      classBlock: classes.block3(),
      methode: 'pasch',
      line: 'tl10',
      sums: '3',
    },
    {
      name: "Viererpasch",
      classBlock: classes.block3(),
      methode: 'pasch',
      line: 'tl11',
      sums: '4',
    },
    {
      name: "Full-House",
      classBlock: classes.block3(),
      methode: 'fullHouse',
      line: 'tl12',
    },
    {
      name: "Kleine Straße",
      classBlock: classes.block3(),
      methode: 'kleineStraße',
      line: 'tl13',
    },
    {
      name: "Große Straße",
      classBlock: classes.block3(),
      methode: 'großeStraße',
      line: 'tl14',
    },
    {
      name: "Kniffel",
      classBlock: classes.block3(),
      methode: 'Kniffel',
      line: 'tl15',
      sums: '5',
    },
    {
      name: "Chance1",
      classBlock: classes.block3(),
      methode: 'Chance',
      line: 'tl16',
    },
    {
      name: "Chance2",
      classBlock: classes.block3(),
      methode: 'Chance',
      line: 'tl120',
    },
    {
      name: "Chance3",
      classBlock: classes.block3(),
      methode: 'Chance',
      line: 'tl21',
    },
    {
      name: "gesamt unterer Teil",
      classBlock: classes.block2() + 'total_lower',
      methode: 'sum_sums',
      line: 'tl17',
      sums: '.block3.fixed',
    },
    {
      name: "gesamt oberer Teil",
      classBlock: classes.block2() + 'total_upper',
      methode: 'sum_sums',
      line: 'tl99',
      sums: '.sum_upper, .bonus_upper',
    },
    {
      name: "Endsumme",
      classBlock: classes.block2() + 'total_total',
      methode: 'sum_sums',
      line: 'tl19',
      sums: '.total_upper, .total_lower',
    },
    ]

    /*
        ------------------------------------------------------------------------------------------------------------
                        browser interactions, all those mouse-clicks
        ------------------------------------------------------------------------------------------------------------
    */

    /* When 'new game' button is discovered and clicked, make new game...duuh */
    $("body").on('click', '#button_sheet_newGame, #button_sheet_reset', function () {
      newGame();
    })
    $("body").on('click', '#button_sheet_settings', function () {
      $('.kniffel_settings').toggle();
    })

    /*  When 'roll' button is clicked:
        - roll dices,
        - refresh remainingRolls-counter
        - mark click-able cells
        - fill the sheet
        - and save needed information as lastTurn */
    $('#button_roll').click(function () {
      roll();
      remainingRolls();
      $(".player" + currentPlayer).not('.fixed').addClass('active');
      fill();
      $('#button_undo').prop('disabled', true);

      lastTurn.rolls = rollsArray;
      lastTurn.player = currentPlayer;
      lastTurn.remainingRolls = remaining_rolls;
    })

    /*  Undo last pick:
        - get remaining rolls from last turn (the +1 evens the decrement during remainingRolls)
        - disables undo-button (until cell-click activates it again)
        - un-fixes the last fixed element
        - rolls back currentPlayer (because fixing a cell instantly jumps to next player via newTurn)
        - activates any un-fixed elements of "last"->current player
        - feeds last rolls to fill() to complete the undo-function */
    $('#button_undo').click(function () {
      remaining_rolls = lastTurn.remainingRolls + 1;
      remainingRolls();
      $('#button_undo').prop('disabled', true);
      currentPlayer = lastTurn.player;
      $(lastTurn.cell).removeClass('fixed');
      $(".player" + lastTurn.player).not('.fixed').addClass('active');
      fill(lastTurn.rolls) //works without parameter, too, since dices don't reset until new roll. Parameter is just in case
    })

    /*  Click on a valid/active cell.
        - fixes the clicked cell and returns flag(endFlag) on whether it was last cell to fix
        - fixSelf also deactivates other cells to prevent useless clicks
        - saves the pointer to this cell under lastTurn for the undo-function
        - newTurn initiates new turn and/or game end
        - enables the undo-button to be used */
    $("body").on('click', '.clickable.active.currentPlayer', function () {
      let endFlag = fixSelf($(this));
      lastTurn.cell = this;
      newTurn(endFlag);
      $('#button_undo').prop('disabled', false);
    })

    /*  Click on dice to toggle fix, not possible when newTurn about to start */
    $('body').on('click', '.dice', function () {
      if (remaining_rolls == sheetSettings.roll_amount) { return; }
      let thisObject = $(this);
      $(thisObject).toggleClass('dice-available');
    })


    /*
        ------------------------------------------------------------------------------------------------------------
                        the main functions
        ------------------------------------------------------------------------------------------------------------
    */

    /*  Fixes a cell so its' value get thrown into calculations later.
        - Also, checks whether any moves are left (active cells)
        - and returns a flag for potential end of the game */
    function fixSelf(thisObject) {
      $(thisObject).removeClass('active').addClass('fixed');
      $('.currentPlayer.active').removeClass('active');
      let x = $(".columns.clickable").not('.fixed').length;
      return x == 0 ? 1 : 0;
    }

    /*  Ends last and initializes new turn:
        - ends game if(!) last turn was literally "last" turn, flagged as endFlag==1
        - activates roll-button
        - resets roll-counter
        - recalculates the sheet with a rollArray of an empty array (either [] or [0,...,0]) (so it only does the sum-functions)
            array of zeros instantly exits the calculation-functions with returns of 0. so they do not trigger yahzee/kniffel or full-house
        - deactivates any clickable cells and removes cleans up currentPlayer-tags
        - cycles to next player via modulo-operation */
    function newTurn(endFlag) {
      $('#button_roll').prop('disabled', false);
      remaining_rolls = sheetSettings.roll_amount + 1;
      remainingRolls();
      $('.dice').addClass('dice-available');
      // at flag==2, fill() will be skipped. flag==2 occurs after newGame(), so fill() doesn't produce bugs with currentPlayer being 0.
      endFlag == 2 ? 0 : fill([]);
      endFlag == 1 ? finishedGame() : 0;
      $('.currentPlayer').removeClass('currentPlayer').removeClass('active');
      currentPlayer = (currentPlayer % sheetSettings.player_amount) + 1; //modulo-operation to cycle between several players
    }

    /*  Ends last and initializes new game:
        - removes old table (easier then cleaning it)
        - generates new table
        - hides the win-Box
        - initializes new turn, see newTurn() with the flag 2 to skip fill() */
    function newGame() {
      currentPlayer = 0; //resets to 0, it increments to 1 during newTurn().
      sheetSettings.adjust_settings();
      generate_sheet();
      generate_dices();
      $('div.container.kniffel_rolls').show();
      $('.kniffel_win').hide();
      newTurn(2);
    }

    /*  Rolls the dices:
        - rolls dices and writes the numbers into the element as: integer into dataset, unicode into html
        - getRollsArray has a for-loop to read out the data-set of all the dices, returns sorted array with rolls.
        - if sort-dice is checked, re-arranges the visual dices (only if no dices are fixed. too much workaround to fix that) */
    function roll() {
      var numDices = $('.dice').length;

      if (numDices) {
        for (var i = 1; i <= numDices; i++) {
          let k = Math.floor(Math.random() * 6) + 1;
          let transformArg = diceTransform(); // just some visuals: adds random rotation and translation on x- and y-axis
          $('#roll' + i + '.dice-available').html(charDice(k)).data('dice_value', k).css('transform', transformArg);
        }

        rollsArray = getRollsArray();

        if ($('#dice_sort:checked').length && $('.dice-available').length == $('.dice').length) {
          for (var i = 1; i <= numDices; i++) {
            $('#roll' + i + '').html(charDice(rollsArray[i - 1])).data('dice_value', rollsArray[i - 1]);
          }
        }
      }
    }

    /*  keeps track of rolls:
        - deactivates roll-Button when it's time
        - adjusts the button-text */
    function remainingRolls() {
      remaining_rolls--;
      $('#remaining_rolls').text(remaining_rolls);
      if (remaining_rolls <= 0) {
        $('#button_roll').prop('disabled', true).text('No rolls left');
      } else if (remaining_rolls == sheetSettings.roll_amount) {
        $('#button_roll').text('New Turn');
      } else {
        $('#button_roll').text('Roll');
      }
    }

    /*  That's where the magic happens:
        - gets rollsArray either from the rolls, or from overridden pre-set
        - goes through the sheet-object and runs individual methods for all the lines
        - while in loop, fills the sheet with those calculated numbers */
    function fill(rollsOverride) {
      rollsOverride ? rollsArray = rollsOverride : rollsArray = getRollsArray();
      for (let i = 0; i < sheet.length; i++) {
        $("#" + sheet[i].line + "_" + currentPlayer).addClass('currentPlayer');
        let x = lineFunctions[sheet[i].methode](rollsArray, i) || 0;
        $("#" + sheet[i].line + "_" + currentPlayer).not('.fixed').text(x);
      }
    }

    /*  generates the sheet:
        - similar as above: generates table based on sheet-Object
        - creates the table "in air", and appends to a specific div when it's generated */
    function generate_sheet() {
      $('#table1').remove();
      let j = 0;
      let idle = Math.max(4 - sheetSettings.player_amount, 0);

      let table = $('<table>').attr('id', 'table1').addClass('table1');
      for (let i = 1; i < sheet.length; i++) {
        let newColumns = "<td class='" + sheet[i].classBlock + " categories'" + "id='" + sheet[i].line + "_" + 0 + "'>" + sheet[i].name + "</td>";
        for (j = 1; j <= sheetSettings.player_amount; j++) {
          newColumns += "<td class='" + sheet[i].classBlock + " columns player" + j + "'" + "id='" + sheet[i].line + "_" + j + "'>0</td>";
        }
        if (idle) {
          for (j; j < (parseInt(idle) + parseInt(sheetSettings.player_amount) + 1); j++) {
            newColumns += "<td class='" + sheet[i].classBlock + " idle'" + "id='" + sheet[i].line + "_" + j + "'></td>";
          }
        }
        let row = $('<tr>').addClass('rowClasses').append(newColumns);
        $(table).append(row);
      }
      $(".kniffel_sheet").append(table);
    }
    /*  generates the container including dices:
        - creates and appends the container (to kniffel_rolls div)
        - creates and appends rows for every 3 dices (3 dices/row max.) (to container)
        - creates and appends dices to the new rows until finished (to container) */
    function generate_dices() {
      let j = 0;
      $('.dice_container').remove();
      let dice_container = $('<div>').addClass('dice_container');
      $('.kniffel_rolls').append(dice_container);
      for (let i = 1; i <= sheetSettings.dice_amount; i++) {
        if (i % 3 == 1) {
          j++;
          let newRow = $('<div>').addClass('row').attr('id', 'dicesRow' + j)
          $('.dice_container').append(newRow);
        }
        let newDice = $('<div>').addClass('dice dice-available col').attr("id", "roll" + i);
        $('#dicesRow' + j).append(newDice);
      }
    }


    /* Object with functions for all methods for all lines */
    var lineFunctions = {
      highestPasch: function (asdf) {
        let x = 1, highest = 1;
        for (let i = 0; i <= asdf.length; i++) {
          if (asdf[i] == asdf[i + 1]) {
            x++;
          } else {
            highest = Math.max(highest, x);
            x = 1;
          }
        }
        return highest;
      },
      pasch: function (asdf, i) {
        let highest = this.highestPasch(asdf);
        if (highest >= sheet[i].sums) {
          return arraySum(asdf);
        }
        return 0;
      },
      matching: function (asdf, i) {
        asdf ? rollsArray = asdf : 0;
        let x = arraySum(rollsArray.filter(function (jk) {
          return jk == sheet[i].sums;
        }))
        return x;
      },
      fullHouse: function (asdf) {
        asdf ? rollsArray = asdf : 0;
        if (/[1-6]/g.test(rollsArray) &&
          rollsArray[0] === rollsArray[1] &&
          rollsArray[3] === rollsArray[4] &&
          (rollsArray[0] === rollsArray[2] || rollsArray[4] === rollsArray[2])) {
          return 25;
        }
        return 0;
      },
      kleineStraße: function (asdf) {
        asdf ? rollsArray = asdf : 0;
        var rollsArray = removeDuplicate(rollsArray);
        for (let i = 0; i < 2; i++) {
          if (rollsArray[i] === rollsArray[i + 1] - 1 &&
            rollsArray[i] === rollsArray[i + 2] - 2 &&
            rollsArray[i] === rollsArray[i + 3] - 3) {
            return 30;
          }
        }
        return 0;
      },
      großeStraße: function (asdf) {
        asdf ? rollsArray = asdf : rollsArray;
        var rollsArray = removeDuplicate(rollsArray);
        if (rollsArray[0] === rollsArray[1] - 1 &&
          rollsArray[0] === rollsArray[2] - 2 &&
          rollsArray[0] === rollsArray[3] - 3 &&
          rollsArray[0] === rollsArray[4] - 4) {
          return 40;
        }
        return 0;
      },
      Kniffel: function (asdf, i) {
        let highest = this.highestPasch(asdf);
        if (highest >= sheet[i].sums) {
          return 50;
        }
        return 0;
      },
      Chance: function (asdf) {
        asdf ? rollsArray = asdf : 0;
        return arraySum(rollsArray) || 0;
      },
      none: function () {

      },
      sum_sums: function (asdf, i) {
        let sum_current = 0;
        let found = $(sheet[i].sums + '.currentPlayer');
        for (let i = 0; i < found.length; i++) {
          sum_current += parseInt($('#' + found[i].id + '.currentPlayer').html()) || 0;
        }
        return sum_current;
      },
      bonus_oben: function () {
        let bonus_var = 0;
        $('#tl7_' + currentPlayer).text() >= 63 ? bonus_var = 35 : 0
        return bonus_var;
      },
    }

    /*
    ------------------------------------------------------
        some helping functions
    ------------------------------------------------------
    */
    function finishedGame() {
      $('div.container.kniffel_rolls').hide();
      $('div.container.kniffel_win').show();
      let winningTextString = '';
      for (let i = 1; i <= Math.min(sheetSettings.player_amount, 4); i++) {
        winningTextString += 'Player' + i + ' scored: ' + $('.total_total.player' + i + '').html() + '<br>';
      }
      $('#winningText').html(winningTextString);
    }



    /*  swaps between chars and unicode set in charDicePairs variable
        - loops through the columns and the rows of the Array
        - returns the swapped result */
    var charDicePairs = [
      [1, '\u2680'],
      [2, '\u2681'],
      [3, '\u2682'],
      [4, '\u2683'],
      [5, '\u2684'],
      [6, '\u2685'],
    ]
    function charDice(asdf) {
      //console.log(asdf);
      for (let j = 0; j < 2; j++) {
        for (let i = 0; i < charDicePairs.length; i++) {
          switch (asdf) {
            case charDicePairs[i][j]:
              asdf = charDicePairs[i][(1 - j)];
              return asdf;
          }
        }
      }
    }
    /*      trying to enclose the variable with function so it's
        - not global,
        - but also doesn't get declared each new function-call
    (function (){
        var charDicePairs = [
            [1, '\u2680'],
            [2, '\u2681'],
            [3, '\u2682'],
            [4, '\u2683'],
            [5, '\u2684'],
            [6, '\u2685'],
        ]
        function charDice(asdf) {
            //console.log(asdf);
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < charDicePairs.length; i++) {
                    switch (asdf) {
                        case charDicePairs[i][j]:
                            asdf = charDicePairs[i][(1 - j)];
                            return asdf;
                    }
                }
            }
        }
        return charDice(asdf);
    }());
    */
    /*  returns an array containing dice-rolls:
        - loops through available dices and fills an aray with dice-values
        - sorts that array and returns it */
    function getRollsArray() {
      let numDices = $('.dice').length;
      for (let i = 1; i <= numDices; i++) {
        rollsArray[i - 1] = parseInt($('#roll' + i).data('dice_value'));
      }
      rollsArray = rollsArray.sort();
      return rollsArray;
    }

    /*  creates the parameter with random values for css transform
        - streight forward random-method for:
        -   - rotation between 1 and 360 degrees
        -   - translation on x- and y-axis between 1 and 10 px
        - returns the combined string */
    function diceTransform() {
      let angle = Math.floor(Math.random() * 360) + 1;
      angle = angle + 'deg';
      let translX = Math.floor(Math.random() * 10) + 1;
      translX = translX + 'px';
      let translY = Math.floor(Math.random() * 10) + 1;
      translY = translY + 'px';
      let transformArg = 'rotate(' + angle + ') translate(' + translX + ', ' + translY + ')';
      return transformArg
    }

    // copy paste aus'm netz, Summenfunktion für Arrays mit neuer EC6(?)-Schreibweise
    function arraySum(array) {
      if (!array.length) {
        return 0;
      }
      const add = (a, b) => parseInt(a) + parseInt(b);
      const sum = array.reduce(add);
      return sum;
    }

    // copy paste aus'm netz, nutzt neue EC6(?)-funktion, um nur unique elemente zu bekommen.
    function removeDuplicate(arr) {
      let unique_array = Array.from(new Set(arr));
      return unique_array;
    }

    /*
    ------------------------------------------------------
        initializing the game for first time
        - including newTurn()
    ------------------------------------------------------
    */

    newGame();




    /*
    ------------------------------------------------------
    storeroom/graveyard for testing-"tools" i'm too lazy to rewrite if i ever need them again
    ------------------------------------------------------
    */

    /*
        var test = 1;
        test==1 ? test_sheet() : 0;
  
        function test_sheet() {
            var testForeign = [1, 2, 3, '-', 5];
            var testNone = [1, 2, 2, 3, 5];
            var test3er1 = [1, 2, 2, 4, 5]
            var test3er2 = [1, 2, 2, 2, 5];
            var test4er1 = [1, 2, 2, 2, 5];
            var test4er2 = [1, 2, 2, 2, 2];
            var testFH1 = [1, 2, 2, 2, 5];
            var testFH2 = [1, 1, 2, 2, 2];
            var testkS1 = [1, 3, 4, 5, 6];
            var testkS2 = [1, 2, 2, 3, 4];
            var testgS1 = [1, 2, 3, 4, 5];
            var testgS2 = [2, 3, 4, 5, 6];
            var testK1 = [1, 2, 2, 2, 2];
            var testK2 = [2, 2, 2, 2, 2];
            console.log('TESTS-START');
            console.log('3erPasch testForeign', testForeign, lineFunctions.dreierPasch(testForeign));
            console.log('3erPasch testNone', testNone, lineFunctions.dreierPasch(testNone));
            console.log('3erPasch test3er1', test3er1, lineFunctions.dreierPasch(test3er1));
            console.log('3erPasch test3er2', test3er2, lineFunctions.dreierPasch(test3er2));
            console.log('4erPasch testForeign', testForeign, lineFunctions.viererPasch(testForeign));
            console.log('4erPasch testNone', testNone, lineFunctions.viererPasch(testNone));
            console.log('4erPasch test4er1', test4er1, lineFunctions.viererPasch(test4er1));
            console.log('4erPasch test4er2', test4er2, lineFunctions.viererPasch(test4er2));
            console.log('Full-House testForeign', testForeign, lineFunctions.fullHouse(testForeign));
            console.log('Full-House testNone', testNone, lineFunctions.fullHouse(testNone));
            console.log('Full-House testFH1', testFH1, lineFunctions.fullHouse(testFH1));
            console.log('Full-House testFH2', testFH2, lineFunctions.fullHouse(testFH2));
            console.log('kleineStraße testForeign', testForeign, lineFunctions.kleineStraße(testForeign));
            console.log('kleineStraße testNone', testNone, lineFunctions.kleineStraße(testNone));
            console.log('kleineStraße testkS1', testkS1, lineFunctions.kleineStraße(testkS1));
            console.log('kleineStraße testkS2', testkS2, lineFunctions.kleineStraße(testkS2));
            console.log('großeStraße testForeign', testForeign, lineFunctions.großeStraße(testForeign));
            console.log('großeStraße testNone', testNone, lineFunctions.großeStraße(testNone));
            console.log('großeStraße testgS1', testgS1, lineFunctions.großeStraße(testgS1));
            console.log('großeStraße testgS2', testgS2, lineFunctions.großeStraße(testgS2));
            console.log('Kniffel testForeign', testForeign, lineFunctions.Kniffel(testForeign));
            console.log('Kniffel testNone', testNone, lineFunctions.Kniffel(testNone));
            console.log('Kniffel testK1', testK1, lineFunctions.Kniffel(testK1));
            console.log('Kniffel testK2', testK2, lineFunctions.Kniffel(testK2));
            console.log('TESTS-ENDE');
  
        }
    */

    /*
        $('#button_sheet_initialize').click(function () {
            sheet_fill();
        });
  
        function sheet_fill() {
            for (i = 0; i < sheetSettings.player_amount; i++) {
                $("#tl1_" + (1 + i)).html(Math.round(Math.random() * 5) * 1);
                $("#tl2_" + (1 + i)).html(Math.round(Math.random() * 5) * 2);
                $("#tl3_" + (1 + i)).html(Math.round(Math.random() * 5) * 3);
                $("#tl4_" + (1 + i)).html(Math.round(Math.random() * 5) * 4);
                $("#tl5_" + (1 + i)).html(Math.round(Math.random() * 5) * 5);
                $("#tl6_" + (1 + i)).html(Math.round(Math.random() * 5) * 6);
                $("#tl7_" + (1 + i)).html(0);
                $("#tl7_" + (1 + i)).addClass('font-weight-bold');
                $("#tl8_" + (1 + i)).html(0);
                $("#tl8_" + (1 + i)).addClass('font-weight-bold');
                $("#tl9_" + (1 + i)).html(0);
                $("#tl9_" + (1 + i)).addClass('font-weight-bold');
                $("#tl10_" + (1 + i)).html(Math.round(Math.random() * 3) * 6 + Math.round(Math.random() * 6) + Math.round(Math.random() * 6));
                $("#tl11_" + (1 + i)).html(Math.round(Math.random() * 4) * 6 + Math.round(Math.random() * 6));
                $("#tl12_" + (1 + i)).html(Math.round(Math.random() * 1) * 25);
                $("#tl13_" + (1 + i)).html(Math.round(Math.random() * 1) * 30);
                $("#tl14_" + (1 + i)).html(Math.round(Math.random() * 1) * 40);
                $("#tl15_" + (1 + i)).html(Math.round(Math.random() * 1) * 50);
                $("#tl16_" + (1 + i)).html(Math.round(Math.random() * 6) + Math.round(Math.random() * 6) + Math.round(Math.random() * 6) + Math.round(Math.random() * 6) + Math.round(Math.random() * 6));
                $("#tl17_" + (1 + i)).html(0);
                $("#tl17_" + (1 + i)).addClass('font-weight-bold');
                $("#tl18_" + (1 + i)).html(0);
                $("#tl18_" + (1 + i)).addClass('font-weight-bold');
                $("#tl19_" + (1 + i)).html(0);
                $("#tl19_" + (1 + i)).addClass('font-weight-bold');
            }
  
        }
    */



  })
</script>
<style>
  .Kniffel_box .table1 td {
    border: 1px;
    border-style: solid;
    border-width: 1px;
    padding: 0 10px 0 10px;
    min-width: 57px;
    text-shadow: 0 0 1px white;
  }

  .Kniffel_box .kniffel_sheet {
    border-style: none;
  }


  .Kniffel_box .button {
    margin: 15px;
    width: 150px;
    color: black
  }


  .Kniffel_box .dice {
    height: 48px;
    max-height: 48px;
    width: 48px;
    max-width: 48px;
    margin: 2px;
    border: 0px;
    padding: 0px;
    border-radius: 5px;
    border-style: solid;
    text-align: center;
    font-size: 3em;
    line-height: 40px;

  }

  .Kniffel_box .dice {
    background: rgba(255, 0, 0, 0.5);
  }

  .Kniffel_box .dice.dice-available {
    background: rgba(172, 255, 47, 0);
  }

  .Kniffel_box div .table1 {
    background: rgb(220, 220, 220);
    border-style: solid;
    border-width: 1px;
    box-shadow: rgb(50, 50, 50) 5px 5px 15px;
    margin: auto;
  }

  .Kniffel_box td.columns.active.clickable:hover {
    cursor: pointer;
  }

  .Kniffel_box td.categories {
    font-style: italic
  }

  .Kniffel_box .kniffel_rolls .row {
    margin: auto;
    justify-content: center;
  }

  .Kniffel_box td.columns {
    border-left-width: 3px;
    border-left-style: double;
    padding: 0 15px 0 15px;
    font-weight: 600;
  }

  .Kniffel_box .table1 td.fixed {
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.4) inset;
  }

  .Kniffel_box td.block2 {
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.4) inset;
    font-weight: 700;
  }

  .Kniffel_box .table1 td.currentPlayer {
    font-weight: 900;
    font-style: italic;
  }

  .Kniffel_box .container {
    padding: 20px;
    background: #FFFFFF;
    border-style: groove;
    border-width: 2px;
    border-color: #000000;
    border-radius: 15em 5em / 5em 15em;
    box-shadow: #000000 15px 15px 30px;
    text-align: center;
    align-self: center;
  }

  .Kniffel_box .container-fluid {
    margin: 20px;
  }

  .Kniffel_box td.player1 {
    background: rgba(0, 0, 255, 0.3);
  }

  .Kniffel_box .player2 {
    background: rgba(0, 255, 0, 0.3);
  }

  .Kniffel_box .player3 {
    background: rgba(255, 0, 0, 0.3);
  }

  .Kniffel_box .player4 {
    background: rgba(0, 255, 255, 0.3);
  }

  .Kniffel_box .kniffel_right {
    align-self: auto;
  }

  .Kniffel_box .kniffel_left {
    align-self: auto;
  }
</style>