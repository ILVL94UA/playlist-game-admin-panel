<template lang="html">
  <div v-if="!loading">
    <h1>USERS</h1>
    <v-layout>
      <v-text-field solo label="Search" @input="onInput" v-model.trim="search"></v-text-field>
    </v-layout>
    <v-layout style="padding: 15px 0px">
      <v-btn @click="downloadCSV" :loading="loadingCSV" color="success">Get csv with current data</v-btn>
    </v-layout>
    <v-layout>
      <v-select
          @input="onInput"
          label="Promo position"
          v-model="position"
          :items="[
          {
            value: '',
            label: 'All',
          },
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

    </v-layout>

    <!-- <v-layout>
      <v-select
        label="Promo code"
        v-model="selectedPromo"
        :items="promos"
        item-text="value"
        item-value="id_promo"
      ></v-select> -->
    <v-layout>
      <v-text-field solo label="Promo" v-model.trim="selectedPromo" @input="onInput"></v-text-field>
    </v-layout>

    <v-layout>
        <v-switch
            v-model="minShootlist"
            label="More than 20 shootlists"
            @change="initSync"
          />
          </v-layout>

          <v-layout>
        <v-switch
            v-model="minPlaylist"
            label="More than 20 playlists"
            @change="initSync"
          />
          </v-layout>

          <v-layout v-if="loadingData">
            <div class="title fugaz" style="width: 130px !important; text-align: left;">
              LOADING
              <span v-for="dot in dots">. </span>
            </div>
          </v-layout>

    <v-data-table
        disable-pagination
        :hide-default-footer="true"
        :items-per-page="20"
        v-if="dataFilter.length"
        :headers="[
        { text: 'ID', value: 'id_user' },
        { text: 'EDIT', value: 'actions', sortable: false },
        { text: 'Transactions', value: 'transaction'},
        { text: 'NAME', value: 'name' },
        { text: 'SURNAME', value: 'surname' },
        { text: 'LAST LOGIN', value: 'lastLogin' },
        { text: 'START DAY', value: 'date' },
        { text: 'PHONE', value: 'phone', sortable: false },
        { text: 'EMAIL', value: 'email' },
        { text: 'AGREED TO SEND NEW GAMES', value: 'game_and_question_updates'},
        { text: 'SCHOOL', value: 'school' },
        { text: 'SUBSCRIPTION', value: 'subscribe', sortable: false },
        { text: 'POSITION', value: 'position'},
        { text: 'AFTER SUBSCRIBE', value: 'afterSubscribe'},
        { text: 'COUPON', value: 'id_coupon'},
        { text: 'TRACK SOURCE', value: 'track_data.utm_source'},
        { text: 'TRACK MEDIUM', value: 'track_data.utm_medium'},
        { text: 'TRACK CAMPAIGN', value: 'track_data.utm_campaign'},
        { text: 'TRACK CONTENT', value: 'track_data.utm_content'},
        { text: 'TRACK TERM', value: 'track_data.utm_term'},

        { text: 'PLAYED(PLAYLIST)', value: 'playlist_played' },
        { text: 'SKIPPED(PLAYLIST)', value: 'playlist_skipped' },
        { text: 'LIKED(PLAYLIST)', value: 'playlist_liked' },
        { text: 'PLAYED(SHOOTLIST)', value: 'shootlist_played' },
        { text: 'SKIPPED(SHOOTLIST)', value: 'shootlist_skipped' },
        { text: 'LIKED(SHOOTLIST)', value: 'shootlist_liked' },

        { text: 'PLAYED WITHOUT SUBSCRIPTION(PLAYLIST)', value: 'playlist_played_no_sub' },
        { text: 'SKIPPED WITHOUT SUBSCRIPTION(PLAYLIST)', value: 'playlist_skipped_no_sub' },
        { text: 'LIKED WITHOUT SUBSCRIPTION(PLAYLIST)', value: 'playlist_liked_no_sub' },
        { text: 'PLAYED WITHOUT SUBSCRIPTION(SHOOTLIST)', value: 'shootlist_played_no_sub' },
        { text: 'SKIPPED WITHOUT SUBSCRIPTION(SHOOTLIST)', value: 'shootlist_skipped_no_sub' },
        { text: 'LIKED WITHOUT SUBSCRIPTION(SHOOTLIST)', value: 'shootlist_liked_no_sub' },
      ]"
        :items="data"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn text @click="edit(item)" color="info">edit</v-btn>
      </template>
      <template v-slot:item.transaction="{ item }">
        <v-btn text @click="viewTransaction(item)" color="info">view</v-btn>
      </template>
      <template v-slot:item.lastLogin="{ item }">
        {{getTime(item)}}
      </template>
      <template v-slot:item.id_coupon="{ item }">
        {{getPromoName(item)}}
      </template>
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date * 1000) | dateFormat('DD.MM.YY') }}
      </template>
      <template v-slot:item.game_and_question_updates="{ item }">
        {{ item.game_and_question_updates ? 'true' : 'false' }}
      </template>

      <template v-slot:item.school="{ item }">
        <div v-if="item.id_school>null && item.position!=null">
          <div class="f-el"> {{((item.class ? item.class : '')+ (item.class_number ? item.class_number+', ' : '')  ) }}</div>
            <div v-if="item.school" class="f-el">{{item.school.name}},</div>
            <div v-if="item.school" class="f-el">{{item.school.city}}</div>

        </div>

        <!--{{ item.id_school!==null ? (( (item.class ? item.class : '') + (item.class_number ? item.class_number : '')  )+ item.school.city  +item.school.name +', '  ) : ''}}-->
        <!--        {{((item.class ?item.class : '')+ (item.class_number ? item.class_number+', ' : ''))}}-->
      </template>

      <template v-slot:item.subscribe="{ item }">
        <template v-if="(item.subscribe + item.subscribe_interval) * 1000 > Date.now()">
          YES
          ({{ new Date(item.subscribe * 1000) | dateFormat('DD.MM.YY HH:mm') }}) -
          ({{ new Date((item.subscribe + item.subscribe_interval) * 1000) | dateFormat('DD.MM.YY') }})
        </template>
        <template v-else>
          NO
        </template>
      </template>
      <template v-slot:item.afterSubscribe="{ item }">
        <template v-if="item.afterSubscribe == 1">
          YES
          <!-- ({{ new Date(item.subscribe * 1000) | dateFormat('DD.MM.YY HH:mm') }}) -
          ({{ new Date((item.subscribe + item.subscribe_interval) * 1000) | dateFormat('DD.MM.YY') }}) -->
        </template>
        <template v-else>
          NO
        </template>
      </template>

    </v-data-table>

    <v-dialog
        v-model="dialog.edit"
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
          <div class="avatar" :style="{ backgroundImage: `url(${selected.full_img})` }"></div>
          <v-text-field v-model="selected.name" label="Name"></v-text-field>
          <v-text-field v-model="selected.nam" label="Surame"></v-text-field>
          <v-text-field v-model="selected.email" label="Email"></v-text-field>
          <!-- <v-select
              label="Select gender"
              v-model="selected.gender"
              :items="[
              {
                text: 'Man',
                value: 'man',
              },
              {
                text: 'Female',
                value: 'fem',
              },
            ]"
          ></v-select> -->
          <v-btn
          v-if="selected.position=='teacher'"
              color="success"
              flat
              @click="downloadCSVSessions(selected.id_user)"
          >
            Get sessions excel report
          </v-btn>
          <v-data-table
          v-if="selected.position=='teacher'"
              :headers="[
              { text: 'Start', value: 'session_start' },
              { text: 'End', value: 'session_end'},
              {text: 'Durations',value:'duration'}
            ]"
              :items="sessions"
          >
            <template v-slot:item.session_start="{ item }">
              {{ transformUnix(item.session_start)}}
            </template>
            <template v-slot:item.session_end="{ item }">
              {{ transformUnix(item.session_end)}}
            </template>
            <template v-slot:item.duration="{ item }">
              {{ calculateElapsedTime(item.session_start,item.session_end)}}
            </template>

          </v-data-table>



          <v-checkbox
              v-model="selected.new_subscribe_flag"
              label="Update subscribe (from now)"
          ></v-checkbox>
          <v-select
              label="Type of subscription"
              v-model="selected.new_subscribe"
              :items="[
              {
                text: '1 month',
                value: 2620000,
              },
              {
                text: '6 months',
                value: 15700000,
              },
            ]"
          ></v-select>

          <v-checkbox
              v-model="selected.new_subscribe_games_flag"
              label="Give free games"
          ></v-checkbox>
          <v-text-field
              type="number"
              v-model="selected.new_subscribe_games"
              label="Number of games"
          ></v-text-field>

          <v-checkbox
              v-model="selected.new_subscribe_shootlist_flag"
              label="Give free shootlists"
          ></v-checkbox>
          <v-text-field
              type="number"
              v-model="selected.new_subscribe_shootlist"
              label="Number of shootlists"
          ></v-text-field>
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
        v-model="dialog.transaction"
        width="700"
    >
      <v-card>
        <v-card-title
            class="headline grey lighten-2"
            primary-title
        >
          User transaction
        </v-card-title>
        <v-card-text>
          <v-data-table
              :headers="[
              { text: 'CODE', value: 'code' },
              { text: 'DATE', value: 'date'},
              { text: 'TYPE', value: 'data'},
            ]"
              :items="selected"
          >
            <template v-slot:item.date="{ item }">
              {{ new Date(item.date * 1000) | dateFormat('DD.MM.YY HH:mm') }}
            </template>
            <template v-slot:item.data="{ item }">
              {{item.data.type}}
            </template>

          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div class="text-center">
      <v-pagination
          @input="check"
          v-model="page"
          :length="totalPages"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { Base64 } from 'js-base64';
import Papa from 'papaparse';
import moment from 'moment';

export default {
  data() {
    return {
      interval: null,
      loadingData:false,
      dots: [],
      loadingCSV:false,
      selected: {},
      dialog: {
        edit: false,
        transaction: false
      },
      data: [],
      sessions:null,
      loading: false,
      new_subscribe: false,
      new_subscribe_games: false,
      new_subscribe_shootlist: false,
      minPlaylist: false,
      minShootlist: false,
      page: 1,
      total: '',
      search: '',
      position: '',
      selectedPromo: '',
      promos: [],
    };
  },
  methods: {
    startloading(){
      this.loadingData = true;
      this.interval = setInterval(() => {
      if (this.dots.length >= 3) {
        this.dots = [];
      } else {
        this.dots.push(null);
      }
    }, 500);
    },
    stoploading(){
      this.loadingData = false;
      clearInterval(this.interval);
    },
    initSync()
    {
      this.searchUsers();
    },
    downloadCSVSessions(item) {
      this.loadingCSV = true;
      axios.post('/user/session/getExcelReport',{
        id_user:item
      }).then(response => {
          const link = document.createElement('a');
          link.href = response.data.url;
          link.setAttribute('download', 'filename.ext'); // Замените на имя файла и его расширение
          link.style.display = 'none';
          document.body.appendChild(link);

          // Имитируем клик на ссылку для скачивания
          link.click();

          // Удаляем ссылку
          document.body.removeChild(link);
          this.loadingCSV = false;
        })
        .catch(error => {
          console.error('Ошибка при скачивании файла', error);
          this.loadingCSV = false;
        });

    },
    calculateElapsedTime(sessionStart, sessionEnd) {
      console.log(sessionStart)
    const durationSeconds = (sessionEnd - sessionStart);
    const hours = Math.floor(durationSeconds / 3600);
    const remainingSeconds = durationSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);

    return hours+'h :'+minutes+'m';
  },
    getTime(item)
    {
      if(item.last_login!=null)
      {
        const timestamp = item.last_login.time;
        const date = new Date(timestamp * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        return formattedDate;

      }
      else
      {
        return '';
      }
    },
    transformUnix(item)
    {
        const timestamp = item;
        const date = new Date(timestamp * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        return formattedDate;
    },
     downloadCSV() {
      this.loadingCSV = true;
      axios.post('/admin/user/getExcelReport',{
        page:1,
        take:20000,
        filter: this.position,
        search: this.search,
        selectedPromo: this.selectedPromo
      }).then(response => {
          const link = document.createElement('a');
          link.href = response.data.url;
          link.setAttribute('download', 'filename.ext'); // Замените на имя файла и его расширение
          link.style.display = 'none';
          document.body.appendChild(link);

          // Имитируем клик на ссылку для скачивания
          link.click();

          // Удаляем ссылку
          document.body.removeChild(link);
          this.loadingCSV = false;
        })
        .catch(error => {
          console.error('Ошибка при скачивании файла', error);
          this.loadingCSV = false;
        });

    },
    check(){
      this.searchUsers();
    },
    encryptObject(data) {
      const key = CryptoJS.enc.Utf8.parse(process.env['VUE_APP_SECURE_KEY']);
      const iv = CryptoJS.lib.WordArray.random(16);
      const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

      const objectToEncryptString = JSON.stringify(data);

      const encrypted = CryptoJS.AES.encrypt(objectToEncryptString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        keySize: 256 / 8,
      });

      const encryptedObject = {
        iv: ivBase64,
        value: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      };
      return encryptedObject;
    },
    getPromoCodes() {
      axios.get('/admin/promo').then(res => {
        this.promos = res.data;
        this.promos.unshift({id_promo: '', value: 'All'});
      });
    },
    getPromoName (item) {
      var promo = this.promos.find(pro => pro.id_promo == item.id_promo);
      return promo ? promo.value : '';
    },
    getPromoNameForExcel (id_promo) {
      var promo = this.promos.find(pro => pro.id_promo == id_promo);
      return promo ? promo.value : '';
    },
    updateNotifications(item, type) {
      item.notification[type] = !item.notification[type];
      axios.put('/admin/user/' + item.id_user + '/notification', item.notification);
    },

    async edit(item) {
      axios.get('/admin/user/' + item.id_user).then(async res => {
        let data = this.decryptData(res.data);
        if(item.position=='teacher')
        {
          await axios.post('/user/session/getSessionsActivity',{id_user:item.id_user}).then(res=>{
            if(res.data.success==true)
            {
            this.sessions = res.data.data.data.sort((a,b)=>b.session_start-a.session_start);
            console.log(this.sessions);
            }
          });
        }
        this.selected = data;
        this.selected.new_subscribe = null;
        this.selected.new_subscribe_games = null;
        this.selected.new_subscribe_flag = false;
        this.selected.new_subscribe_games_flag = false;
        this.selected.new_subscribe_shootlist = null;
        this.selected.new_subscribe_shootlist_flag = false;
        this.dialog.edit = true;
      });

    },
    viewTransaction(item) {
      axios.get('/subscribe/transactions/' + item.id_user).then(res => {
        let data = this.decryptData(res.data);
        this.dialog.transaction = true;
        this.selected = data;
      });

    },
    update() {
      axios.put('/admin/user/' + this.selected.id_user, this.encryptObject(this.selected)).then(res => {
        this.sync();
        this.dialog.edit = false;
      });
    },
    remove() {
      axios.delete('/admin/user/' + this.selected.id_user).then(res => {
        this.sync();
        this.dialog.edit = false;
      });
    },
    onInput(){
      this.page =1;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.searchUsers() },500);
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
    sync() {
      this.loading = true;
      axios.post('/admin/user', {
        page:1,
        take:20,
        filter:this.position,
        search: this.search,
        selectedPromo: this.selectedPromo,
        minPlaylist: this.minPlaylist,
        minShootlist: this.minShootlist
      }).then(res => {
        let users = this.decryptData(res.data.users.original)
        this.total = res.data.total;
        this.loading = false;
        this.data = users.map(n => {
          n.subscribe_interval = parseInt(n.subscribe_interval);
          n.subscribe = parseInt(n.subscribe);
          return n;
        });
      });
    },
    searchUsers(){
      this.startloading();
      axios.post('/admin/user', {
        page:this.page,
        filter: this.position,
        take:20,
        search: this.search,
        selectedPromo: this.selectedPromo,
        minPlaylist: this.minPlaylist,
        minShootlist: this.minShootlist
      }).then(res => {
        this.stoploading();
        this.total = res.data.total;
        let users = this.decryptData(res.data.users.original)
        this.data = users.map(n => {
          n.subscribe_interval = parseInt(n.subscribe_interval);
          n.subscribe = parseInt(n.subscribe);
          return n;
        });
      }).catch(()=>{
        this.stoploading();
      });
    },
  },

  computed: {
    dataFilter () {
      var res = this.data;
      if (this.position != '')
        res = res.filter(item => item.position == this.position);

      // if (this.selectedPromo != '') {
      //   var arrPromos = this.promos.filter(item => item.value.indexOf(this.selectedPromo) != -1);
      //   res = res.filter(item => arrPromos.find(promo => promo.id_promo == item.id_promo));
      // }
      // res = res.filter(item => item.id_promo == this.selectedPromo);

      return res;
    },
    totalPages(){
      return Math.round( this.total/20);
    },
  },
  created() {
    this.sync();
    this.getPromoCodes();
  }
}
</script>

<style lang="scss" scoped>
.fugaz {
    font-size: 16px;
    color: #000;
  }

.avatar {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #ccc;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.notification {
  text-decoration: underline;
  font-weight: bold;
  color: blue;
  cursor: pointer;
}

.row {

}

</style>
