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
          { text: 'Order Index', value: 'order_index'},
          { text: 'Color', value: 'color' },
          { text: 'Edit', value: 'edit' },
          
        ]"
        :items="categories"
      >
      <!-- { text: 'Delete', value: 'delete' }, -->
        <!-- <template v-slot:item.delete="{ item }">
          <v-btn text @click="deletecategory(item)" color="info">delete</v-btn>
        </template> -->
        <template v-slot:item.edit="{ item }">
          <v-btn text @click="openCategory(item)" color="info">edit</v-btn>
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
          Updating category
        </v-card-title>

        <v-card-text>
          <v-text-field label="Name" @input="onNameInput" v-model="selected.translation[0].data.name" category="text"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 15px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <v-text-field label="Color Teacher's" v-model="selected.color" category="text"></v-text-field> 
          <v-text-field label="Order Index" v-model="selected.order_index" category="text"></v-text-field> 
          <v-btn @click="updateCategory" color="success">
            update
          </v-btn>
          <v-btn @click="deleteCategory" color="success">
            delete
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
          <v-text-field label="Text 1" v-model="transLang.data.name" category="text"></v-text-field>
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
      categories: [],
      lifeSkillsPage:true,
      valuebleExpireancePage:false,
      new_category: {
        name: '',
        color: '',
        lifeSkillsPage:true,
        valuebleExpireancePage:false,
      },
      transLang: '',
      lang: [],
      dialogFirst: false,
      dialog: false,
      selected: {}
    }
  },
  created () {
    this.lang =  JSON.parse(localStorage.getItem('translate'));
    this.getCategory();
  },
  methods: {
     lifeSkillsPageChange()
    {
      this.selected.lifeSkillsPage = !this.selected.lifeSkillsPage;
    },
    valuebleExpireanceChange()
    {
      this.selected.valuebleExpireancePage = !this.selected.valuebleExpireancePage;
    },
    onNameInput(e){
      this.selected.name = e;
    },
    openCategoryT (lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    getLang(trans){
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    getCategory () {
      axios.get('/eight-page/category').then(res => {
        this.categories = res.data.sort((a, b) => a.order_index - b.order_index);
      });
    },
    createCategory () {
      axios.post('/eight-page/category', this.new_category).then(res => {
        this.new_category = {
          name: '',
          color: '',
          lifeSkillsPage:true,
          valuebleExpireancePage:false,
        };
        this.getCategory();
      });
    },
    deleteCategory (item) {
      this.dialog = false;
      axios.delete('/eight-page/category/' + this.selected.id).then(res => {
        this.getCategory();
      });
    },
    openCategory (item) {
      this.dialog = true;
      this.selected = item;
    },
    updateCategory () {
      this.dialog = false;
      axios.put('/eight-page/category/' + this.selected.id, this.selected).then(res => {
        this.getCategory();
      });
    },
    updatePopularT () {
      this.dialogFirst = false;
      axios.put('/eight-page/category/' + this.selected.id, this.selected).then(res => {
        this.getCategory();
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 640px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 13px;
}

ul.ks-cboxtags {
    list-style: none;
    text-align: center;
}
ul.ks-cboxtags li{
  display: inline;
  margin: 10px;
}
ul.ks-cboxtags li label{
    display: inline-block;
    background-color: rgba(255, 255, 255, .9);
    border: 2px solid rgba(139, 139, 139, .3);
    color: #adadad;
    border-radius: 25px;
    white-space: nowrap;
    margin: 3px 0px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: all .2s;
}

ul.ks-cboxtags li label {
    padding: 8px 12px;
    cursor: pointer;
}

ul.ks-cboxtags li label::before {
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: 12px;
    padding: 2px 6px 2px 2px;
    content: "+";
    transition: transform .3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked + label::before {
    content: "✔";
    transform: rotate(-360deg);
    transition: transform .3s ease-in-out;
}

ul.ks-cboxtags li input[type="checkbox"]:checked + label {
    border: 2px solid #1bdbf8;
    background-color: #12bbd4;
    color: #fff;
    transition: all .2s;
}

ul.ks-cboxtags li input[type="checkbox"] {
  display: absolute;
}
ul.ks-cboxtags li input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}
ul.ks-cboxtags li input[type="checkbox"]:focus + label {
}
.create_block_new{
   width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;

  > * {
    max-width: 100%;
    margin: 10px;
  }
}
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