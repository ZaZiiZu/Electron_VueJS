<template>
  <v-app id="vAppContainer">
    <div>
      <v-toolbar color="cyan">
        <v-btn fab small class="text-xs-center" @click.native="previous">
          <v-icon style="padding: 10px 0 0 10px; text-align: center;">arrow_back_ios</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <h1>{{tabs.headers[active]}}</h1>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn fab small class="text-xs-center" @click.native="next">
          <v-icon style="padding: 10px 0 0 10px; text-align: center;">arrow_forward_ios</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs v-model="active" color="cyan" dark slider-color="black" grow>

        <v-tab v-for="i in tabs.headers" :key="i">
          <v-icon>crop_square</v-icon>
        </v-tab>
        <v-tab-item>
          <v-card flat>

          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <Overvue></Overvue>>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <img src="/static/w3schools_overview.png">
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <img src="/static/html_target.png">
            <img src="/static/html_done.png">
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <JSJQueryPart1></JSJQueryPart1>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <Calculator></Calculator>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <DjangoREST></DjangoREST>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <JSJQueryPart2></JSJQueryPart2>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <KniffelJQuery></KniffelJQuery>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <VueJSVuetify></VueJSVuetify>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <Kniffel></Kniffel>
          </v-card>
        </v-tab-item>
      </v-tabs>

    </div>
  </v-app>
</template>

<script>
  import Overvue from "@/components/Slides/Overvue";
  import Kniffel from "@/components/Kniffel";
  import Calculator from "@/components/Slides/Calculator";
  import KniffelJQuery from "@/components/Slides/KniffelJQuery";
  import JSJQueryPart1 from "@/components/Slides/JSJQueryPart1";
  import JSJQueryPart2 from "@/components/Slides/JSJQueryPart2";
  import DjangoREST from "@/components/Slides/DjangoREST";
  import VueJSVuetify from "@/components/Slides/VueJSVuetify";

  export default {
    name: "MainContainer",
    data() {
      return {
        active: null,
        tabs: {
          headers: [
            '', 'Overvue',
            'Woche 0', 'Beispiel 1',
            'Wochen 1-3', 'Beispiel 2',
            'Wochen 4-5',
            'Wochen 6-7', 'Beispiel 3',
            'Wochen 8-11', 'Beispiel 4']
        }
      };
    },

    watch: {
    },

    computed: {
    },

    methods: {
      next() {
        const active = parseInt(this.active)
        this.active = (active < this.tabs.headers.length - 1 ? active + 1 : 0).toString()
      },
      previous() {
        const active = parseInt(this.active)
        this.active = (active > 0 ? active - 1 : this.tabs.headers.length - 1).toString()
      }
    },
    created() {
    },
    //-----------------------------------------------------
    components: {
      Kniffel,
      Calculator,
      KniffelJQuery,
      Overvue,
      JSJQueryPart1,
      JSJQueryPart2,
      DjangoREST,
      VueJSVuetify
    }
    //------------------------------------------------------
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #vAppContainer {
    height: 100%;
    width: 100%
  }
</style>