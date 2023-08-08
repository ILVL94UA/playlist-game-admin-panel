<template lang="html">
  <div>
    <h1>SCHOOLS</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-text-field solo label="City" v-model="city"></v-text-field>
      <v-date-picker
          v-model="endDate"
      ></v-date-picker>

      <!-- <v-select
        label="Type"
        v-model="type"
        :items="['municipality', 'school']"
      ></v-select> -->
      <v-btn @click="create" text color="success">add new school</v-btn>
    </v-layout>

    <v-text-field solo label="Search by name and city" v-model="search"></v-text-field>

    <v-data-table
        v-if="filteredData.length"
        :headers="[
        { text: 'NAME', value: 'name' },
        { text: 'CITY', value: 'city' },
        { text: 'End date', value: 'endDate' },
        { text: 'EDIT', value: 'actions' },
      ]"
        :items="filteredData"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-if="selected.translation"
        v-model="dialog.gift"
        width="500"
    >
      <v-card>
        <v-card-title
            class="headline grey lighten-2"
            primary-title
        >
          Updating school
        </v-card-title>

        <v-card-text>
          <v-text-field @input="onInputName" v-model="selected.translation[0].data.name" label="School name"></v-text-field>
          <v-text-field @input="onInputCity" v-model="selected.translation[0].data.city" label="City"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 15px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <!-- <v-select
            label="Type"
            v-model="selected.type"
            :items="['municipality', 'school']"
          ></v-select> -->
          <v-date-picker
              v-model="selected.endDate"
          ></v-date-picker>

          <v-btn small color="info" @click="$refs.file.click()">
            Upload image
          </v-btn>
          <input v-show="false" ref="file" type="file" @change="updateImage" >
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
          <v-text-field label="Name" v-model="transLang.data.name" category="text"></v-text-field>
          <v-text-field label="City" v-model="transLang.data.city" category="text"></v-text-field>

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
  data() {
    return {
      selected: {},
      dialog: {
        gift: false,
      },
      city: '',
      name: '',
      type: 'school',
      endDate: '',
      text: '',
      search: '',
      data: [],
      transLang: '',
      lang: [],
      dialogFirst: false,
    };
  },
  methods: {
    onInputCity(e)
    {
      this.selected.city = e;
    },
    onInputName(e){
      this.selected.name = e;
    },
    updateImage() {
      var data = new FormData();
      data.append('file', this.$refs.file.files[0]);
      axios.post('/school/' + this.selected.id_school + '/setImage', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    openCategoryT (lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    getLang(trans){
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    sync() {
      axios.get('/school').then(res => {
        this.data = res.data;
      });
    },
    create() {
      axios.post('/school', {
        name: this.name,
        city: this.city,
        endDate: this.endDate,
        type: this.type,
      }).then(res => {
        this.sync();
      });
    },
    edit(item) {
      this.selected = item;
      this.dialog.gift = true;
    },
    update() {
      axios.put('/school/' + this.selected.id_school, this.selected).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    updatePopularT () {
      this.dialogFirst = false;
      axios.put('/school/' + this.selected.id_school, this.selected).then(res => {
        this.sync();
      });
    },
    remove() {
      axios.delete('/school/' + this.selected.id_school).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    }
  },
  created() {
    this.lang =  JSON.parse(localStorage.getItem('translate'));
    this.sync();
  },
  computed: {
    filteredData: function () {
      if (this.search) {
        let array = [];
        this.data.forEach(element=>{
          if(element.name.includes(this.search))
          {
              array.push(element);
          }
          else if(element.city!=null && element.city != "")
          {
            if(element.city.includes(this.search))
            {
              array.push(element);
            }
          }
        })
        return array.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      }
      else{
        return this.data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.inputs > * {
  margin: 10px;
  width: calc(50% - 20px);
}

</style>
