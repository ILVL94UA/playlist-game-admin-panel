<template lang="html">
  <div>
    <h1>FUNZONE</h1>
    <v-layout>
      <v-text-field solo label="Search" v-model="search"></v-text-field>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :headers="[
        { text: 'ID', value: 'id_event' },
        { text: 'EDIT', value: 'actions', sortable: false },
        { text: 'NAME', value: 'name' },
        { text: 'STARTED', value: 'date' },
        { text: 'FINISHED', value: 'date_release' },
        { text: 'MAX USERS', value: 'max_users' },
        { text: 'JOINED USERS', value: 'users' },
        { text: 'USERS SAW', value: 'users_saw' },
        { text: 'VISABILITY', value: 'hidden', sortable: false },
      ]"
      :items="data.filter(n => !search.length || (n.name && n.name.includes(search)))"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date * 1000) | dateFormat('DD.MM.YY') }}
      </template>
      <template v-slot:item.date_release="{ item }">
        {{ new Date(item.date_release * 1000) | dateFormat('DD.MM.YY') }}
      </template>
      <template v-slot:item.hidden="{ item }">
        {{ item.hidden ? 'HIDDEN' : 'VISIBLE' }}
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog.edit"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Edit funzone
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="selected.name" label="Name"></v-text-field>
          <v-text-field v-model="selected.phone" label="Phone"></v-text-field>
          <v-text-field v-model="selected.comment" label="Comment"></v-text-field>
          <v-text-field v-model="selected.geo" label="Geolocation"></v-text-field>
          <v-text-field v-model="selected.geo_full" label="Full geolocation"></v-text-field>
          <v-text-field v-model="selected.pass" label="Pass"></v-text-field>
          <v-switch v-model="selected.hidden" label="Hidden"></v-switch>
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
  name: 'funzone',
  data() {
    return {
      selected: {},
      dialog: {
        edit: false,
      },
      sections: [],
      data: [],
      search: '',
    };
  },
  methods: {
    sync() {
      axios.get('/admin/funzone').then(res => {
        this.data = res.data;
      });
    },
    edit(item) {
      axios.get('/admin/funzone/' + item.id_event).then(res => {
        this.selected = res.data;
        this.dialog.edit = true;
      });

    },
    update() {
      axios.put('/admin/funzone/' + this.selected.id_event, this.selected).then(res => {
        this.sync();
        this.dialog.edit = false;
      });
    },
    remove() {
      axios.delete('/admin/funzone/' + this.selected.id_event).then(res => {
        this.sync();
        this.dialog.edit = false;
      });
    },
  },
  created() {
    this.sync();
  }
}
</script>

<style lang="scss" scoped>

.avatar {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #ccc;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

</style>
