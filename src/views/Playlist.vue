<template lang="html">
  <div>
    <h1>PLAYLIST GAMES</h1>
    <v-layout>
      <v-text-field solo label="Name" v-model="name"></v-text-field>
      <v-btn @click="create" text color="success">add new game</v-btn>
      
    </v-layout>
    <v-divider/>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="edit" color="success">Add location and gift for group</v-btn>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="editLocationToGift" color="success">From Location to Gift</v-btn>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="editGiftToLocation" color="success">From Gift to Location</v-btn>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="editGiftToGift" color="success">From Gift to Gift</v-btn>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="editIndexForGift" color="success">Edit Indexes for Gift</v-btn>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="editIndexForLoc" color="success">Edit Indexes for Location</v-btn>
    </v-layout>
    <v-layout>
      <v-dialog v-model="dialog.groupSetting" width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating group settings
        </v-card-title>
        <v-card-title class="grey lighten-2" primary-title>
          Setting the selected gift and location for selected games
        </v-card-title>
        
        <v-card-text>
          <v-layout style="margin-top: 10px;">
            <v-card-title>
              Location
            </v-card-title>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 0px 20px 0px 20px;"
            @input="sync"
            label="Select location"
            v-model="group.location"
            chips
            :items="locations"
            item-text="name"
            item-value="id_setting"
            solo
          ></v-select>
          </v-layout>
          <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearLocation" color="success">
            Clear selected
            </v-btn>
          </v-layout>
          <v-divider/>
          <v-layout>
            <v-card-title>
              Gift
            </v-card-title>
          </v-layout>
          <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search gift'"
                v-model="group.giftSearch"
                @input="filterGroupGifts"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="sync"
                label="Select gift"
                v-model="group.category"
                chips
                :items="categoriesGroup"
                item-text="name"
                item-value="id_category"
                solo
              ></v-select>
        </v-layout>
        <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearGift" color="success">
            Clear selected
            </v-btn>
          </v-layout>
        <v-divider/>
        <v-layout>
            <v-card-title>
              Playlists
            </v-card-title>
          </v-layout>
        <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search games'"
                v-model="group.gamesSearch"
                @input="filterGroupGames"
                type="text"
              ></v-text-field>
          </v-layout>
        <v-layout>
          <v-select
              style="padding: 20px 20px 0px 20px;"
            @input="sync"
            label="Select games"
            v-model="group.games"
            chips
            :items="playlists"
            item-text="name"
            item-value="id_playlist"
            solo
            multiple
          ></v-select>
        </v-layout>
        <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearGames" color="success">
            Clear selected
            </v-btn>
          </v-layout>
          <v-divider style="margin-bottom: 10px;"/>
        <v-layout>
          <div>
          <v-btn @click="groupSaveData" color="success">
            Send settings
          </v-btn>
        </div>
        </v-layout>
       
        </v-card-text>



        <v-card-actions>
         
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.locationsToGift" width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating group settings
        </v-card-title>
        <v-card-title class="grey lighten-2" primary-title>
          Setting the selected location games to gift
        </v-card-title>
        
        <v-card-text>
          <v-layout style="margin-top: 10px;">
            <v-card-title>
              Location
            </v-card-title>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 0px 20px 0px 20px;"
            @input="sync"
            label="Select location"
            v-model="locationsToGift.location"
            chips
            :items="locations"
            item-text="name"
            item-value="id_setting"
            solo
          ></v-select>
          </v-layout>
          <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearLocation" color="success">
            Clear selected
            </v-btn>
          </v-layout>
          <v-divider/>
          <v-layout>
            <v-card-title>
              Gift
            </v-card-title>
          </v-layout>
          <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search gift'"
                v-model="group.giftSearch"
                @input="filterGroupGifts"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="sync"
                label="Select gift"
                v-model="locationsToGift.category"
                chips
                :items="categoriesGroup"
                item-text="name"
                item-value="id_category"
                solo
              ></v-select>
        </v-layout>
        <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearGift" color="success">
            Clear selected
            </v-btn>
          </v-layout>
        <v-divider/>
          <v-divider style="margin-bottom: 10px;"/>
        <v-layout>
          <div>
          <v-btn @click="locationsToGiftSend" color="success">
            Send settings
          </v-btn>
        </div>
        </v-layout>
       
        </v-card-text>



        <v-card-actions>
         
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.giftToLocations" width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating group settings
        </v-card-title>
        <v-card-title class="grey lighten-2" primary-title>
          Setting the selected gift games to location
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
                :label="'Search gift'"
                v-model="group.giftSearch"
                @input="filterGroupGifts"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="sync"
                label="Select gift"
                v-model="giftToLocations.category"
                chips
                :items="categoriesGroup"
                item-text="name"
                item-value="id_category"
                solo
              ></v-select>
        </v-layout>
        <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearGift" color="success">
            Clear selected
            </v-btn>
          </v-layout>
        <v-divider/>
        <v-layout style="margin-top: 10px;">
            <v-card-title>
              Location
            </v-card-title>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 0px 20px 0px 20px;"
            @input="sync"
            label="Select location"
            v-model="giftToLocations.location"
            chips
            :items="locations"
            item-text="name"
            item-value="id_setting"
            solo
          ></v-select>
          </v-layout>
          <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearLocation" color="success">
            Clear selected
            </v-btn>
          </v-layout>
          <v-divider/>
          <v-divider style="margin-bottom: 10px;"/>
        <v-layout>
          <div>
          <v-btn @click="giftToLocationsSend" color="success">
            Send settings
          </v-btn>
        </div>
        </v-layout>
       
        </v-card-text>



        <v-card-actions>
         
        </v-card-actions>
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
                :label="'Search gift'"
                v-model="indexes.categorySearch"
                @input="filterGroupIndexesGiftsFrom"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="syncIndexes"
                label="Select gift"
                v-model="indexes.category"
                chips
                :items="indexesCategories"
                item-text="name"
                item-value="id_category"
                solo
              ></v-select>
          </v-layout>
        <v-layout>
          <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search game'"
                v-model="indexes.gamesSearch"
                @input="filterGroupIndexesGamesGift"
                type="text"
              ></v-text-field>
            </v-layout>
          <v-layout row align-start class="pt-4" style="padding: 35px;height: 420px;overflow-y: scroll;display: block;margin-bottom: 50px;">
          <v-text-field 
            v-if="indexedArraySearch!=null"
            :label="loc.name + ' order index'" 
            v-for="loc in indexedArraySearch"
            v-model="loc.order_index" 
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



        <v-card-actions>
         
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.locationIndexes" width="700" height="600">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating indexes for group playlist in location
        </v-card-title>
        
        <v-card-text>
          <v-layout>
            <v-card-title>
              Location
            </v-card-title>
          </v-layout>
          <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search location'"
                v-model="indexes.locationSearch"
                @input="filterGroupIndexesLocationFrom"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="syncIndexesLoc"
                label="Select location"
                v-model="indexes.location"
                chips
                :items="locationsLoc"
                item-text="name"
                item-value="id_setting"
                solo
              ></v-select>
          </v-layout>
          <v-layout>
          <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search game'"
                v-model="indexes.gamesSearchLoc"
                @input="filterGroupIndexesGamesLoc"
                type="text"
              ></v-text-field>
            </v-layout>
          <v-layout row align-start class="pt-4" style="padding: 35px;height: 420px;overflow-y: scroll;display: block;margin-bottom: 50px;">
          <v-text-field 
            v-if="indexedArrayLocSearch!=null"
            :label="loc.name + ' order index'" 
            v-for="loc in indexedArrayLocSearch"
            v-model="loc.order_index" 
            type="number" 
            outline
          ></v-text-field>
        </v-layout>
        <v-layout>
          <v-btn style="margin-bottom: 5px;" @click="updateIndexesNews" color="success">
          <v-icon>add</v-icon>
            UPDATE INDEXES
          </v-btn>
        </v-layout>
        </v-card-text>



        <v-card-actions>
         
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.giftToGift" width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Updating group settings
        </v-card-title>
        <v-card-title class="grey lighten-2" primary-title>
          Setting the selected gift games to location
        </v-card-title>
        
        <v-card-text>
          <v-layout>
            <v-card-title>
              Gift From
            </v-card-title>
          </v-layout>
          <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search gift'"
                v-model="group.giftSearchFrom"
                @input="filterGroupGiftsFrom"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="sync"
                label="Select gift"
                v-model="giftToGift.categoryFrom"
                chips
                :items="categoriesGroupFrom"
                item-text="name"
                item-value="id_category"
                @change="filters"
                solo
              ></v-select>
        </v-layout>
        <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearGift" color="success">
            Clear selected
            </v-btn>
          </v-layout>
        <v-divider/>
        <v-layout style="margin-top: 10px;">
            <v-card-title>
              Gift To
            </v-card-title>
          </v-layout>
          <v-layout>
            <v-text-field
                style="padding: 0px 20px 0px 20px;"
                :label="'Search gift'"
                v-model="group.giftSearchTo"
                @input="filterGroupGiftsTo"
                type="text"
              ></v-text-field>
          </v-layout>
          <v-layout>
              <v-select
              style="padding: 20px 20px 0px 20px;"
                @input="sync"
                label="Select gift"
                v-model="giftToGift.categoryTo"
                chips
                :items="categoriesGroupTo"
                item-text="name"
                item-value="id_category"
                solo
              ></v-select>
        </v-layout>
        <v-layout style="margin-bottom: 10px;">
            <v-btn style="margin-left: 20px;" @click="clearGift" color="success">
            Clear selected
            </v-btn>
          </v-layout>
          <v-divider/>
          <v-divider style="margin-bottom: 10px;"/>
        <v-layout>
          <div>
          <v-btn @click="giftToGiftSend" color="success">
            Send settings
          </v-btn>
        </div>
        </v-layout>
       
        </v-card-text>



        <v-card-actions>
         
        </v-card-actions>
      </v-card>
    </v-dialog>


    </v-layout>
    <v-divider/>
    <v-layout>
      <v-text-field @input="syncFilter" small label="Search" v-model="search.str"></v-text-field>
      <v-select
        @input="syncFilter"
        label="Locations"
        v-model="search.locations"
        chips
        :items="locations"
        item-text="name"
        item-value="id_setting"
        solo
        multiple
      ></v-select>
      <v-select
        @input="syncFilter"
        label="Categories"
        v-model="search.categories"
        chips
        :items="categories"
        item-text="name"
        item-value="id_category"
        solo
        multiple
      ></v-select>
      <v-select
        @input="syncFilter"
        label="Level"
        v-model="search.level"
        chips
        :items="[
          {
            name: 'easy',
            value: 1,
          },
          {
            name: 'Hard',
            value: 2,
          },
          {
            name: 'Hardest',
            value: 3,
          },
        ]"
        item-text="name"
        item-value="value"
        solo
      ></v-select>
    </v-layout>
    <v-data-table
      v-if="data.length"
      :hide-default-footer="true"
      :items-per-page="search.perPage"
      :headers="[
        /* { text: 'NUMBER', value: 'id_playlist' }, */
        { text: 'ORDER INDEX', value: 'order_index' },
        { text: 'NAME GAME', value: 'name' },
        { text: 'START DAY', value: 'date' },
        { text: 'CHILD', value: 'id_author' },
        { text: 'ANSWERED', value: 'played' },
        { text: 'SKIPPED', value: 'skipped' },
        { text: 'LIKED', value: 'liked' },
        { text: 'VIDEO VIEWS', value: 'opened_video' },
        { text: 'AUDIO VIEWS', value: 'opened_audio' },
        { text: 'SHARED', value: 'shared' },
        { text: 'GIFTS VIEW', value: 'opened_gifts' },
        { text: 'STATUS', value: 'show' },

        { text: 'EDIT', value: 'actions', sortable: false },
      ]"
      :items="data"
    >
     <template v-slot:item.id_author="{ item }">
      {{ item.id_author!=null ? true : false}}
    </template>
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date * 1000) | dateFormat('DD.MM.YY') }}
      </template>
      <template v-slot:item.show="{ item }">
  {{ item.show ? "VISIBLE" : "HIDDEN" }}
</template>
      <template v-slot:item.actions="{ item }">
  <v-btn text :to="'/playlist/' + item.id_playlist" color="info">edit</v-btn>
</template>
    </v-data-table>
    <div id="main">
      <div style="display: inline-block;">
          <v-select
            style="margin-top: 10px;"
            label="Games to display"
            :value="search.perPage"
            :items="search.perPageRanges"
            item-text="title"
            item-value="value"
            dense
            outlined
            @change="perPageChange"
        ></v-select>
        </div>
        <div style="display: inline-block;">
          <paginate
            v-if="pagination.pages>1"
            v-model="search.page"
            :page-count="pagination.pages"
            :page-range="5"
            :margin-pages="2"
            :click-handler="clickCallback"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'">
          </paginate>
        </div>
        <div style="display: inline-block; margin-left: 10px;">
          <label style="font-size:12px; font-family:sans-serif; font-weight: 500;">{{search.perPage*(search.page-1)+'-'+search.perPage*search.page}} of {{total}}</label>
        </div>
    </div>

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
  name: "playlist",
  data() {
    return {
      total: null,
      data: [],
      playlists: [],
      name: "",
      alert: {
        update: false,
        delete: false,
      }, 
      indexes:{
        category:null,
        categorySearch:'',
        gamesSearch:'',
        gamesSearchLoc:''
      },
      group:{
        location:null,
        category:null,
        games:null,
        giftSearch:null,
        giftSearchFrom:null,
        giftSearchTo:null,
        gamesSearch:null,
      },
      locationsToGift:{
        location:null,
        category:null,
      },
      giftToLocations:{
        location:null,
        category:null,
      },
      giftToGift:{
        categoryFrom:null,
        categoryTo:null,
      },
      search: {
        str: "",
        categories: [],
        locations: [],
        level: null,
        page: 1,
        perPage: 15,
        perPageRanges:[
          {    
            value: 5,
            title: '5'
          },
          {    
            value: 10,
            title: '10'
          },
          {    
            value: 15,
            title: '15'
          },
          {    
            value: 20,
            title: 'All'
          },]
      },
      categories: "",
      categoriesGroup: "",
      indexesCategories: "",
      categoriesGroupFrom: "",
      locations: "",
      locationsLoc: "",
      pagination: { 
        page: 1,
        pages: 1,
       },
       indexedArray:null,
       indexedArraySearch:null,
       indexedArrayLoc:null,
       indexedArrayLocSearch:null,
      dialog:{
        locationIndexes:false,
        giftsIndexes:false,
        groupSetting:false,
        locationsToGift:false,
        giftToLocations:false,
        giftToGift:false,
      }
    };
  },
  methods: {
    filters(e){
      console.log('ok');
    },
    syncFilter(){
      console.log('this')
      this.search.page = 1;
      this.pagination.pages = 1;
      this.data = [];
      this.sync();
    },
    updateIndexesNew(){
      console.log(this.indexedArray);
      axios
        .post("/playlist/updateIndexes", {
          data: this.indexedArray,
        })
        .then((res) => {
          console.log(res.data)
          this.dialog.giftsIndexes = false;
          this.indexedArray=null;
          this.indexes.category=null;
          this.indexes.categorySearch='';
        })
        .catch((err) => {
          this.dialog.giftsIndexes = false;
          this.indexedArray=null;
          this.indexes.category=null;
          this.indexes.categorySearch='';
        });
    },
    updateIndexesNews(){
      console.log(this.indexedArrayLoc);
      axios
        .post("/playlist/updateIndexesbyLocation", {
          data: this.indexedArrayLoc,
        })
        .then((res) => {
          console.log(res.data)
          this.dialog.locationIndexes = false;
          this.indexedArrayLoc=null;
          this.indexes.location=null;
          this.indexes.locationSearch='';
        })
        .catch((err) => {
          this.dialog.locationIndexes = false;
          this.indexedArrayLoc=null;
          this.indexes.location=null;
          this.indexes.locationSearch='';
        });
    },
    perPageChange(item){
      if(item!='All')
      {
        this.search.perPage=item;
        this.search.page = 1;
        this.sync();
      }
      else
      {
        this.search.perPage=this.total;
        this.search.page = 1;
        this.sync();
      }
    },
    clickCallback: function(page) {
      this.sync();
    },
    clearLocation(){
      this.group.location = null;
    },
    clearGames(){
      this.group.games = null;
    },
    clearGift(){
      this.group.category = null;
    },
    giftToLocationsSend(){
      console.log(this.giftToLocations);
      axios.post('/playlist/updateGiftToLocation',{data:this.giftToLocations}).then(()=>{
        this.alert.update = true;
      })
    },
    giftToGiftSend(){
      console.log(this.giftToGift);
      axios.post('/playlist/updateGiftToGift',{data:this.giftToGift}).then((res)=>{
        this.alert.update = true;
      })
    },
    locationsToGiftSend(){
      console.log(this.locationsToGift);
      axios.post('/playlist/updateLocationToGift',{data:this.locationsToGift}).then(()=>{
        this.alert.update = true;
      })
    },
    groupSaveData(){
      console.log(this.group)
      axios.post('/playlist/updateGiftsAndLocations',{data:this.group}).then(()=>{
        this.alert.update = true;
      })
    },
    filterGroupGifts(e){
      this.categoriesGroup = this.categories.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupGiftsFrom(e){
      this.categoriesGroupFrom = this.categories.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupIndexesGiftsFrom(e){
      this.indexesCategories = this.categories.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupIndexesLocationFrom(e){
      this.locationsLoc = this.locations.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupIndexesGamesGift(e){
      this.indexedArraySearch = this.indexedArray.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupIndexesGamesLoc(e){
      this.indexedArrayLocSearch = this.indexedArrayLoc.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupGiftsTo(e){
      this.categoriesGroupTo = this.categories.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    filterGroupGames(e){
      this.playlists = this.data.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
    },
    editLocationToGift(){
      this.dialog.locationsToGift = true;
    },
    editGiftToLocation(){
      this.dialog.giftToLocations = true;
    },
    editGiftToGift(){
      this.dialog.giftToGift = true;
    },
    edit(){
      this.dialog.groupSetting = true;
    },
    editIndexForGift(){
      this.dialog.giftsIndexes = true;
    },
    editIndexForLoc(){
      this.dialog.locationIndexes = true;
    },
    dataToDisplay(){
      return this.data;
    },
    
    syncIndexes() {
      axios
        .post("/playlist/byCategory", {
          query: this.indexes.category,
        })
        .then((res) => {
         this.indexedArray = res.data.sort(function ( a, b ) { 
            return (a.order_index===null)-(b.order_index===null) || +(a.order_index>b.order_index)||-(a.order_index<b.order_index);
          });;
          this.indexedArraySearch = res.data.sort(function ( a, b ) { 
            return (a.order_index===null)-(b.order_index===null) || +(a.order_index>b.order_index)||-(a.order_index<b.order_index);
          });;
        //  console.log(this.indexedArray);
        })
        .catch((err) => {
         
        });
    },
    syncIndexesLoc() {
      axios
        .post("/playlist/byLocation", {
          query: this.indexes.location,
        })
        .then((res) => {
         this.indexedArrayLoc = res.data.sort(function ( a, b ) { 
          return (a.order_index===null)-(b.order_index===null) || +(a.order_index>b.order_index)||-(a.order_index<b.order_index);
          });;
          this.indexedArrayLocSearch = res.data.sort(function ( a, b ) { 
          return (a.order_index===null)-(b.order_index===null) || +(a.order_index>b.order_index)||-(a.order_index<b.order_index);
          });;
        })
        .catch((err) => {
         
        });
    },
    sync() {
      axios
        .post("/playlist/full", {
          query: this.search,
        })
        .then((res) => {
          console.log(res.data)
          if(typeof res.data.items == 'array')
          {
            this.data = res.data.items;
          }
          else
          {
            this.data = Object.values(res.data.items)
          }
            this.pagination.pages = Math.ceil(res.data.total/this.search.perPage);
            this.playlists = this.data;
            this.search.perPageRanges[3].value = res.data.total;
            this.total = res.data.total;
        })
        .catch((err) => {
          axios
            .post("/playlist/full", {
              query: this.search,
            })
            .then((res) => {
              this.data = res.data;
            });
        });
    },
    syncCategories() {
      axios.get("/playlist/categories").then((res) => {
        this.categories = res.data;
        this.categoriesGroup = this.categories;
        this.categoriesGroupFrom = this.categories;
        this.categoriesGroupTo = this.categories;
        this.indexesCategories = this.categories;
      });
    },
    syncLocations() {
      axios.get("/playlist/settings").then((res) => {
        this.locations = res.data;
        this.locationsLoc = res.data;
      });
    },
    create() {
      axios
        .post("/playlist", {
          name: this.name,
        })
        .then((res) => {
          this.sync();
        });
    },
  },
  activated(){
    this.sync();
    this.syncLocations();
    this.syncCategories();
  },
  created() {
    this.sync();
    this.syncLocations();
    this.syncCategories();
  },
};
</script>

<style lang="scss" scoped>
.pagination {
    display: inline-block;
    padding-left: 0;
    margin: -10px 5px !important;
    border-radius: 4px;
}
</style>
