<template>
  <v-app>
    <div class="Kniffel">
      <v-container fluid>
        <v-layout row wrap>
          <v-flex d-flex xs12 sm6 md4>
            <v-layout>
              <v-flex d-flex>
                <v-card>
                  <div class='sheet'>
                    <sheet v-model="state.rollsArray" v-on:fixedCell='fixCell' v-bind:sheetDataJSON='JSON.stringify(sheetData)' v-bind:sheetLayout='sheet'
                      v-bind:state='state'></sheet>
                    <div class='sheet'>
                      <v-btn :ripple="false" @click="undo_turn()" :disabled="(state.newTurn==0)" :class="{highlighted: state.newTurn==1}">{{undoButton}}</v-btn>
                      <v-btn :ripple="false" @click="new_game()" :class="{highlighted: state.newGame==1 }">New Game! </v-btn>
                      <v-btn :ripple="false" @click="loop_games()" :class="{highlighted: state.newGame==1 }">loop {{loop.runs}}-time(s) </v-btn>
                    </div>
                  </div>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex xs12 sm6 md4>
            <v-layout row wrap>
              <v-flex d-flex>
                <div class='diceRolls'>
                  <v-btn @click="rolls_trigger()" :ripple="false" :disabled="((state.rollCounter<=0||isNaN(state.rollCounter))&&!state.newTurn||state.newGame==1)"
                    :class="{highlighted: state.newTurn, active: !state.newTurn}">
                    <span v-if="state.newGame">newGame</span>
                    <span v-else-if="state.newTurn">New turn</span>
                    <span v-else>Roll({{state.rollCounter}})</span>
                  </v-btn>
                  <diceRolls v-model="state.rollsArray" v-on:newRolls="rollsOutput" v-bind:state='state' v-bind:rollsRequest='rollsAP'></diceRolls>
                  <div v-for="(block, index) in state.allRolls" :key="index">
                    allRolls: {{index}}
                    <ul v-for="(array, arrayIndex) in block" :key="arrayIndex"> {{array}} </ul>
                    <br>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex xs12 sm6 md4>
            <v-card color="white">
              <v-tabs color="grey" slider-color="black">
                <v-tab v-for="(i, indexHeader) in layout.tabs" :key="indexHeader" ripple>
                  {{i.headerText}}
                </v-tab>
                <v-tab-item>
                  <v-card flat class='log'>
                    <h3>Kniffel Log</h3>
                    <v-layout row wrap>
                      <ul v-for="(column, columnIndex) in playerLog" :key="columnIndex">
                        <h4 v-if="columnIndex>0"> Player {{columnIndex}} log </h4>
                        <li v-for="(entry, entryIndex) in playerLog[columnIndex]" :key="entryIndex">
                          {{entry}}
                        </li>
                      </ul>
                    </v-layout>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <div class='aiEnemy'>
                      <aiEnemy v-on:fixedCell='fixCell' v-on:newRolls="rollsOutput" v-bind:newSheet='sheetData' v-bind:sheetLayout='sheet' v-bind:state='state'></aiEnemy>
                    </div>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <div class='results'>aha...
                    </div>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <settings v-on:newSettings='newSettings'></settings>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-app>
</template>

<script>
  import lineFunctions from "@/lineFunctions";
  import sheetDef from "@/sheetDef";
  import diceRolls from "@/components/Kniffel/DiceRolls";
  import sheet from "@/components/Kniffel/Sheet";
  import aiEnemy from "@/components/Kniffel/AIEnemy";
  import settings from "@/components/Kniffel/Settings";

  export default {
    name: "Kniffel",
    data() {
      return {
        sheet: sheetDef,
        layout: {
          tabs: {
            log: {
              headerText: 'Log',
              contentType: 'local',
              content: 'playerLog',
            },
            prio: {
              headerText: 'Priority',
              contentType: 'component',
              content: 'aiEnemy'
            },
            results: {
              headerText: 'Results',
              contentType: 'local',
              content: "loop.scoreTracker"
            },
            settings: {
              headerText: 'settings',
              contentType: 'component',
              content: "settings"

            }
          }
        },
        sheetData: {},
        loop: {
          lastScore: 0,
          scoreTracker: [],
          runs: 0,
          currentRun: 0
        },
        rollsAP: {
          getDices: 0,
          override: {
            trigger: 0,
            data: [6, 6, 6, 6, 6]
          }
        },
        state: {
          currentPlayer: 1,
          computerOpponentSet: new Set([0, 2]),
          newTurn: 1, // fängt mit 1 an, sonst gibt's unlustige fehler
          oldTurn: {
            player: null,
            rolls: null,
            rollAmount: null
          },
          computersTurn: 0,
          newGame: 0,
          rollsArray: null,
          allRolls: [],

          settings: {
            playerAmount: null,
            activeAI: null,
            startingPlayer: null,
            diceAmount: null,
            maxRolls: null

          },
        },
        playerLog: null,
        rollsOverride: { rollsAmount: null, rolls: [] }
      };
    },

    watch: {
      "state.newTurn": function () {
        const aiSet = new Set(this.state.settings.activeAI)
        if (this.state.newTurn === 1) this.sheetDataFunc() // re-fresh the sheet, mainly with zero-padding
        if (
          this.state.newTurn === 0 && aiSet.has(this.state.currentPlayer)
        ) {
          console.log('for real? ', aiSet, this.state.currentPlayer, aiSet.has(this.state.currentPlayer), JSON.stringify(aiSet))
          console.log('computers turn')
          this.state.computersTurn = true;
        } else {
          console.log('NOOOOT computers turn')
          this.state.computersTurn = false;
        }
        return 0;
      },
      "state.newGame": function finishLogWithSums() {
        if (this.state.newGame === 1) {
          for (let i = 1; i <= this.settingsCmptd.playerAmount; i += 1) {
            const score = this.sheetData[i][this.sheetData[i].length - 1].value;
            this.writeLogAdd(i, "Total score: " + score);
          }
        }
      }
    },

    computed: {
      settingsCmptd() {
        let settings = {}
        settings.playerAmount = this.state.settings.playerAmount || 2
        settings.activeAI = new Set(this.state.settings.activeAI || [0])
        settings.startingPlayer = this.state.settings.startingPlayer || 1
        return settings
      },
      undoButton() {
        return this.state.newTurn === 1 ? "Undo turn!" : "Undo turn!";
      },
    },

    methods: {
      //applying new settings
      newSettings(settingsBundle) {
        let settings = this.state.settings
        settings.playerAmount = settingsBundle.playerAmount
        settings.activeAI = settingsBundle.activeAI
        settings.diceAmount = settingsBundle.diceAmountNew
        settings.maxRolls = settingsBundle.maxRollsNew
        this.new_game()
      },
      sheetDataFunc() {
        let x; // x = {result: integer, dicesMatch: [], dicesMatchNot: [] }
        let j;
        let rollsArray = [];
        if (this.state.newTurn) {
          rollsArray = [0];
        } else {
          rollsArray = this.state.rollsArray;
        }
        for (j = 0; j < this.sheet.length; j += 1) {
          x = lineFunctions[this.sheet[j].methode](
            rollsArray,
            j,
            this.sheet,
            this.sheetData[this.state.currentPlayer],
            this.state.currentPlayer
          );
          const cell = this.sheetData[this.state.currentPlayer][j]
          if (!cell.fixed) {
            cell.value = x.result;
            cell.data = x;
          }
        }
        return Object.assign({}, this.sheetData);
      },
      rollsOutput(rollsObject) {
        if (!rollsObject.rollArray) {
          alert("no new rolls found");
          return;
        }
        this.state.rollsArray = rollsObject.rollArray;
        this.state.rollCounter = rollsObject.rollCounter - 1; //comes delayed? thats why the -1
        if (
          this.state.allRolls !== rollsObject.allRolls &&
          rollsObject.source === 1 &&
          this.state.newTurn === 1
        ) {
          // saves&logs only rolls from button, not via emit from AI
          this.state.allRolls.unshift(rollsObject.allRolls);
          if (this.state.allRolls.length >= 4) {
            this.state.allRolls.pop();
          }
        }
        this.state.oldTurn.rollAmount = rollsObject.rollCounter;
        this.state.newTurn = 0;
        this.writeLogAdd(
          this.state.currentPlayer,
          "rolled: " + this.state.rollsArray
        );
        // eslint-disable-next-line no-unused-vars
        const cheatz2 = this.sheetDataFunc(); // makeshift glue... without this line, everything is fcked up!
      },

      writeLogAdd(currentPlayer, message) {
        const array = this.playerLog[currentPlayer];
        const pointer = array.length;
        array[pointer] = array.unshift(message);
      },
      writeLogRemoveLast(player, asdf) {
        const column = player || this.state.currentPlayer;
        const amount = asdf || 1;
        const array = this.playerLog[column];
        for (let i = 0; i < amount; i += 1) {
          array.shift();
        }
      },

      fixCell(cellColAndRow) {
        if (
          !(
            this.sheet[this.sheetData[cellColAndRow[0]][cellColAndRow[1]].sheetRowDef].anklickbar === 0 ||
            this.sheetData[cellColAndRow[0]][cellColAndRow[1]].fixed ||
            cellColAndRow[0] !== this.state.currentPlayer ||
            this.state.newTurn
          )
        ) {
          this.state.oldTurn.player = this.state.currentPlayer;
          this.state.oldTurn.fixedCell = [
            this.sheetData[cellColAndRow[0]][cellColAndRow[1]]
          ];
          this.sheetData[cellColAndRow[0]][cellColAndRow[1]].fixed = true;
          this.sheetData = Object.assign({}, this.sheetData);
          this.writeLogAdd(
            this.state.currentPlayer,
            " +" + this.sheetData[cellColAndRow[0]][cellColAndRow[1]].value + " " + this.sheet[cellColAndRow[1]].name
          );
          // eslint-disable-next-line no-unused-vars
          const cheatz = this.sheetDataFunc(); //forcing a re-fresh of sheetData before changing player
          this.state.currentPlayer =
            this.state.currentPlayer % this.settingsCmptd.playerAmount + 1;
          this.state.newTurn = 1;
          const availableCells = this.sheetData[this.state.currentPlayer].filter(
            cell => !(cell.fixed || this.sheet[cell.sheetRowDef].anklickbar === 0)
          );
          this.state.newGame = availableCells.length === 0 ? 1 : 0;
          if (this.loop.currentRun < this.loop.runs) {
            //if (this.state.newGame !== 0) {
            this.$nextTick(function () {
              this.$forceUpdate();
              this.rolls_trigger();
              this.$forceUpdate();
            });
            //}
            if (this.state.newGame === 1) {
              this.loop.scoreTracker.push(
                this.sheetData[1][this.sheetData[1].length - 1].value
              );
              this.loop.currentRun++;
              this.$nextTick(function () {
                this.$forceUpdate();
                this.new_game();
                this.$forceUpdate();
              });
            }
          }
        }
      },

      generate_sheetData() {
        this.sheetData = {};
        for (let i = 1; i <= this.settingsCmptd.playerAmount; i += 1) {
          this.sheetData[i] = [];
          for (let j = 0; j < this.sheet.length; j += 1) {
            this.sheetData[i].push({
              value: "",
              fixed: false,
              sheetRowDef: j // zum Nachschlagen von line-spezifischen properties
            });
          }
        }
      },
      generate_playerLog() {
        this.playerLog = [];
        for (let i = 1; i <= this.settingsCmptd.playerAmount; i += 1) {
          this.playerLog[i] = [];
        }
      },
      undo_turn() {
        this.state.currentPlayer = this.state.oldTurn.player;
        this.state.oldTurn.fixedCell["0"].fixed = false;
        this.rollsOverride = !this.rollsOverride;
        this.writeLogRemoveLast(this.state.currentPlayer, 2);
      },
      new_game() {
        this.generate_sheetData();
        this.generate_playerLog();
        this.state.currentPlayer = this.playerNr || 1;
        this.state.newTurn = 1;
        this.state.newGame = 0;
        this.sheetDataFunc()
        if (this.loop.currentRun < this.loop.runs) {
          console.log(
            "currentRun, maxRuns: ",
            this.loop.currentRun,
            this.loop.runs
          );
          this.rolls_trigger();
          this.$nextTick(() => {
            console.log(
              "afterTimeout, current, maxRuns: ",
              this.loop.currentRun,
              this.loop.runs
            );
            this.rolls_trigger();
          }, 0);
        } else {
          console.log(
            "end?",
            this.loop.currentRun,
            this.loop.runs,
            this.loop.scoreTracker
          );
        }
      },
      rolls_trigger() {
        this.rollsAP.getDices = !this.rollsAP.getDices;
      },
      loop_games() {
        this.loop.currentRun = 0;
        this.loop.runs = 50;
        this.new_game();
      }
    },
    created() {
      this.new_game()
    },
    //-----------------------------------------------------
    components: {
      diceRolls,
      sheet,
      aiEnemy,
      settings
    }
    //------------------------------------------------------
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .Kniffel {
    max-width: 1000px;
    max-height: 500px;
  }

  p {
    color: green;
    text-align: center;
  }

  .diceRolls {
    text-align: center;
    left: 50px;
    max-width: 300px;
    width: 300px;
    padding: 20px;
  }

  .log {
    border-style: double;
    text-align: left;
    font-size: 80%;
    padding: 10px;
  }

  .highlighted {
    box-shadow: 0 0 25px rgb(100, 0, 0);
  }

  .active {
    box-shadow: 0 0 25px rgb(0, 100, 0);
  }
</style>