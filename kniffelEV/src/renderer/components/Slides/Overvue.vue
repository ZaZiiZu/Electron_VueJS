<template>
  <v-app>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-list>
            <template v-for="(item, index) in items">
              <!-- <v-subheader v-if="item.header" :key="item.header" v-html="item.header"></v-subheader> -->
              <v-divider v-if="item.divider" :inset="item.inset" :key="index"></v-divider>
              <v-list-tile v-else :key="item.text">
                {{item.text}}
                <v-spacer></v-spacer>
                <v-icon v-for="(intensity, indexIntens) in item.intensity" :key="indexIntens">whatshot</v-icon>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          { header: '<h1>Overvue</h1>' },
          { text: 'Html', intensity: 3 },
          { text: 'CSS', intensity: 2 },
          { text: 'PHP', intensity: 1 },
          { text: 'mySQL', intensity: 1 },
          { divider: true, inset: false },
          { text: 'JS(ES5)', intensity: 4 },
          { text: 'jQuery', intensity: 3 },
          { divider: true, inset: false },
          { text: 'Bootstrap', intensity: 1 },
          { text: 'JSON', intensity: 1 },
          { text: 'RegEx', intensity: 2 },
          { divider: true, inset: false },
          { text: 'Django', intensity: 0 },
          { text: 'REST', intensity: 0 },
          { divider: true, inset: false },
          { text: 'Node.JS', intensity: 0 },
          { text: 'Vue.JS', intensity: 3 },
          { text: 'Vuetify', intensity: 2 },
          { text: 'Electron', intensity: 1 },
        ]
      }
    }
  }
</script>

<style>
</style>