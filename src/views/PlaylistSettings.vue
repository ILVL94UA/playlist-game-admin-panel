<template lang="html">
  <div>
    <h1>PLAYLIST SETTINGS</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-select
        label="Section"
        v-model="type"
        :items="[
          'family',
          'child',
          'adult'
        ]"
        solo
      ></v-select>
      <v-btn @click="create" text color="success">add new setting</v-btn>
    </v-layout>
    <v-data-table
      :pagination="{
        rowsPerPage: -1,
      }"
      v-if="data.length"
      :headers="[
        { text: 'NAME', value: 'name' },
        { text: 'SECTION', value: 'type' },
      ]"
      :items="data"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.type }}</td>
        <td>
          <v-btn text @click="edit(props.item)" color="info">edit</v-btn>
        </td>
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
          Updating playlist location
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="selected.name" label="Setting name"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <v-select
            label="Section"
            v-model="selected.type"
            :items="[
              'family',
              'child',
              'adult'
            ]"
            solo
          ></v-select>
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
            @click="update"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="transLang"
      v-model="dialogTr"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating translate {{getLang(transLang)}}
        </v-card-title>

        <v-card-text>
          <v-text-field label="Name" v-model="transLang.data.name" category="text"></v-text-field>
          <v-layout justify-end>
          </v-layout>

          <v-btn @click="updateT"  color="success">
            update
          </v-btn>
        </v-card-text>
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
      categories: [],
      dialogTr: false,
      transLang: '',
      lang: [],
      name: '',
      type: '',
      text: '',
    };
  },
  methods: {
    sync() {
      this.lang =  JSON.parse(localStorage.getItem('translate'));
      axios.get('/playlist/settings').then(res => {
        this.data = res.data;
      });
    },
    openCategoryT (lang) {
      this.dialogTr = true;
      this.transLang = lang;
    },
    getLang(trans){
       let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    create() {
      this.lang =  JSON.parse(localStorage.getItem('translate'));

      axios.post('/playlist/settings', {
        name: this.name,
        type: this.type,
      }).then(res => {
        this.sync();
      });
    },
    edit(item) {
      this.selected = item;
      this.dialog.gift = true;
    },
    updateT() {
      axios.put('/playlist/settings/' + this.selected.id_setting, this.selected).then(res => {
        this.sync();
        this.dialogTr =false;
      });
    },
    update() {
      axios.put('/playlist/settings/' + this.selected.id_setting, this.selected).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    remove() {
      axios.delete('/playlist/settings/' + this.selected.id_setting).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    
  },
  created() {
    this.sync();
  }
}
</script>

<style lang="scss" scoped>



</style>
