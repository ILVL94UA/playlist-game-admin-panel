<template lang="html">
  <div>
    <h1>WORKSHOP</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-btn @click="create" text color="success">add new category</v-btn>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :headers="[
        { text: 'NAME', value: 'name' },
        { text: 'EDIT', value: 'actions', sortable: false },
      ]"
      :items="data"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog.gift"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating event category
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="selected.name" label="Category name"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="error"
            icon
            small
            @click="remove"
          >
            <v-icon>delete</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            flat
            @click="update"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: {},
      dialog: {
        gift: false,
      },
      data: [],
      name: '',
      text: '',
    };
  },
  methods: {
    sync() {
      axios.get('/event/categories').then(res => {
        this.data = res.data;
      });
    },
    create() {
      axios.post('/event/category', {
        name: this.name,
      }).then(res => {
        this.sync();
      });
    },
    edit(item) {
      this.selected = item;
      this.dialog.gift = true;
    },
    update() {
      axios.put('/event/category/' + this.selected.id_category, this.selected).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    remove() {
      axios.delete('/event/category/' + this.selected.id_category).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    }
  },
  created() {
    this.sync();
  }
}
</script>

<style lang="scss" scoped>



</style>
