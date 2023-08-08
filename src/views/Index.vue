<template lang="html">
  <div class="ind">
    <h1>This is admin panel</h1>
    <v-divider/>
    <v-layout row align-start class="py-4">
      <v-checkbox
        v-model="isSchool"
        label="Is school"
      ></v-checkbox>
      <v-checkbox
        v-model="promo.renew"
        label="To renew"
      ></v-checkbox>
      <v-text-field label="Limit" v-model="promo.limit" type="number"></v-text-field>

      <v-text-field label="Promo client" v-model="promo.client" type="text"></v-text-field>
      <v-select
        v-if="isSchool"
        label="Promo school"
        v-model="promo.schoolId"
        :items="schools"
        item-text="name"
        item-value="id_school"
      ></v-select>
      <v-select
        v-if="isSchool"
        label="Promo position"
        v-model="promo.position"
        :items="[
          {
            value: 'teacher',
            label: 'Teacher',
          },
          {
            value: 'prof-teacher',
            label: 'Prof-teacher',
          },
          {
            value: 'director',
            label: 'Director',
          },
          {
            value: 'student',
            label: 'Student',
          },
          {
            value: 'parent',
            label: 'Parent',
          },
        ]"
        item-text="label"
        item-value="value"
      ></v-select>
      <v-text-field label="Promo code" v-model.trim="promo.value" type="text"></v-text-field>
      <v-select
        v-if="!isSchool"
        label="Subs type"
        v-model="promo.type"
        :items="[
          {
            value: 'month',
            label: 'Month subscription',
          },
          {
            value: 'six',
            label: 'Half year',
          },
          {
            value: 'quarter',
            label: 'Quarter',
          },
          {
            value: 'year',
            label: 'Year',
          },
          {
            value: 'discount',
            label: 'Discount',
          },
          {
            value: 'games',
            label: 'X Games',
          },
        ]"
        item-text="label"
        item-value="value"
      ></v-select>
       <v-text-field   v-if="!isSchool" label="Days" v-model="promo.days" type="number"></v-text-field>

      <v-text-field
        v-if="promo.type == 'games'"
        label="Number of games"
        v-model="promo.games"
        type="number"
      ></v-text-field>
      <v-btn @click="newPromoCode" color="success">
        create
      </v-btn>
    </v-layout>
    <v-layout>
      <v-text-field solo label="Search by code or client" v-model="search" @input="sortPromosBySearch"></v-text-field>
    </v-layout>
    <v-layout row align-start class="py-2">
        <!-- { text: 'CITY', value: 'city' }, -->
      <v-data-table
        v-if="promo.promos"
        :headers="[
          { text: 'CLIENT', value: 'client' },
          { text: 'SCHOOL', value: 'id_school' },
          { text: 'POSITION', value: 'position' },
          { text: 'CODE', value: 'value' },
          { text: 'DISCOUNT %', value: 'discount' },
          { text: 'TYPE', value: 'type' },
          { text: 'DAYS', value: 'days' },
          { text: 'USED', value: 'used' },
          { text: 'LIMIT', value: 'limit' },
          { text: 'RENEW', value: 'renew' },
          { text: 'IMG', value: 'img' },
          { text: 'ADD IMG', value: 'up' },
          { text: 'DELETE', value: 'actions', sortable: false },
          { text: 'EDIT DISCOUNT', value: 'editDis', sortable: false },
          { text: 'EDIT SETTINGS', value: 'edit', sortable: false },
        ]"
        :items="promo.promos"
        class="pb-4"
      >
        <template v-slot:item.img="{ item }">
          <img class="promo_img" :src="item.img.url" v-if="item.img != null" />
        </template>

        <template v-slot:item.up="{ item }">
          <v-btn v-if="item.position == '' || item.position == null" @click="uploadImg(item)" color="success">upload</v-btn>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn @click="deletePromoCode(item)" color="error">delete</v-btn>
        </template>

        <template v-slot:item.editDis="{ item }">
        <v-btn text @click="editDis(item)" color="info">EDIT DISCOUNT</v-btn>
      </template>

        <template v-slot:item.edit="{ item }">
        <v-btn text @click="edit(item)" color="info">EDIT SETTINGS</v-btn>
      </template>


        <template v-slot:item.id_school="{ item }">
          {{getSchoolName(item.id_school)}}
        </template>
        <template v-slot:item.limit="{ item }">
          <template v-if="item.limit == 0">
            unlimited
          </template>
          <template v-else>
            {{item.limit - item.used}}
          </template>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog.promoSetting" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating promo settings
        </v-card-title>
        <v-card-title>
          Playlist Settings
        </v-card-title>

        <v-card-text>
          <div style="padding: 10px; width: 100%; display: flex; flex-direction: row; justify-content: space-between;">
          <div>
          <v-switch label="Children" id="checkboxchild" @change="locationsSort('child')" v-model="section.child" />
        </div>
          <div>
          <v-switch label="Adults" id="checkboxadult" @change="locationsSort('adult')" v-model="section.adult"/>
        </div>
          <div>
          <v-switch label="Family" id="checkboxfamily" @change="locationsSort('family')" v-model="section.family"/>
        </div>
      </div>
        <div>
          <v-btn @click="saveSections" color="success" style="margin-bottom: 20px;">
            Save Sections
          </v-btn>
        </div>
        <div v-if="section.child==true||section.adult==true||section.family==true" class="display-1 mb-2">Locations</div>
      <v-divider v-if="section.child==true||section.adult==true||section.family==true"/>
      <v-layout v-if="section.child==true||section.adult==true||section.family==true" row align-start class="pt-4">
        <v-select
          label="Locations"
          @input="onLocationsChange"
          :value="resultedSettings.locations.map(n => n.id_location)"
          chips
          :items="locations"
          item-text="name"
          item-value="id_setting"
          solo
          multiple
        ></v-select>
      </v-layout>
      <div class="display-1 mb-2">Gifts</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-select
          label="In promo gifts"
          v-model="resultedSettings.categories"
          chips
          :items="categories"
          item-text="name"
          item-value="id_category"
          solo
          multiple
        ></v-select>
        
      </v-layout>
      <v-divider></v-divider>
      <v-card-title>
        Shootlist Settings
      </v-card-title>
      <div class="display-1 mb-2">Shootlist categories</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-select
          label="In promo shootlist categories"
          v-model="resultedSettingsQuestions"
          chips
          :items="shootlistCategories"
          item-text="name"
          item-value="id"
          solo
          multiple
        ></v-select>
        
      </v-layout>
        <div>
          <v-btn @click="sendData" color="success">
            Send settings
          </v-btn>
        </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.discountSettings" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating promo discount
        </v-card-title>

        <v-card-text>
          <v-layout>
            <!-- <v-text-field
            label="Discount %"
            v-model="discount"
            type="number"
            class="pr-3">
            </v-text-field> -->
             <v-select
            style="padding: 0px 20px 0px 20px;"
            label="Select discount"
            v-model="discount"
            chips
            :items="discounts"
            solo
          ></v-select>
          </v-layout>
        <div>
          <v-btn @click="sendDataDiscount" color="success">
            Save
          </v-btn>
        </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-layout>
    <v-divider/>
    <v-layout row align-start class="py-4">
      <v-text-field
        label="Frequency of appearance of pop-up games"
        v-model="prices.playlist"
        type="number"
        class="pr-3"
      ></v-text-field>
      <v-text-field
        label="Frequency of appearance of pop-up questions"
        v-model="prices.shootlist"
        type="number"
        class="pr-3"
      ></v-text-field>
      <!-- <v-text-field
        label="Number of games"
        v-model="prices.games_num"
        type="number"
        class="pr-3"
      ></v-text-field> -->
      <v-text-field
        label="Price of one month"
        v-model="prices.month"
        type="number"
        class="pr-3"
      ></v-text-field>
       <v-text-field
        :label="`Price of quarter`"
        v-model="prices.quarter"
        type="number"
        class="pr-3"
      ></v-text-field>
      <v-text-field
        label="Price of year"
        v-model="prices.year"
        type="number"
      ></v-text-field>
      <v-btn @click="updatePrices" color="success">
        save
      </v-btn>
    </v-layout>
    <v-layout row align-start class="py-3" v-for="variable in variables" :key="variable.id_variable">
      <v-layout row align-start class="pb-3" >
        <v-text-field
          :label="`${variable.name}`"
          v-model="variable.value"
          type="text"
          class="pr-3"
          :disabled = "variable.name=='presentation_visit'||variable.name=='sitelink_visit'?true:false"
        ></v-text-field>
        <v-btn @click="updateVariable(variable)" color="success" v-if="variable.name!='presentation_visit' && variable.name!='sitelink_visit'">
          save
        </v-btn>
      </v-layout>
    </v-layout>

    <input v-show="false" ref="file" type="file" accept="image/*" @change="updateImage">
    <v-snackbar
      v-model="alert.update"
      right
      top
      :timeout="2000"
    >
      Updated.
      <v-btn
        color="pink"
        flat
        @click="alert.update = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      discounts:['10','20','30','40','50'],
      dialog: {
        promoSetting: false,
        discountSettings: false,
      },
      alert: {
        update: false,
        delete: false,
      },
      search:null,
      promo: {
        promos: [],
        promosDefault: [],
        client: '',
        value: '',
        type: '',
        games: 40,
        position: '',
        schoolId: '',
        limit: 0,
        renew: false,
        days:0,
      },
      isSchool: false,
      prices: {},
      variables: [],
      schools: [],
      shootlistvariables: [],
      selected: null,
      discount: null,
      locationsData: null,
      locations: null,
      categories:null,
      shootlistCategories:null,
      section: {
       child: false,
       adult: false,
       family: false
      },
      resultedSettings: {
        sections: [],
        locations: [],
        categories: []
      },
      resultedSettingsQuestions:null,
    };
  },
  methods: {
    sendDataDiscount(){
      this.selected.discount = this.discount;
      axios.put('admin/promo/updateDiscount/'+this.selected.id_promo,this.selected).then(()=>{
        console.log('ok');
      })
    },
    sortPromosBySearch(e)
    {
      this.promo.promos = this.promo.promosDefault.filter(x=>x.value.toLowerCase().includes(e.toLowerCase())||x.client.toLowerCase().includes(e.toLowerCase()));
      this.promo.promos = this.promo.promos.sort((a, b) => (a.client != "" ? a.client : Infinity) > (b.client != "" ? b.client : Infinity));
    },
    locationsSort(e)
    {
      switch(e)
      {
        case 'child':
          if(this.section.child==true)
          {
            if(this.section.adult == false && this.section.family == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'child');
            }
            else if(this.section.adult == false && this.section.family == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'child' || x.type == 'family');
            }
            else if(this.section.adult == true && this.section.family == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'child' || x.type == 'adult');
            }
            else if(this.section.adult == true && this.section.family == true)
            {
              this.locations = this.locationsData;
            }
          }
          else
          {
            if(this.section.adult == true && this.section.family == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'family'||x.type == 'adult');
            }
            else if(this.section.adult == true && this.section.family == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult');
            }
            else if(this.section.adult == false && this.section.family == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'family');
            }
            else if(this.section.adult == false && this.section.family == false)
            {
              this.locations = null;
            }
          }
          break;


        case 'adult':
        if(this.section.adult==true)
          {
            if(this.section.child == false && this.section.family == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult');
            }
            else if(this.section.child == false && this.section.family == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult' || x.type == 'family');
            }
            else if(this.section.child == true && this.section.family == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult' || x.type == 'child');
            }
            else if(this.section.child == true && this.section.family == true)
            {
              this.locations = this.locationsData;
            }
          }
          else
          {
            if(this.section.child == true && this.section.family == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'family'||x.type == 'child');
            }
            else if(this.section.child == true && this.section.family == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'child');
            }
            else if(this.section.child == false && this.section.family == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'family');
            }
            else if(this.section.child == false && this.section.family == false)
            {
              this.locations = null;
            }
          }
          break;


        case 'family':
        if(this.section.family==true)
          {
            if(this.section.child == false && this.section.adult == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'family');
            }
            else if(this.section.child == false && this.section.adult == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult' || x.type == 'family');
            }
            else if(this.section.child == true && this.section.adult == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'family' || x.type == 'child');
            }
            else if(this.section.child == true && this.section.adult == true)
            {
              this.locations = this.locationsData;
            }
          }
          else
          {
            if(this.section.child == true && this.section.adult == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult'||x.type == 'child');
            }
            else if(this.section.child == true && this.section.adult == false)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'child');
            }
            else if(this.section.child == false && this.section.adult == true)
            {
              this.locations = this.locationsData.filter(x=>x.type == 'adult');
            }
            else if(this.section.child == false && this.section.adult == false)
            {
              this.locations = null;
            }
          }
          break;
          default:
            break;
      }

      let array = [];
      this.resultedSettings.locations = this.resultedSettings.locations.filter(x=>this.locations.includes(x.id_location));
    },
    getCategory () {

    axios.get('/shootlist/categoryAdm').then(res => {
      this.shootlistCategories = res.data.categories;
    });

    },
    syncLocations() {
      axios.get('/playlist/settings').then(res => {
        this.locationsData = res.data;
        this.locations = this.locationsData;
      });
    },
    syncCategories() {
      axios.get('/playlist/categories').then(res => {
        this.categories = res.data;
      });
    },
    onLocationsChange(value) {
      console.log(value)
      this.resultedSettings.locations = value.map(n => {
        const loc = this.resultedSettings.locations.find(z => z.id_location == n);
        return {
          id_location: n,
        }
      });
      
    },
    sendData()
    {
      this.selected.settings_games = this.resultedSettings;
      this.selected.settings_questions = this.resultedSettingsQuestions;
      axios.post('/admin/promo/editPromoSettings', {
        data: this.selected
      }).then(res => {
        this.alert.update = true;
      });
    },
    saveSections()
    {
      let arr = [];
      if(this.section.child == true)
      {
        arr.push('child');
      }
      if(this.section.adult == true)
      {
        arr.push('adult');
      }
      if(this.section.family == true)
      {
        arr.push('family');
      }
      console.log(arr)
      this.resultedSettings.sections = arr;
      this.selected.settings_games = arr;
    },
    uploadImg (item) {
      this.selected = item;
      this.$refs.file.click()
    },
    updateImage() {
      var data = new FormData();
      data.append('file', this.$refs.file.files[0]);
      axios.post('/admin/promo/storeImg/' + this.selected.id_promo, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.selected.img = res.data;
      });
    },
    getSchoolName (id_school) {
      var school = this.schools.find(school => Number(school.id_school) == Number(id_school));
      return school ? school.name : '';
    },
    getSchool () {
      axios.get('/school').then(res => {
        this.schools = res.data;
        // console.log(this.schools);
      });
    },
    newPromoCode() {
      axios.post('/admin/promo', {
        client: this.promo.client,
        position: this.promo.position,
        schoolId: this.promo.schoolId,
        value: this.promo.value,
        type: this.promo.type,
        games: this.promo.games,
        renew: this.promo.renew,
        limit: this.promo.limit,
        isSchool: this.isSchool,
        days: this.promo.days
      }).then(res => {
        this.getPromoCodes();
      }).catch(err => {
        alert('Promo code with this code already exists');
      });
    },
    getPromoCodes() {
      axios.get('/admin/promo').then(res => {
        this.promo.promosDefault = res.data.sort((a, b) => a.client.toLowerCase()  > b.client.toLowerCase() ? 1 : -1);
        this.promo.promos = res.data.sort((a, b) => a.client!=''&&b.client!=''? (a.client.toLowerCase()  > b.client.toLowerCase() ? 1 : -1):-1);
      });
    },
    updatePromoCode(item) {
      axios.put('/admin/promo/' + item.id_promo, {
        value: item.value,
      });
    },
    deletePromoCode(item) {
      axios.delete('/admin/promo/' + item.id_promo).then(res => {
        this.getPromoCodes();
      });
    },
    edit(item) {
      this.selected = item;
      this.dialog.promoSetting = true;
      if(this.selected.settings_games != null)
      {
        this.resultedSettings.locations = this.selected.settings_games.locations;
        this.resultedSettings.categories = this.selected.settings_games.categories;
        if(this.selected.settings_games.sections.includes('child'))
        {
          this.section.child=true;
        }
        else
        {
          this.section.child=false;
        }
        if(this.selected.settings_games.sections.includes('adult'))
        {
          this.section.adult=true;
        }
        else
        {
          this.section.adult=false;
        }
        if(this.selected.settings_games.sections.includes('family'))
        {
          this.section.family=true;
        }
        else
        {
          this.section.family=false;
        }
      }
      else
      {
        this.section.family = false;
        this.section.adult = false;
        this.section.child = false;
      }
      if(this.selected.settings_questions != null)
      {
        this.resultedSettingsQuestions = this.selected.settings_questions;
      }
      else
      {
        this.resultedSettingsQuestions = null;
      }
      // this.selected.settings_games.sections.forEach(element=>{
      //   console.log(element)
      // })
      this.saveSections();
      console.log(this.selected)
    },
    editDis(item)
    {
      this.selected = item;
      console.log(this.selected)
      this.discount = item.discount;
      this.dialog.discountSettings = true;
    },
    updatePrices() {
      axios.put('/admin/prices', {
        prices: this.prices
      });
    },
    getPrices() {
      axios.get('/admin/prices').then(res => {
        this.prices = res.data.value;
      });
    },
    getVariables() {
      axios.get('/admin/variable').then(res => {
        this.variables = res.data;
      });
    },
    getShootVariables() {
      axios.get('/admin/variable/getShootVariables').then(res => {
        this.shootlistvariables = res.data;
      });
    },
    updateVariable(variable) {
      axios.put('/admin/variable/' + variable.id_variable, {
        value: variable.value,
      });
    },
  },
  created() {

    this.getSchool();
    this.getPromoCodes();
    this.getPrices();
    this.getVariables();
    this.syncLocations();
    this.syncCategories();
    this.getCategory();
  }
}
</script>

<style lang="scss" scoped>
.ind {
  padding-left: 400px !important;
  padding-right: 50px !important
}

.promo_img {
  max-width: 50px;
  // max-height: 100%;
}


</style>
