<template>
  <v-app>
    <v-card>
      <ul v-for="cell in columnCopy" v-bind:key="cell.sheetRowDef">
        <li>
          {{sheetLayout[cell.sheetRowDef].name}} ( Calculated prio: {{Math.round(1/((cell.data.potentialMax || cell.data.potential)-cell.value+1)*100)/100}})
        </li>
      </ul>
    </v-card>
  </v-app>
</template>

<script>
  export default {
    name: "aiEnemy",
    data() {
      return {
        dicesCopy: null,
        rollCounter: null,
        lastRolls: []
      };
    },
    watch: {
      /* computers turn, triggers after new turn started (1->0)
        lockingDices() loops through all available rolls,
        do_magic() picks highest-prioritized cell and emits its' coordinates
        */
      "state.newTurn": function () {
        if (this.state.computersTurn) {
          this.rollCounter = this.state.allRolls[0].length - 1;
          this.dicesCopy = this.lockingDices();
          this.do_Magic(); // auto-picking my turn the shittiest rolls
        }
      }
    },
    computed: {
      currentPlayer() {
        return this.state.currentPlayer;
      },

      /* sorts the column by value, returns first(=highest) element    */
      columnCopy() {
        if (this.state.computersTurn) {
          let copy = [];
          copy = this.newSheet[this.state.currentPlayer].slice(); // slice to copy array
          copy = this.newSheet[this.state.currentPlayer].filter(
            cell =>
              !(cell.fixed || this.sheetLayout[cell.sheetRowDef].anklickbar === 0)
          ); // filters OUT fixed or anklickbar===0
          // simple bubble-sort that sorts by value within pairs of objects
          if (copy && copy.length > 1) {
            copy.sort((a, b) => {
              if (
                Math.max((a.data.potentialMax || a.data.potential) - a.value, 0) <
                Math.max((b.data.potentialMax || b.data.potential) - b.value, 0)
              ) {
                return -1;
              }
              if (
                Math.max((a.data.potentialMax || a.data.potential) - a.value, 0) >
                Math.max((b.data.potentialMax || b.data.potential) - b.value, 0)
              ) {
                return 1;
              }
              if (a.value > b.value) return -1;
              if (a.value < b.value) return 1;
              return 0;
            });
          }
          return copy;
        }
      }
    },
    methods: {
      /* simple locking of dices, and returning "best" result within all rolls */
      lockingDices() {
        // "best" currently defined as " dice <= 0 gets replaced "
        const rollsAll = this.state.allRolls[0];
        const rollsArray = rollsAll[0].slice().sort(); //initial array
        const loopLengthA = this.rollCounter;
        for (let j = 0; j <= loopLengthA; j++) {
          const nextArray = rollsAll[j + 1]
            ? JSON.parse(JSON.stringify(rollsAll[j + 1].slice()))
            : []; // next array
          this.lastRolls = rollsArray;
          this.$emit("newRolls", {
            rollArray: rollsArray,
            rollCounter: this.rollCounter,
            allRolls: this.dicesCopy,
            source: 0
          }); // emit current array (rollsArray) up to get new newSheet
          this.rollCounter--;
          let list = JSON.parse(
            JSON.stringify(this.newSheet[this.currentPlayer])
          ); // deep-clone the needed column from newSheet
          list = list.filter(
            cell =>
              !(cell.fixed || this.sheetLayout[cell.sheetRowDef].anklickbar === 0)
          ); // filter out fixed cells
          list = !(list.length > 1)
            ? list
            : list.filter(
              cell =>
                !(
                  cell.data.potential === 0 || cell.data.dicesMatch.length === 0
                )
            ); // if there is more then one non-fixed cell, filter out the useless ones
          list.sort((a, b) => {
            if (
              5 / a.data.dicesMissing * a.data.potential >
              5 / b.data.dicesMissing * a.data.potential
            ) {
              return -1;
            }
            if (
              5 / a.data.dicesMissing * a.data.potential <
              5 / b.data.dicesMissing * a.data.potential
            ) {
              return 1;
            }
            if (a.data.potential > b.data.potential) return -1;
            if (a.data.potential < b.data.potential) return 1;
            return 0;
          }); // Prioritize: least missing dices first, then by potential=result
          const aimedCell = list.shift();
          const arrCut = !aimedCell ? [] : aimedCell.data.dicesMatchNot || [];
          if (!rollsAll[j + 1]) break;
          for (let i = 0; i < rollsArray.length; i++) {
            //cut out the "matchNot" out of rollArray
            if (!arrCut || !arrCut[0]) break;
            for (let k = 0; k < arrCut.length; k++) {
              if (rollsArray[i] === arrCut[k]) {
                rollsArray.splice(i, 1);
                i--;
                arrCut.splice(k, 1);
                k--;
              }
            }
          }
          const loopLength = [nextArray.length - rollsArray.length]; // not to use in loop because it changes within loop
          for (let i = 0; i < loopLength; i++) {
            // fill rollArray with elementes from nextArray
            rollsArray.unshift(nextArray[i]);
          }
        }
        return rollsArray;
      },
      /* emits coordinations to fix a cell, based on currentPlayer and row of highest-valued cell */
      do_Magic() {
        // console.log("doing Magic for player: ", this.currentPlayer);
        const deepCopyColumn = JSON.parse(JSON.stringify(this.columnCopy));
        const highestValuedCell = deepCopyColumn.shift();
        if (!highestValuedCell) return;
        /*
        console.log(
          "locked: ",
          this.sheetLayout[highestValuedCell.sheetRowDef].name,
          highestValuedCell.value,
          highestValuedCell
        );
        console.log("________________");*/
        //deepCopyColumn is a sorted-by-value array, with shift it returns first element(highest value) and sheetRowDef gets its' row
        // basically: row of the highest-valued cell
        this.$emit("fixedCell", [
          this.state.currentPlayer,
          highestValuedCell.sheetRowDef
        ]);
      }
    },

    props: ["newSheet", "sheetLayout", "state"]
  };
</script>

<style>
  ul {
    list-style-type: none;
  }
</style>