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
          { header: '' },
          { divider: true, inset: false },
          { text: 'Aufgabe: Kniffel' },
          { divider: true, inset: false },
          { text: 'Übersichtlichkeit' },
          { divider: true, inset: false },
          { text: 'CSS, gezielt' },
          { divider: true, inset: false },
          { text: 'JQuery' },
          { divider: true, inset: false },
          { text: 'Element-Manipulation' },
          { divider: true, inset: false },
          { text: 'Closures' },
          { divider: true, inset: false },
          { text: 'Bootstrap' },
          { divider: true, inset: false },
        ]
      }
    }
  }
</script>

<style>
</style>