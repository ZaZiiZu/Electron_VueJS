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
          { text: '"basics"' },
          { divider: true, inset: false },
          { text: 'JQuery' },
          { divider: true, inset: false },
          { text: 'events' },
          { divider: true, inset: false },
          { text: 'DOM-Navigation' },
          { divider: true, inset: false },
          { text: 'Farben' },
          { divider: true, inset: false },
          { text: 'RegEx' },
          { divider: true, inset: false },
        ]
      }
    }
  }
</script>

<style>
</style>