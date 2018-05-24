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
          { text: 'Warum Vue?' },
          { text: '- einfach zu lernen' },
          { text: '- nach Minuten schon Ergebnisse' },
          { text: '- Eigenschaften:' },
          { text: '- - Component-based (single-file)' },
          { text: '- - ES5 oder ES6 nutzbar ' },
          { text: '- - "hot-reload"' },
          { text: '- - viertualer DOM' },
          { divider: true, inset: false },
          { text: 'ESLint' },
          { text: '- Regeln zu' },
          { text: '- - weniger fehleranfälligem code' },
          { text: '- - übersichtlicherem code' },
          { text: '- z.B.' },
          { text: '- - no-irregular-whitespace, no-empty' },
          { text: '- - for-direction' },
          { text: '- - no-magic-numbers, no-unused-vars' },
          { text: '- - func-names, comma-spacing, indent' },
          { divider: true, inset: false },
        ]
      }
    }
  }
</script>

<style>
</style>