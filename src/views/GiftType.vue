<template>
  <div class="type">
    <div class="create_block">
      <v-select
        label="Gifts"
        v-model="new_gift.id_gift"
        :items="notUseGift"
        item-text="name"
        item-value="id_category"
      ></v-select>
      <v-select
        label="Type"
        v-model="new_gift.id_type"
        :items="typesList"
        item-text="title"
        item-value="id_type"
      ></v-select>
      <v-text-field label="Text 1" v-model="new_gift.sec_1" type="text"></v-text-field> 

      <v-btn @click="createType" color="success">
        create
      </v-btn>
    </div>
    <div class="type_table">
      <v-data-table
        v-if="types.length"
        :headers="[
          { text: 'NAME', value: 'id_gift' },
          { text: 'Type', value: 'id_type' },
          { text: 'Text 1', value: 'sec_1' },
          { text: 'Order Index', value: 'order_index' },
          { text: 'Edit', value: 'edit' },
          { text: 'Delete', value: 'delete' },
        ]"
        :items="types"
      >
        <template v-slot:item.id_gift="{ item }">
          {{getGiftName(item)}}
        </template>
        <template v-slot:item.id_type="{ item }">
          {{getTypeName(item)}}
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn text @click="deleteType(item)" color="info">delete</v-btn>
        </template>
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
          Updating {{getGiftName(selected)}}
        </v-card-title>

        <v-card-text>
         <v-text-field label="Order Index" v-model="selected.order_index" category="text"></v-text-field>
          <v-select
            label="Type"
            v-model="selected.id_type"
            :items="typesList"
            item-text="title"
            item-value="id_type"
          ></v-select>
          <v-text-field label="Text 1" @input="onInputTest" v-model="selected.translation[0].data.sec_1" type="text"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 15px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <v-btn @click="updateType" color="success">
            update
          </v-btn>
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
          <v-text-field label="Text 1" v-model="transLang.data.sec_1" category="text"></v-text-field>
          <v-layout justify-end>
          </v-layout>

          <v-btn @click="updatePopularT"  color="success">
            update
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gifts: [],
      types: [],
      typesList: [],
      transLang: '',
      lang: [],
      dialogFirst: false,
      new_gift: {
        sec_1: '',
        id_gift: '',
        id_type: ''
      },
      dialog: false,
      selected: {}
    }
  },
  created () {
    this.lang =  JSON.parse(localStorage.getItem('translate'));

    this.getGift();
    this.getGiftType();
    this.getTypes();

    axios.get('/type/17').then(res => {
      console.log(res);
    });
  },
  methods: {
    onInputTest(e)
    {
      this.selected.sec_1 = e;
    },
    openCategoryT (lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    getLang(trans){
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    getGiftName (item) {
      var res = this.gifts.find(gift => gift.id_category == item.id_gift);
      return res ? res.name : '';
    },
    getTypeName (item) {
      var res = this.typesList.find(gift => gift.id_type == item.id_type);
      return res ? res.title : '';
    },
    getGift() {
      axios.get('/playlist/categories').then(res => {
        this.gifts = res.data;
      });
    },
    getGiftType () {
      axios.get('/type/full').then(res => {
        this.types = res.data;
      });
    },
    getTypes () {
      axios.get('/types').then(res => {
        let types = res.data;
        this.typesList = types.sort((a,b)=>a.orderIndex > b.orderIndex ? 1: -1);
      });
    },
    createType () {
      axios.post('/type', this.new_gift).then(res => {
        this.new_gift = {
          sec_1: '',
          id_gift: '',
          id_type: ''
        };
        this.getGiftType();
      });
    },
    deleteType (item) {
      axios.delete('/type/' + item.id).then(res => {
        this.getGiftType();
      });
    },
    openType (item) {
      this.dialog = true;
      this.selected = item;
    },
    updateType () {
      this.dialog = false;
      axios.put('/type/' + this.selected.id, this.selected).then(res => {
        this.getGiftType();
      });
    },
    updatePopularT () {
      this.dialogFirst = false;
      axios.put('/type/' + this.selected.id, this.selected).then(res => {
        this.getGiftType();
      });
    },
  },
  computed: {
    notUseGift: function () {
      var res = this.gifts.filter(item => {
        var flag = this.types.find(pop => pop.id_gift == item.id_category);
        return !flag;
      });

      return res;
    }
  }
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