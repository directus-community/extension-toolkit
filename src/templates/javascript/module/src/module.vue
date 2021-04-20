<template>
  <private-view title="Example Collection List">
    <v-list>
      <v-list-item v-for="col in collections" v-bind:key="col.collection">
        {{col.collection}}
      </v-list-item>
    </v-list>
    <v-button v-on:click="logToConsole">Log collections to console</v-button>
  </private-view>
</template>

<script>
  export default {
    data() {
      return {
        collections: null,
      };
    },
    methods: {
      logToConsole: function () {
        console.log(this.collections);
      },
    },
    inject: ["system"],
    mounted() {
      // log the system field so you can see what attributes are available under it
      // remove this line when you're done.
      console.log(this.system);

      // Get a list of all available collections to use with this module
      this.system.api.get("/collections?limit=-1").then((res) => {
        this.collections = res.data.data;
      });
    },
  };
</script>
