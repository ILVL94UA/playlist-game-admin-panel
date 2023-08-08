<template>
  <div class="category">
    <div class="create_block">
      <v-text-field label="Name" v-model="new_category.name" category="text"></v-text-field> 
      <v-text-field label="Color" v-model="new_category.color" category="text"></v-text-field> 

      <v-btn @click="createCategory" color="success">
        create
      </v-btn>
    </div>
    <div class="category_table">
      <v-data-table
        v-if="categories.length"
        :headers="[
          { text: 'Name', value: 'name' },
          { text: 'Color', value: 'color' },
          { text: 'Image', value: 'img_url' },
          { text: 'Edit', value: 'edit' },
          { text: 'Delete', value: 'delete' },
        ]"
        :items="categories"
      >
      <!-- { text: 'Delete', value: 'delete' }, -->
        <!-- <template v-slot:item.delete="{ item }">
          <v-btn text @click="deletecategory(item)" color="info">delete</v-btn>
        </template> -->
        <template v-slot:item.img_url="{ item }">
          <img v-if="item.img_url" :src="item.img_url" width="100">
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn text @click="openCategory(item)" color="info">edit</v-btn>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn text @click="deleteCategory(item)" color="info">delete</v-btn>
        </template>
      </v-data-table>
    </div>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating category
        </v-card-title>

        <v-card-text>
          <v-text-field label="Name" v-if="selected.translation" @input="onNameInput" v-model="selected.translation[0].data.name" category="text"></v-text-field>
          <div class="display-1 mb-2">Promo settings</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-layout>
        <v-switch
            v-model="selected.is_promo"
            label="Is promo only"
          />
        </v-layout>
          <v-layout>
            <v-text-field 
          v-if="selected.is_promo"
            :label="'Search by code'"
            type="text" 
            outline
            @input="filterPromo"
          ></v-text-field>
        <v-select
        v-if="selected.is_promo"
          label="Promos"
          v-model="selected.id_promo"
          chips
          :items="promosFiltered"
          item-text="value"
          item-value="id_promo"
          solo
          multiple
        ></v-select>
      </v-layout>
        
      </v-layout>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <v-text-field label="Color" v-model="selected.color" category="text"></v-text-field>
         <v-switch v-model="selected.is_default" label="Is default"></v-switch>
          <v-layout justify-end>
            <img :src="selected.img_url" width="100" alt="">
            <v-btn small color="info" @click="$refs.file.click()">
              Upload image
            </v-btn>
          </v-layout>
          <input v-show="false" ref="file" type="file" @change="updateImage" >
          <v-btn @click="updateCategory" color="success">
            update
          </v-btn>
        </v-card-text>
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
  data () {
    return {
      categories: [],
      promos:[],
      promosFiltered:[],
      transLang: '',
      lang: [],
      dialogTr: false,
      new_category: {
        name: '',
        color: ''
      },
      dialog: false,
      selected: {}
    }
  },
  created () {
    this.lang =  JSON.parse(localStorage.getItem('translate'));
    this.getCategory();
    this.getPromoCodes();
  },
  
  methods: {
    getPromoCodes() {
      axios.get('/admin/promo').then(res => {
        this.promos = res.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
        this.promosFiltered = res.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
      });
    },
    filterPromo(e){
      this.promosFiltered = this.promos.filter(x=>x.value.toLowerCase().includes(e.toLowerCase()));
    },
    onNameInput(e){
      this.selected.name = e;
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
    getCategory () {

      axios.get('/shootlist/categoryAdm').then(res => {
        this.categories = res.data.categories;
      });

    },
    updateImage() {
      var data = new FormData();
      data.append('file', this.$refs.file.files[0]);
      axios.post('/shootlist/category/' + this.selected.id + '/set-image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.selected.img_url = res.data.url
      });
    },
    createCategory () {
      axios.post('/shootlist/category', this.new_category).then(res => {
        this.new_category = {
          name: '',
          color: ''
        };
        this.getCategory();
      });
    },
    deleteCategory (item) {
      axios.delete('/shootlist/category/' + item.id).then(res => {
        this.getCategory();
      });
    },
    openCategory (item) {
      this.dialog = true;
      this.selected = item;
    },
    updateT() {
      axios.put('/shootlist/category/' + this.selected.id, this.selected).then(res => {
        this.getCategory();
        this.dialogTr =false;
      });
    },
    updateCategory () {
      this.dialog = false;

      axios.put('/shootlist/category/' + this.selected.id, this.selected).then(res => {
        this.getCategory();
        this.dialog.gift = false;
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