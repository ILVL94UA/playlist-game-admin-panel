<template>
  <div class="popular">
    <div class="create_block">
      <v-text-field label="Question" v-model="new_question.question" type="text"></v-text-field> 
      <v-text-field label="Question text" v-model="new_question.text" type="text"></v-text-field>

      <v-btn @click="createQuestion" color="success">
        create question
      </v-btn>
    </div>

    <div class="create_block">
      <v-select
        label="Gifts"
        v-model="new_popular.id_gift"
        :items="notUseGift"
        item-text="name"
        item-value="id_category"
      ></v-select>
      <v-select
        label="Category"
        v-model="new_popular.id_category"
        :items="category"
        item-text="name"
        item-value="id"
      ></v-select>
      <!-- <v-select
        label="Popular"
        v-model="new_popular.section"
        :items="[
          {label: 'Popular', value: 'popular'},
          {label: 'Known', value: 'known'},
        ]"
        item-text="label"
        item-value="value"
      ></v-select> -->
      <v-text-field label="Text 1" v-model="new_popular.sec_1" type="text"></v-text-field> 
      <v-text-field label="Text 2" v-model="new_popular.sec_2" type="text"></v-text-field>

      <v-chip
        v-if="new_popular.questions.length"
        class="ma-2"
        close
        @click:close="() => {dropQuestion(i, new_popular)}"
        v-for="(item, i) in new_popular.questions"
        :key="i"
      >
        {{item.question}}
      </v-chip>

      <v-btn @click="createPopular" color="success">
        create
      </v-btn>
    </div>
    <div class="popular_table">
      <v-data-table
        v-if="populars.length"
        :headers="[
          { text: 'NAME', value: 'id_gift' },
          { text: 'Category', value: 'id_category' },
          { text: 'Text 1', value: 'translation[0].data.sec_1' },
          { text: 'Text 2', value: 'translation[0].data.sec_2' },
          { text: 'Order Index', value: 'order_index' },
          { text: 'Edit', value: 'edit' },
          { text: 'Delete', value: 'delete' },
        ]"
        :items="populars"
      >
        <template v-slot:item.id_category="{ item }">
          {{getCategoryName(item)}}
        </template>
        <template v-slot:item.id_gift="{ item }">
          {{getGiftName(item)}}
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn text @click="deletePopular(item)" color="info">delete</v-btn>
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn text @click="openPopular(item)" color="info">edit</v-btn>
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
        <div class="create_block">
            <v-text-field label="Order Index" v-model="selected.order_index" type="text"></v-text-field> 
            
          </div>
          <div class="create_block">
            <v-text-field label="Question" v-model="new_selected_question.question" type="text"></v-text-field> 
            <v-text-field label="Question text" v-model="new_selected_question.text" type="text"></v-text-field>

            <v-btn @click="createSelectedQuestion" color="success">
              create question
            </v-btn>
          </div>

          <!-- <v-select
            label="Popular"
            v-model="selected.section"
            :items="[
              {label: 'Popular', value: 'popular'},
              {label: 'Known', value: 'known'},
            ]"
            item-text="label"
            item-value="value"
          ></v-select> -->
          <v-select
            label="Category"
            v-model="selected.id_category"
            :items="category"
            item-text="name"
            item-value="id"
          ></v-select>
          <v-text-field label="Text 1" v-model="selected.translation[0].data.sec_1" type="text"></v-text-field>
          <v-text-field label="Text 2" v-model="selected.translation[0].data.sec_2" type="text"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openModalFirst(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <!-- <v-chip
            v-if="selected.questions.length"
            class="ma-2"
            close
            @click:close="() => {dropQuestion(i, selected)}"
            v-for="(item, i) in selected.questions"
            :key="i"
          >
            {{item.question}}
          </v-chip> -->
          <div class="create_block" style="display: flex;flex-direction: column" v-if="selected.questions.length" v-for="(item, i) in selected.questions" :key="i">
            <div class="ww">
              <v-text-field label="Question" v-model="item.question" type="text"></v-text-field>
              <v-text-field label="Question text" v-model="item.text" type="text"></v-text-field>
            </div>
            <div class="languages">
              <div v-if="lang.length>0 " style="font-size: 15px!important;" class="display-1 mb-2">Translate</div>
              <template v-for="trans in selected.translation" >
                <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openModalSec(trans)" color="info">{{getLang(trans)}}</v-btn>
              </template>

            </div>
            <v-btn width="200px" @click="remove(i)" color="success">
              Delete
            </v-btn>
          </div>


          <v-btn @click="updatePopular" color="success">
            update
          </v-btn>
          
          <movies :lang="lang" :popular="selected" />
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
          <v-text-field label="Text 2" v-model="transLang.data.sec_2" category="text"></v-text-field>

          <v-layout justify-end>
          </v-layout>

          <v-btn @click="updatePopularT"  color="success">
            update
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="transLang"
      v-model="dialogSec"
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
          <v-text-field label="question 1" v-model="transLang.data.question" category="text"></v-text-field>

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
import Movies from '@/components/popular/MoviesEleven';

export default {
  data () {
    return {
      gifts: [],
      populars: [],
      dialogFirst: false,
      dialogSec: false,
      transLang: '',
      new_popular: {
        sec_1: '',
        sec_2: '',
        id_gift: '',
        section: '',
        questions: [],
        id_category: null
      },
      lang: [],
      dialog: false,
      selected: {},
      new_question: {
        question: '',
        text: '',
        // select: false
      },
      new_selected_question: {
        question: '',
        text: '',
        // select: false
      },
      category: []
    }
  },
  created () {
    this.lang =  JSON.parse(localStorage.getItem('translate'));
    this.getGift();
    this.getPopular();
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
    getCategory () {
      axios.get('/eleven-page/category').then(res => {
        this.category = res.data;
      });
    },
    openModalFirst (lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    openModalSec (lang) {
      this.dialogSec = true;
      this.transLang = lang;
    },
    getLang(trans){
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    dropQuestion (index, obj) {
      obj.questions.splice(index, 1);
    },
    createQuestion () {
      this.new_popular.questions.push({...this.new_question});
    },
    createSelectedQuestion () {
      this.selected.questions.push({...this.new_selected_question});
    },
    getGiftName (item) {
      var res = this.gifts.find(gift => gift.id_category == item.id_gift);
      return res ? res.name : '';
    },
    getCategoryName (item) {
      var res = this.category.find(cat => cat.id == item.id_category);
      return res ? res.name : '';
    },
    getGift() {
      axios.get('/playlist/categories').then(res => {
        this.gifts = res.data;
      });
    },
    getPopular () {
      axios.get('/eleven-page').then(res => {
        this.populars = res.data;
      });
    },
    createPopular () {
      axios.post('/eleven-page', this.new_popular).then(res => {
        this.new_popular = {
          sec_1: '',
          sec_2: '',
          id_gift: '',
          section: '',
        };
        this.question_id = 0;

        this.getPopular();
      });
    },
    deletePopular (item) {
      axios.delete('/eleven-page/' + item.id).then(res => {
        this.getPopular();
      });
    },
    openPopular (item) {
      this.dialog = true;
      console.log(item)
      this.selected = item;
    },
    updatePopular () {
      this.dialog = false;
      axios.put('/eleven-page/' + this.selected.id, this.selected).then(res => {
        this.getPopular();
      });
    },
    updatePopularT () {
      this.dialogFirst = false;
      this.dialogSec = false;
      axios.put('/eleven-page/' + this.selected.id, this.selected).then(res => {
        this.getPopular();
      });
    },
    remove(index) {
      this.selected.questions = this.selected.questions.filter((n, i) => index !== i);
    },
  },
  computed: {
    notUseGift: function () {
      var res = this.gifts.filter(item => {
        var flag = this.populars.find(pop => pop.id_gift == item.id_category);
        return !flag;
      });

      return res;
    }
  },
  components: {
    Movies
  }
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
  border: 2px solid #e9a1ff;
}
.create_block {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  background: #eee;

  > * {
    max-width: 100%;
    margin: 10px;
  }
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
</style>