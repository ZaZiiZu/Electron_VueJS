<template>
	<v-app>
		<v-container>
			<v-text-field id="inputPlayerAmount" v-model.number="playerAmount" type="number" label="Players" placeholder="2" size='5'
			 min='1' max="5"></v-text-field>
			<v-container fluid>
				<v-subheader>enable AI for players</v-subheader>
				<v-layout wrap row>
					<v-flex v-for="i in playerAmount" :key='i' xs12 sm6 md6>
						<v-switch :label="'Player '+i" v-model="activeAIObj[i]" hide-details></v-switch>
					</v-flex>
				</v-layout>
			</v-container>
			<v-text-field id="inputDiceAmount" v-model.number="diceAmountNew" type="number" label="Amount of dices" placeholder="5" size='5'
			 max="20"> </v-text-field>
			<v-text-field id="inputMaxRolls" v-model.number="maxRollsNew" type="number" label="Amount of max. rolls:" placeholder="5"
			 size='5' max="200"></v-text-field>
			<v-btn round light block @click="apply_settings()">apply!*</v-btn>
			*: this starts a new game
		</v-container>
	</v-app>
</template>

<script>
	export default {
	  name: "Settings",
	  data() {
	    return {
	      playerAmount: 2,
	      activeAIObj: {},
	      diceAmountNew: 5,
	      maxRollsNew: 3,
	    };
	  },

	  props: [],

	  watch: {},
	  computed: {
	    // filters active AI out of possible players and returns them as numbers in array
	    activeAIArray() {
	      let array = []
	      for (var key in this.activeAIObj) {
	        if (this.activeAIObj.hasOwnProperty(key) && key <= this.playerAmount && this.activeAIObj[key] === true) {
	          array.push(parseInt(key))
	        }
	      }
	      return array
	    }
	  },
	  methods: {
	    apply_settings() {
	      this.$emit('newSettings',
	        {
	          playerAmount: this.playerAmount,
	          activeAI: this.activeAIArray,
	          diceAmountNew: this.diceAmountNew,
	          maxRollsNew: this.maxRollsNew
	        });
	    }
	  },
	  mounted() {
	  }
	};
</script>

<style scoped>
</style>