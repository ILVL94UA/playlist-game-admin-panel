<template>
  <div class="category">
    <div class="create_block">
      <v-text-field label="Title" v-model="new_lang.title" category="text"></v-text-field>
      <v-text-field label="Lang key" v-model="new_lang.key" category="text"></v-text-field>

      <v-btn @click="createCategory" color="success">
        create
      </v-btn>
    </div>
    <div class="category_table">
      <v-data-table
        v-if="categories.length"
        :headers="[
          { text: 'Title', value: 'lang_title' },
          { text: 'Key', value: 'lang_code' },

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
          <v-text-field label="Name" v-model="selected.lang_title" category="text"></v-text-field> 
          <v-text-field label="Key" v-model="selected.lang_code" category="text"></v-text-field> 
          <!-- <v-layout justify-end>
            <img :src="selected.img_url" width="100" alt="">
            <v-btn small color="info" @click="$refs.file.click()">
              Upload image
            </v-btn>
          </v-layout> -->
          <!-- <input v-show="false" ref="file" type="file" @change="updateImage" > -->
          <v-btn @click="updateCategory" color="success">
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
      new_lang: {
        title: '',
        key: '',
      },
      dialog: false,
      selected: {}
    }
  },
  created () {
    this.getCategory();

  },
  methods: {
    getCategory () {
      axios.get('/lang').then(res => {
        this.categories = res.data;
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
      axios.post('/lang',{lang_code: this.new_lang.key, lang_title: this.new_lang.title, translation: ''} ).then(res => {
        this.getCategory();
      });

    },
    deleteCategory (item) {
      axios.delete('/lang/' + item.id_lang).then(res => {
        this.getCategory();
      });
    },
    openCategory (item) {
      this.dialog = true;
      this.selected = item;
    },
    updateCategory () {
      this.dialog = false;
      axios.put('/lang/' + this.selected.id_lang, this.selected).then(res => {
        this.getCategory();
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