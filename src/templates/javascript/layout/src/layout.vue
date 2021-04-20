<template>
  <div>
    <div>Collection: {{ collection }}</div>
    <v-list>
      <v-list-item v-for="item in items" v-bind:key="item.id">
        {{item}}
      </v-list-item>
    </v-list>
    <v-button v-on:click="logToConsole">Log items to console</v-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        items: null,
      };
    },
    methods: {
      logToConsole: function () {
        console.log(this.items);
      },
    },
    inject: ["system"],
    mounted() {
      // log the system field so you can see what attributes are available under it
      // remove this line when you're done.
      console.log(this.system);
      // Get a list of all available collections to use with this module
      this.system.api.get(`/items/${this.collection}`).then((res) => {
        this.items = res;
      });
    },
  };
</script>
