<template lang="html">
  <div>
    <h1>Playlist gifts sections</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-btn @click="create" text color="success">add new section</v-btn>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :headers="[
        { text: 'NAME', value: 'name' },
        { text: 'EDIT', value: 'actions' },
      ]"
      :items="data"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog.gift"
      v-if="selected.translation"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating section
        </v-card-title>

        <v-card-text>
          <v-text-field @input="onInputName"  v-model="selected.translation[0].data.name" label="Gift name"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <sketch-picker v-if="selected.color" v-model="selected.color"/>
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
import { Sketch } from 'vue-color'

export default {
  data() {
    return {
      selected: {},
      dialog: {
        gift: false,
      },
      categories: [],
      dialogTr: false,
      transLang: '',
      lang: [],
      sections: [],
      data: [],
      name: '',
    };
  },
  methods: {
    onInputName(e){
      this.selected.name = e;
    },
    sync() {
      axios.get('/playlist/section').then(res => {
        this.data = res.data;
      });
    },
    openCategoryT (lang) {
      this.dialogTr = true;
      this.transLang = lang;
    },
    getLang(trans){
      console.log(trans);
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    create() {

      axios.post('/playlist/section', {
        name: this.name,
      }).then(res => {
        this.sync();
      });
    },
    edit(item) {
      this.selected = {...item};
      this.dialog.gift = true;
    },
    updateT() {
       axios.put('/playlist/section/' + this.selected.id_section, this.selected).then(res => {
        this.sync();
        this.dialogTr =false;
      });
    },
    update() {
      this.selected.color = this.selected.color.hex;
      axios.put('/playlist/section/' + this.selected.id_section, this.selected).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    remove() {
      axios.delete('/playlist/section/' + this.selected.id_section).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
  },
  created() {
    this.lang =  JSON.parse(localStorage.getItem('translate'));

    this.sync();
  },
  components: {
    'sketch-picker': Sketch,
  }
}
</script>

<style lang="scss" scoped>



</style>
