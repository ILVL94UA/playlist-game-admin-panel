<template lang="html">
  <div>
    <h1>GIFTS</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-btn @click="create" text color="success">add new gift</v-btn>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="editIndexForSections" color="success">Edit Indexes for Section</v-btn>
    </v-layout>
    <v-layout>
      <v-btn :loading="loadingUpd" @click="updateSettings" flat color="success">Update users default settings</v-btn>
    </v-layout>
    
    <v-data-table
      :pagination="{
        rowsPerPage: -1,
      }"
      v-if="data.length"
      :headers="[
        { text: 'NAME', value: 'name' },
        { text: 'START DAY', value: 'date' },
        { text: 'NUMBER VIEWS', value: 'views' },
        { text: 'PLAYED', value: 'played' },
        { text: 'Life skills', value:'life_skills'},
        { text: 'number games containing it', value: 'count' },
        { text: 'EDIT', value: 'actions', sortable: false },
      ]"
      :items="data"
    >
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date * 1000) | dateFormat("DD.MM.YY") }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog.gift" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating gift
        </v-card-title>

        <v-card-text>
          <v-layout justify-end>
            <img :src="selected.img_url" width="100" alt="" />
            <v-btn small color="info" @click="$refs.file.click()">
              Upload image
            </v-btn>
          </v-layout>
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
        <v-switch
            v-model="selected.is_default"
            label="Is default"
          />
          </v-layout>
          <v-layout>
        <v-switch
            v-model="selected.life_skills"
            label="Life skills"
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
          <input v-show="false" ref="file" type="file" @change="updateImage" />
          <v-text-field
            @input="giftNameChanged"
            v-model="selected.name"
            label="Gift name"
          ></v-text-field>
          <div class="languages">
            <div
              v-if="lang.length > 0"
              style="font-size: 20px!important;"
              class="display-1 mb-2"
            >
              Translate
            </div>
            <template v-for="trans in selected.translation">
              <v-btn
                v-if="getLang(trans) !== 'Hebrew'"
                text
                @click="openCategory(trans)"
                color="info"
                >{{ getLang(trans) }}</v-btn
              >
            </template>
          </div>
          <v-select
          label="Select category for this gift"
          @input="onLocationsChange"
          :value="selectedSect"
          :items="sections"
          item-text="name"
          item-value="id_section"
          solo
          :multiple="false"
        ></v-select>
          <!-- <v-select
            label="Select category for this gift"
            v-model="selected.id_section"
            :items="sections"
            item-text="name"
            item-value="id_section"
          ></v-select> -->
          <v-btn
            @click="clearCategory"
            color="warning" flat>Clear category</v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" icon small @click="remove">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" flat @click="update">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="transLang" v-model="dialogTr" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating translate {{ getLang(transLang) }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Name"
            v-model="transLang.data.name"
            category="text"
          ></v-text-field>
          <v-layout justify-end> </v-layout>

          <v-btn @click="updateT" color="success">
            update
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.giftsIndexes" width="700" height="600">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating indexes for group playlists in gift
        </v-card-title>
        
        <v-card-text>
          <v-layout>
            <v-card-title>
              Gift
            </v-card-title>
          </v-layout>
          <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search section'"
                v-model="indexes.sectionSearch"
                @input="filterGroupIndexesSectionsFrom"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="syncIndexes"
                label="Select section"
                v-model="indexes.section"
                chips
                :items="indexes.indexesSections"
                item-text="name"
                item-value="id_section"
                solo
              ></v-select>
          </v-layout>
        <v-layout>
          <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search gift'"
                v-model="indexes.giftSearch"
                @input="filterGroupIndexesGifts"
                type="text"
              ></v-text-field>
            </v-layout>
          <v-layout row align-start class="pt-4" style="padding: 35px;height: 420px;overflow-y: scroll;display: block;margin-bottom: 50px;">
          <v-text-field 
            v-if="indexes.indexedArraySearch!=null"
            :label="gift.name + ' order index'" 
            v-for="gift in indexes.indexedArraySearch"
            v-model="gift.order_index" 
            type="number" 
            outline
          ></v-text-field>
        </v-layout>
        <v-layout>
          <v-btn style="margin-bottom: 5px;" @click="updateIndexesNew" color="success">
          <v-icon>add</v-icon>
            UPDATE INDEXES
          </v-btn>
        </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingUpd:false,
      selected: {},
      selectedSect:"",
      dialog: {
        gift: false,
        giftsIndexes:false,
      },
      indexes:{
        sectionSearch:null,
        indexesSections:null,
        section:null,
        giftSearch:null,
        indexedArraySearch:null,
        indexedArray:null,
      },
      transLang: "",
      dialogTr: false,
      lang: [],
      sections: [],
      data: [],
      name: "",
      promos:[],
      promosFiltered:[]
    };
  },
  methods: {
    syncIndexes() {
      console.log(this.indexes.section)
      axios
        .post("/playlist/bySection", {
          query: this.indexes.section,
        })
        .then((res) => {
         this.indexes.indexedArray = res.data.data.sort(function ( a, b ) { 
            return (a.order_index===null)-(b.order_index===null) || +(a.order_index>b.order_index)||-(a.order_index<b.order_index);
          });;
          this.indexes.indexedArraySearch = res.data.data.sort(function ( a, b ) { 
            return (a.order_index===null)-(b.order_index===null) || +(a.order_index>b.order_index)||-(a.order_index<b.order_index);
          });;
        })
        .catch((err) => {
         
        });
    },
    updateIndexesNew(){
      console.log(this.indexes.indexedArraySearch);
      axios
        .post("/playlist/updateIndexesSect", {
          data: this.indexes.indexedArraySearch,
        })
        .then((res) => {
          console.log(res.data)
          this.dialog.giftsIndexes = false;
          this.indexes.giftSearch=null;
          this.indexes.section=null;
          this.indexes.indexedArraySearch=null;
          this.indexes.indexedArray=null;
        })
        .catch((err) => {
          this.dialog.giftsIndexes = false;
          this.indexes.giftSearch=null;
          this.indexes.section=null;
          this.indexes.indexedArraySearch=null;
          this.indexes.indexedArray=null;
        });
    },
    filterGroupIndexesGifts(e){
      this.indexes.indexedArraySearch = this.indexes.indexedArray.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupIndexesSectionsFrom(e){
      this.indexes.indexesSections = this.sections.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    editIndexForSections(){
      this.dialog.giftsIndexes = true;
    },
    updateSettings(){
      this.loadingUpd = true;
      axios.get('/admin/user/categoriesUpdate').then(res => {
        if(res.data.success==true)
        {
          this.loadingUpd = false;
        }
      }).catch(err=>{
        this.loadingUpd = false;
      }).finally(()=>{
        this.loadingUpd = false;
      });
    },
    onLocationsChange(value) {
      this.selected.id_section = value;
    },
    clearCategory(e){
      this.selected.id_section = null;
      this.selectedSect = null;
    },
    giftNameChanged(e) {
      this.selected.translation[0].data.name=e;
    },
    openCategory(lang) {
      this.dialogTr = true;
      this.transLang = lang;
    },
    getLang(trans) {
      console.log(trans);
      let item = this.lang.find((item) => {
        return item.lang_code === trans.langKey;
      });
      return item
        ? item.lang_title
        : trans.langKey === "heb"
        ? "Hebrew"
        : trans.langKey;
    },
    sync() {
      axios.get("/playlist/categories").then((res) => {
        this.data = res.data;
      });
      this.lang = JSON.parse(localStorage.getItem("translate"));
    },
    syncSections() {
      axios.get("/playlist/category/sections").then((res) => {
        this.sections = res.data;
        this.indexes.indexesSections = res.data;
      });
    },
    create() {
      axios
        .post("/playlist/category", {
          name: this.name,
        })
        .then((res) => {
          this.sync();
        });
    },
    edit(item) {
      this.selected = item;
      this.selectedSect = this.selected.id_section!=null?this.selected.id_section.toString():null;
      this.dialog.gift = true;
    },
    getPromoCodes() {
      axios.get('/admin/promo').then(res => {
        this.promos = res.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
        this.promosFiltered = res.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
      });
    },
    filterPromo(e){
      this.promosFiltered = this.promos.filter(x=>x.value.toLowerCase().includes(e.toLowerCase()));
    },
    update() {
      axios
        .put("/playlist/category/" + this.selected.id_category, this.selected)
        .then((res) => {
          this.sync();
          this.dialog.gift = false;
        });
    },
    updateT() {
      axios
        .put("/playlist/category/" + this.selected.id_category, this.selected)
        .then((res) => {
          this.sync();
          this.dialogTr = false;
        });
    },
    remove() {
      axios
        .delete("/playlist/category/" + this.selected.id_category)
        .then((res) => {
          this.sync();
          this.dialog.gift = false;
        });
    },
    updateImage() {
      var data = new FormData();
      data.append("file", this.$refs.file.files[0]);
      axios
        .post(
          "/playlist/category/" + this.selected.id_category + "/set-image",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.selected.img_url = res.data.url;
        });
    },
  },
  created() {
    this.sync();
    this.syncSections();
    this.getPromoCodes();
  },
};
</script>

<style lang="scss" scoped></style>
