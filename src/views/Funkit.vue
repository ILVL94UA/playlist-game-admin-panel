<template lang="html">
  <div>
    <h1>FUNKIT</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-btn @click="create" text color="success">add new funkit</v-btn>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :pagination="{
        rowsPerPage: -1,
      }"
      :headers="[
        { text: 'INDEX', value: 'order_index' },
        { text: 'NAME', value: 'name' },
        { text: 'START DAY', value: 'date' },
        { text: 'STATUS', value: 'show' },
        { text: 'REQUESTS', value: 'requests' },
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
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-if="selected.translation"
      v-model="dialog.funkit"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating funkit
        </v-card-title>

        <v-card-text>
          <compact-picker :palette="[
            '#7DD966', '#75C9E3', '#D24678', '#C286FF', '#E5CA37', '#FF7384', '#D2E36B'
          ]" v-if="selected.color" v-model="selected.color"/>
          <v-layout justify-space-between align-center>
            <div>
              <v-switch v-model="selected.show" :label="!selected.show ? 'Hidden' : 'Visible'"/>
            </div>
            <div>
              <v-btn small color="info" @click="$refs.file.click()">
                Upload image
              </v-btn>
            </div>
          </v-layout>
          <input v-show="false" ref="file" type="file" @change="updateImage" >
          <v-text-field  v-model="selected.translation[0].data.name" @input="onInputName" label="Funkit name"></v-text-field>
          <v-text-field type="number" v-model="selected.price" label="Price"></v-text-field>
          <v-text-field type="number" v-model="selected.order_index" label="Order index"></v-text-field>
          <v-textarea
            outline
            name="input-7-4"
            label="Funkit descrliption"
            v-model="selected.translation[0].data.text"
          ></v-textarea>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openModalFirst(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
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
      v-model="dialogFirst"
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
          <v-text-field label="Text 1" v-model="transLang.data.name" category="text"></v-text-field>

          <v-textarea
            outline
            name="input-7-4"
            label="Workshop description"
            v-model="transLang.data.text"
          ></v-textarea>

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
import { Compact } from 'vue-color'
export default {
  data() {
    return {
      selected: {},
      dialog: {
        funkit: false,
      },
      lang: [],
      dialogFirst: '',
      transLang: '',
      data: [],
      name: '',
    };
  },
  methods: {
    onInputName(e){
      this.selected.name = e;
    },
    sync() {
      axios.get('/funkit').then(res => {
        this.data = res.data;
      });
    },
    openModalFirst (lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    create() {
      axios.post('/funkit', {
        name: this.name,
      }).then(res => {
        this.sync();
      });
    },
    getLang(trans){
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    edit(item) {
      this.selected = {...item};
      this.dialog.funkit = true;
    },
    update() {
      this.selected.color = this.selected.color.hex;
      axios.put('/funkit/' + this.selected.id_funkit, this.selected).then(res => {
        this.sync();
        this.dialog.funkit = false;
      });
    },
    updateT() {
       axios.put('/funkit/' + this.selected.id_funkit, this.selected).then(res => {
        this.sync();
         this.dialogFirst = false;
       });
    },

    remove() {
      axios.delete('/funkit/' + this.selected.id_funkit).then(res => {
        this.sync();
        this.dialog.funkit = false;
      });
    },
    updateImage() {
      var data = new FormData();
      data.append('file', this.$refs.file.files[0]);
      axios.post('/funkit/' + this.selected.id_funkit + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {

      });
    }
  },
  created() {
    this.lang =  JSON.parse(localStorage.getItem('translate'));
    this.sync();
  },
  components: {
    'compact-picker': Compact
  }
}
</script>

<style lang="scss" scoped>



</style>
