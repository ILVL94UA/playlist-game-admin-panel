<template lang="html">
  <div>
    <h1>PLAYLIST GAMES</h1>
    <h3>Users</h3>
    <v-layout>
       <v-data-table
        v-if="usersToMail!=null"
        :items-per-page="15"
        :headers="[
        { text: 'ID', value: 'id_user' },
        { text: 'EDIT', value: 'actions', sortable: false },
        { text: 'NAME', value: 'name' },
        { text: 'SURNAME', value: 'surname' },
        { text: 'PHONE', value: 'phone', sortable: false },
        { text: 'EMAIL', value: 'email' },
        { text: 'AGREED TO SEND NEW GAMES', value: 'game_and_question_updates'},
        { text: 'SCHOOL', value: 'school' },
      ]"
        :items="usersToMail"
    >
    <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
      </v-data-table>
    </v-layout>
    <hr/>
    <h3>New Option</h3>
    <hr/>
    <v-layout row align-start class="pt-4">
          <v-text-field clearable @input="enterName" small label="Name of option" v-model="newOption.name"></v-text-field>
     </v-layout>
     <hr/>
     <v-layout row align-start class="pt-4">
          <v-text-field clearable @input="enterNamePlaylist" small label="Playlist search" v-model="playlistNameSearch"></v-text-field>
     </v-layout>
     <v-layout row align-start class="pt-4">
          <v-select
            label="Select"
            :items="playlistDataFiltered"
            multiple
            v-model="newOption.setPlaylists"
            item-text="name"
            item-value="id_playlist"
            solo
            chips
            @input="setPlaylist"
            deletable-chips
            clearable
          ></v-select>
     </v-layout>
     <hr/>
      <v-layout row align-start class="pt-4">
          <v-text-field clearable @input="enterNameShootlist" small label="Shootlist search" v-model="shootlistNameSearch"></v-text-field>
     </v-layout>
     <v-layout row align-start class="pt-4">
          <v-select
            label="Select"
            :items="shootlistDataFiltered"
            multiple
            v-model="newOption.setShootlist"
            item-text="content_man"
            item-value="id_shootlist"
            solo
            chips
            @input="setShootlist"
            deletable-chips
            clearable
          ></v-select>
     </v-layout>
    <v-layout row align-start class="pt-4">
      <v-btn @click="saveOption" color="success">Save Option</v-btn>
    </v-layout>
     <hr/>
     <h3>Options</h3>
      <hr/>
      <hr class="style-one"/>
      <div v-for="(opt, index) in options" :key="index">
        <v-layout row align-start class="pt-4">
          <h4>Name: {{opt.name}}</h4>
        </v-layout>
         <v-layout row align-start class="pt-4">
          <h4>Playlists:</h4>
        </v-layout>
        <v-layout row align-start class="pt-4"
        style="width:100%;display: block !important;"
        v-if="playlistsData.find(n => n.id_playlist == pl)!=null" 
        v-for="pl in JSON.parse(opt.id_playlists)">
          <div style="display:inline-block;">
              <h5>{{playlistsData.find(n => n.id_playlist == pl).name}}</h5>
          </div>
          </v-layout>
          
          <v-layout row align-start class="pt-4">
          <h4>Shootlists:</h4>
        </v-layout>
        <v-layout row align-start class="pt-4"
        style="width:100%;display: block !important;"
        v-if="shootlistData.find(n => n.id_shootlist == sl)!=null" 
        v-for="sl in JSON.parse(opt.id_shootlists)">
          <div style="display:inline-block;">
              <h5>{{shootlistData.find(n => n.id_shootlist == sl).content_man}}</h5>
          </div>
          </v-layout>
          <v-layout row align-start class="pt-4">
            <v-btn @click="deleteOpt(opt.id)" color="error">Delete Option</v-btn>
          </v-layout>
          <hr class="style-one"/>
      </div>
      <v-dialog
        v-model="dialog.edit"
        v-if="dialog.selected!=null"
        width="500"
    >
      <v-card>
        <v-card-title
            class="headline grey lighten-2"
            primary-title
        >
          Edit user
        </v-card-title>
         <v-card-text>
          <v-layout row align-end class="pt-4">
              <h3>{{'הפסקות וחוץ'+': '+(dialog.selected.auto_email_options.breaksAnd0utside? 'true':'false')}}</h3>
            </v-layout>
            <v-layout row align-end class="pt-4">
              <h3>{{'גיבוש משפחתי וזוגי'+': '+(dialog.selected.auto_email_options.familyAndMaritalFormation ? 'true':'false')}}</h3>
            </v-layout>
            <v-layout row align-end class="pt-4">
              <h3>{{'שאלות לשיח רגשי'+': '+(dialog.selected.auto_email_options.questionsForEmotionalDiscourse? 'true':'false')}}</h3>
            </v-layout>
            <hr/>
            <v-layout row align-start class="pt-4">
              <h4>Select option</h4>
              </v-layout>
            <v-layout row align-start class="pt-4">
                  <v-select
                    label="Select"
                    :items="options"
                    :value="dialog.selected.auto_email_options.options"
                    item-text="name"
                    item-value="name"
                    solo
                    chips
                    @input="setSelectedOpt"
                  ></v-select>
            </v-layout>
            <v-layout row align-start class="pt-4">
                  <v-btn @click="saveOptionUser()" :loading="loadingBtn" color="success">Save Option</v-btn>
            </v-layout>
           </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { Base64 } from 'js-base64';
export default {
  name: "playlist",
  data() {
    return {
      dialog:{
        edit:false,
        selected:null,
      },
      playlistsData:null,
      playlistNameSearch:null,
      playlistDataFiltered:null,
      shootlistData:null,
      shootlistNameSearch:null,
      shootlistDataFiltered:null,
      search: {
        str: "",
        categories: [],
        locations: [],
        level: null,
        page: 1,
        perPage: 2000,
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
      usersToMail:null,
      loadingBtn:false,
      newOption:{
        name:null,
        setPlaylists:null,
        setShootlist:null,
      },
      options:null,
       searchNext: {
          query: '',
          category: null,
        },
    }
  },
  methods: {
    edit(item) {
        this.dialog.selected = null;
        this.dialog.selected = item;
        this.dialog.edit = true;
    },
    setShootlist(value) {
    this.newOption.setShootlist = value;
    },
    setPlaylist(value) {
    this.newOption.setPlaylists = value;
    },
    setSelectedOpt(value)
    {
      this.dialog.selected.auto_email_options.options = value
    },
    async saveOptionUser(value)
    {
      this.loadingBtn=true;
      await axios.post('/admin/options/updateOptionForUser',{
        selected:this.dialog.selected,
       }).then(async() => {
          await this.syncUsers();
          this.dialog.edit = false;
          this.dialog.selected = null;
          this.loadingBtn=false;
        })
        .catch((err)=>{
          this.loadingBtn=false;
        });
    },
    async saveOption(){
       await axios.post('/admin/options/addOption',{
        name:this.newOption.name,
        id_playlists: this.newOption.setPlaylists,
        id_shootlists: this.newOption.setShootlist
       }).then(async() => {
          await this.syncOptions();
          this.newOption.name = null;
          this.newOption.setPlaylists = null;
          this.newOption.setShootlist = null;

          console.log(this.newOption)
        });
    },
    async deleteOpt(id){
        await axios.post('/admin/options/deleteOption',{
        id:id,
       }).then(async() => {
          this.syncOptions();
          this.syncUsers();
        });
    },
    onPlaylistsChange(e){
      let array = value.map(n => {
        return {
          id_playlist: n,
        }
      });
      this.newOption.setPlaylists=array;
    },
    enterName(e){
      this.newOption.name = e;
    },
    enterNamePlaylist(e){
      this.playlistDataFiltered = this.playlistsData.filter(x=>x.name.toLowerCase().includes(e.toLowerCase()));
      if(e=="")
      {
        this.playlistDataFiltered=this.playlistsData;
      }
    },
    enterNameShootlist(e){
      this.shootlistDataFiltered = this.shootlistData.filter(x=>x.content_man.toLowerCase().includes(e.toLowerCase()));
      if(e=="")
      {
        this.shootlistDataFiltered=this.shootlistData;
      }
    },
    async sync(){
       axios
        .post("/playlist/full", {
          query: this.search,
        })
        .then((res) => {
          if(typeof res.data.items == 'array')
          {
            this.playlistsData = res.data.items;
            this.playlistDataFiltered = this.playlistsData;
          }
          else
          {
            this.playlistsData = Object.values(res.data.items);
            this.playlistDataFiltered = this.playlistsData;
          }
        });
        console.log(this.playlistsData);
    },
    decryptData(res){
      var key = process.env["VUE_APP_SECURE_KEY"];
      var encrypted = res.payload;
      var encrypted_json  = JSON.parse(Base64.decode(encrypted));
      var decrypted = CryptoJS.AES.decrypt(encrypted_json.value, CryptoJS.enc.Base64.parse(Base64.encode(key)),{
                        iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
                        mode: CryptoJS.mode.CBC
                      });
      let data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      
      return data;
    },
    async syncUsers(){
       axios
        .get("user/usersToMail", {
        })
        .then((res) => {
          let data = this.decryptData(res.data)
          if(typeof data.items == 'array')
          {
            this.usersToMail = data.items;
          }
          else
          {
            this.usersToMail = Object.values(data.items)
          }
        });
    },
    async syncShootlist(){
         axios.post('/shootlist/full', {
          query: this.searchNext.query,
          category: this.searchNext.category,
        }).then(res => {
          this.shootlistData = res.data;
          this.shootlistDataFiltered = this.shootlistData;
        });
    },
    async syncOptions(){
         axios.get('/admin/options/getOptions').then(res => {
          this.options = res.data.items;
        });
    }
  },
  activated(){
    this.sync();
    this.syncUsers();
    this.syncShootlist();
    this.syncOptions();
  },
  async created() {
    this.sync();
    await this.syncUsers();
    this.syncShootlist();
    this.syncOptions();
  },
};
</script>

<style lang="scss" scoped>
.style-one {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}
.pagination {
    display: inline-block;
    padding-left: 0;
    margin: -10px 5px !important;
    border-radius: 4px;
}
</style>
