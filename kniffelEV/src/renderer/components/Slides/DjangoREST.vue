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
                <v-icon v-for="(intensity, indexIntens) in item.intensity" :key="indexIntens">ac_unit</v-icon>
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
          { text: 'Django', intensity: 10 },
          { text: 'REST', intensity: 5 },
        ]
      }
    }
  }
</script>

<style>
</style>