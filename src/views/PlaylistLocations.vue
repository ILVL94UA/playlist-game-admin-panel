<template lang="html">
  <div>
    <h1>PLAYLIST SETTINGS</h1>
    <v-layout row wrap class="inputs">
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-select
        label="Section"
        v-model="type"
        :items="[
          'family',
          'child',
          'adult'
        ]"
        solo
      ></v-select>
      <v-btn @click="create" text color="success">add new setting</v-btn>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :headers="[
        { text: 'NAME', value: 'name' },
        { text: 'SECTION', value: 'type' },
        { text: 'EDIT', value: 'actions', sortable: false },
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
          Updating playlist locations
        </v-card-title>

        <v-card-text>
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
          <img :src="selected.img" width="100" alt="">
          <v-text-field @input="onInputName" v-model="selected.translation[0].data.name" label="Setting name"></v-text-field>
          <div class="languages">
            <div v-if="lang.length>0 " style="font-size: 20px!important;" class="display-1 mb-2">Translate</div>
            <template v-for="trans in selected.translation" >
              <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategoryT(trans)" color="info">{{getLang(trans)}}</v-btn>
            </template>

          </div>
          <v-btn :loading="loading.file" small color="info" @click="$refs.file.click()">
            Upload image
          </v-btn>
          <v-switch v-model="selected.is_default" label="Is default"></v-switch>
          <input v-show="false" ref="file" type="file" accept="image/svg+xml" @change="updateImage" >
          <v-select
            label="Section"
            v-model="selected.type"
            :items="[
              'family',
              'child',
              'adult'
            ]"
            solo
          ></v-select>
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
export default {
  data() {
    return {
      selected: {},
      loading: {
        file: false,
      },
      dialog: {
        gift: false,
      },
      data: [],
      dialogTr: false,
      transLang: '',
      lang: [],
      name: '',
      type: '',
      text: '',
      promos:[],
      promosFiltered:[]
    };
  },
  methods: {
    onInputName(e){
      this.selected.name = e;
    },
    sync() {
      axios.get('/playlist/settings').then(res => {
        this.data = res.data;
      });
    },
    create() {
      axios.post('/playlist/settings', {
        name: this.name,
        type: this.type,
      }).then(res => {
        this.sync();
      });
    },
    getLang(trans){
      console.log(trans);
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    openCategoryT (lang) {
      this.dialogTr = true;
      this.transLang = lang;
    },
    edit(item) {
      this.selected = item;
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
    updateT() {
      axios.put('/playlist/settings/' + this.selected.id_setting, this.selected).then(res => {
        this.sync();
        this.dialogTr =false;
      });
    },
    update() {
      axios.put('/playlist/settings/' + this.selected.id_setting, this.selected).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    remove() {
      axios.delete('/playlist/settings/' + this.selected.id_setting).then(res => {
        this.sync();
        this.dialog.gift = false;
      });
    },
    updateImage() {
      var data = new FormData();
      data.append('file', this.$refs.file.files[0]);
      this.loading.file = true;
      axios.post('/playlist/settings/' + this.selected.id_setting + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.selected.img = res.data.url;
      }).finally(() => {
        this.loading.file = false;
      });
    }
  },
  created() {
    this.lang =  JSON.parse(localStorage.getItem('translate'));

    this.sync();
    this.getPromoCodes();
  }
}
</script>

<style lang="scss" scoped>



</style>
