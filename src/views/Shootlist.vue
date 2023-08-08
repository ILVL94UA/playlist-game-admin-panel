<template lang="html">
  <div>
    <h1>SHOOTLIST QUESTIONS</h1>
    <v-layout>
      <!--v-text-field solo label="Question(Female)" class="mr-3" v-model="content_fem"></v-text-field-->
      <v-text-field solo label="Question(Male)" v-model="content_man"></v-text-field>
      <v-btn @click="create" text color="success">Create new shootlist</v-btn>
    </v-layout>
    <v-layout>
      <v-text-field @input="sync" small label="Search" v-model="search.query"></v-text-field>
      <v-select
        @input="sync"
        label="Category"
        v-model="search.category"
        :items="options"
        item-text="name"
        item-value="id"
        solo
      ></v-select>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :headers="[
        { text: 'ORDER', value: 'order_index' },
        { text: 'QUESTION', value: 'content_man' },
        { text: 'START DAY', value: 'date' },
        { text: 'LIKED', value: 'liked' },
        { text: 'ANSWERED', value: 'played' },
        { text: 'VISIBLE', value: 'show' },
        { text: 'EDIT', value: 'actions', sortable: false },
      ]"
      :items="data"
    >
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date * 1000) | dateFormat('DD.MM.YY') }}
      </template>
      <template v-slot:item.show="{ item }">
        {{ item.show ? 'VISIBLE' : 'HIDDEN' }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn text :to="'/shootlist/' + item.id_shootlist" color="info">edit</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>

  export default {
    name: 'shootlist',
    data() {
      return {
        data: [],
        content_man: '',
        content_fem: '',
        search: {
          query: '',
          category: null,
        },
        options: [],
      };
    },
    methods: {
      refresh(){
        this.sync();
      },
      sync() {
        axios.post('/shootlist/full', {
          query: this.search.query,
          category: this.search.category,
        }).then(res => {
          this.data = res.data;

        });
      },
      getCategories(){
        axios.get('/shootlist/categoryAdm').then(res => {
          this.options = res.data.categories;
        });
      },
      create() {
        axios.post('/shootlist', {
          content_man: this.content_man,
          content_fem: this.content_fem,
        }).then(res => {

          this.sync();
        });
      }
    },
    activated(){
    this.getCategories();
    this.sync();
    },
    async created() {
      this.getCategories();
      await this.sync();
    },
  }
</script>

<style lang="scss" scoped>



</style>
