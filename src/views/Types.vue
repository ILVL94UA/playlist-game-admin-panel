<template>
  <div class="type">
    <div class="create_block">
      <v-text-field label="Title" v-model="new_type.title" type="text"></v-text-field> 
      <v-text-field label="Color" v-model="new_type.color" type="text"></v-text-field> 

      <v-btn @click="createType" color="success">
        create
      </v-btn>
    </div>

    <div class="type_table">
      <v-data-table
        v-if="types.length"
        :headers="[
          { text: 'Title', value: 'title' },
          { text: 'Color', value: 'color' },
          { text: 'Edit', value: 'edit' },
          
        ]"
        :items="types"
      >
      <!-- { text: 'Delete', value: 'delete' }, -->
        <!-- <template v-slot:item.delete="{ item }">
          <v-btn text @click="deleteType(item)" color="info">delete</v-btn>
        </template> -->
        <template v-slot:item.edit="{ item }">
          <v-btn text @click="openType(item)" color="info">edit</v-btn>
        </template>
      </v-data-table>
    </div>
    <v-dialog
      v-model="dialog"
      v-if="selected.translation"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating type
        </v-card-title>

        <v-card-text>
          <v-text-field label="Title" @input="changeTitle" v-model="selected.translation[0].data.title" type="text"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openModalFirst(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <v-text-field label="Color" v-model="selected.color" type="text"></v-text-field>
           <v-text-field label="Index" v-model="selected.orderIndex" type="text"></v-text-field>
          
          <v-btn @click="changeIndex" color="success">
            Update Index
          </v-btn>
          <v-card-actions style="display: flex;flex-direction: row;justify-content: space-between">
          <v-btn
            color="error"
            icon
            small
            @click="deleteType"
          >
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn @click="updateType" color="success">
            update
          </v-btn>
         
          </v-card-actions>
        </v-card-text>
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
          <v-text-field label="Text 1" v-model="transLang.data.title" category="text"></v-text-field>

          <v-layout justify-end>
          </v-layout>
          <v-card-actions>

          <v-spacer></v-spacer>
          <v-btn @click="updateT"  color="success">
            update
          </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      types: [],
      new_type: {
        title: '',
        color: ''
      },
      dialog: false,
      lang: [],
      dialogFirst: '',
      transLang: '',
      selected: {}
    }
  },
  created () {
    this.lang =  JSON.parse(localStorage.getItem('translate'));
    this.getType();

  },
  methods: {
    changeTitle(val)
    {
      this.selected.title = val;
    },
    getType () {
      axios.get('/types').then(res => {

        let types = res.data;
        this.types = types.sort((a,b)=>a.orderIndex > b.orderIndex ? 1: -1);
      });
    },
    getLang(trans){
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    openModalFirst (lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    createType () {
      axios.post('/types', this.new_type).then(res => {
        this.new_type = {
          title: '',
          color: ''
        };
        this.getType();
      });
    },
    deleteType ( ) {
      this.dialogFirst = false;

      axios.delete('/types/' + this.selected.id_type).then(res => {
        this.getType();
      });
    },
    updateT() {
      this.dialogFirst = false;

      axios.put('/types/' + this.selected.id_type, this.selected).then(res => {
        this.sync();
      });
    },
    openType (item) {
      this.dialog = true;
      this.selected = item;
    },
    updateType () {
      this.dialog = false;
      axios.put('/types/' + this.selected.id_type, this.selected).then(res => {
        this.getType();
      });
    },
    changeIndex(){
        axios.post('/types/changeIndex',this.selected).then(res => {
        this.getType();
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.create_block {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  > * {
    max-width: 300px;
    margin: 10px;
  }
}
</style>