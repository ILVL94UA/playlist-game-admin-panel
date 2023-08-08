<template lang="html">
  <div>
    <v-layout class="py-3" row wrap>
      <v-flex xs6>
        <h1>{{ data.name }}</h1>
        <img :src="data.img" alt="">
        <VuetifyAudio :file="data.audio" color="success"/>
        <img style="max-width: 500px !important; margin-bottom: 20px;" :src="data.preview" alt="">
        <video style="max-width: 500px !important;" controls v-if="data._video" :src="data._video"></video>
      </v-flex>
      <v-flex>
        <small>PLAYED</small>
        <p>{{ data.played }}</p>
      </v-flex>
      <v-flex>
        <small>SKIPPED</small>
        <p>{{ data.skipped }}</p>
      </v-flex>
      <v-flex>
        <small>LIKED</small>
        <p>{{ data.liked }}</p>
      </v-flex>
      <v-flex>
        <small>CREATED</small>
        <p>{{ new Date(data.date * 1000) | dateFormat('DD.MM.YY') }}</p>
      </v-flex>
    </v-layout>

    <v-layout row class="py-3">
      <v-flex xs9>
        <div class="display-1 mb-2">Promo settings</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-layout>
        <v-switch
            v-model="data.is_promo"
            label="Is promo only"
          />
          </v-layout>
          <v-layout>
          <v-text-field 
          v-if="data.is_promo"
            :label="'Search by code'"
            type="text" 
            outline
            @input="filterPromo"
          ></v-text-field>
        <v-select
        v-if="data.is_promo"
          label="Promos"
          v-model="data.id_promo"
          chips
          :items="promosFiltered"
          item-text="value"
          item-value="id_promo"
          solo
          multiple
        ></v-select>
        </v-layout>
        
      </v-layout>
        
        <v-layout align-start column justify-center fill-height>
          <h2>Playlist game</h2>
          <v-switch
            v-model="data.show"
            label="VISIBLE"
          />
          <v-switch
            v-model="data.isHome"
            label="For home"
          />
          <v-switch
            v-model="data.isRest"
            label="For rest"
          />
          <v-switch
            v-model="data.isZoom"
            label="For zoom"
          />
          <!-- <v-switch
            v-model="data.isRecommended"
            :disabled="data.isPopular || data.isChild? true: false"
            label="Recommended"
          />
          <v-switch
            v-model="data.isChild"
            :disabled="data.isPopular || data.isRecommended? true: false"
            label="Child"
          />
          <v-switch
            v-model="data.isPopular"
            :disabled="data.isChild || data.isRecommended? true: false"
            label="Popular"
          /> -->
          <!-- <v-switch
            v-model="data.isTeacher"
            label="For teacher"
          /> -->
        </v-layout>
        <!-- <input v-show="false" ref="preview" type="file" accept="image/*" @change="updatePreview"> -->
        <input v-show="false" ref="file" type="file" accept="image/svg+xml" @change="updateImage">
        <input v-show="false" ref="audioHeb" type="file" accept="audio/*" @change="updateAudioHeb">
        <input v-show="false" ref="audioEng" type="file" accept="audio/*" @change="updateAudioEng">
        <input v-show="false" ref="audioRu" type="file" accept="audio/*" @change="updateAudioRu">
        <input v-show="false" ref="audioAr" type="file" accept="audio/*" @change="updateAudioAr">

        <input v-show="false" ref="previewHeb" type="file" accept="image/*" @change="updatePreviewHeb">
        <input v-show="false" ref="previewEng" type="file" accept="image/*" @change="updatePreviewEng">
        <input v-show="false" ref="previewRu" type="file" accept="image/*" @change="updatePreviewRu">
        <input v-show="false" ref="previewAr" type="file" accept="image/*" @change="updatePreviewAr">

        <input v-show="false" ref="videoHeb" type="file" accept="video/*" @change="updateVideoHeb">
        <input v-show="false" ref="videoEng" type="file" accept="video/*" @change="updateVideoEng">
        <input v-show="false" ref="videoRu" type="file" accept="video/*" @change="updateVideoRu">
        <input v-show="false" ref="videoAr" type="file" accept="video/*" @change="updateVideoAr">
        
        
      </v-flex>
      <v-flex xs3>
        <v-layout align-center justify-end>
          <v-btn color="error" @click="dialog.delete = true" flat>DELETE</v-btn>
          <v-btn color="success" @click="save">SAVE</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout style="display: block;padding-top: 80px;">
    <v-layout>
      <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.file.click()">
        Upload image
      </v-btn>
      <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteImage()">
        Delete image
      </v-btn>
    </v-layout>

    <!-- <v-layout>
      <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.preview.click()">
        Upload Preview
      </v-btn>
      <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deletePreview()">
        Delete Preview
      </v-btn>
    </v-layout> -->

    <v-layout style="margin-top: 10px;">
      <div style="width: 100%; text-align: left;">
        <h4 style="margin-left: 20px;margin-bottom: 5px;">Preview upload</h4>
      </div>
    </v-layout>
    <v-layout>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.previewHeb.click()">
        Upload preview heb
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deletePreviewHeb()">
          Delete preview heb
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.previewEng.click()">
        Upload preview eng
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deletePreviewEng()">
          Delete preview eng
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.previewRu.click()">
        Upload preview ru
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deletePreviewRu()">
          Delete preview ru
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.previewAr.click()">
        Upload preview ar
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deletePreviewAr()">
          Delete preview ar
        </v-btn>
      </div>
    </v-layout>

    <v-layout style="margin-top: 10px;">
      <div style="width: 100%; text-align: left;">
        <h4 style="margin-left: 20px;margin-bottom: 5px;">Audio upload</h4>
      </div>
    </v-layout>
    <v-layout>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.audioHeb.click()">
        Upload audio heb
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteAudioHeb()">
          Delete audio heb
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.audioEng.click()">
        Upload audio eng
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteAudioEng()">
          Delete audio eng
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.audioRu.click()">
        Upload audio ru
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteAudioRu()">
          Delete audio ru
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" small color="info" @click="$refs.audioAr.click()">
        Upload audio ar
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteAudioAr()">
          Delete audio ar
        </v-btn>
      </div>
    </v-layout>
    <v-layout style="margin-top: 10px;">
      <div style="width: 100%; text-align: left;">
        <h4 style="margin-left: 20px;margin-bottom: 5px;">Video upload</h4>
      </div>
    </v-layout>
    <v-layout>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" :loading="loading.video" small color="info" @click="$refs.videoHeb.click()">
          Upload video heb
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteVideoHeb()">
          Delete video heb
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" :loading="loading.video" small color="info" @click="$refs.videoEng.click()">
          Upload video eng
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteVideoEng()">
          Delete video eng
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" :loading="loading.video" small color="info" @click="$refs.videoRu.click()">
          Upload video ru
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteVideoRu()">
          Delete video ru
        </v-btn>
      </div>
      <div style="display: inline-block; width: 160px !important;">
        <v-btn style="margin: 5px;width: 150px;" :loading="loading.video" small color="info" @click="$refs.videoAr.click()">
          Upload video ar
        </v-btn>
        <v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteVideoAr()">
          Delete video ar
        </v-btn>
      </div>
    </v-layout>
  </v-layout>

    <v-divider></v-divider>

    <v-form class="pt-4">
      <v-text-field label="Order index" type="number" outline v-model="data.order_index"/>

      <v-text-field label="Game name" type="text" v-model="data.name" outline></v-text-field>

      <div class="display-1 mb-2">Strips</div>
      <v-divider/>
      <div class="pt-4">
        <v-textarea label="Strip 1" v-model="data.translation[0].data.question_1" box></v-textarea>
        <v-textarea label="Strip 2" v-model="data.translation[0].data.question_2" box></v-textarea>
        <v-textarea label="Strip 3" v-model="data.translation[0].data.question_3" box></v-textarea>
      </div>
      <div class="languages">
        <div v-if="lang.length>0 " class="display-1 mb-2">Translate</div>
        <template v-for="trans in data.translation" >
          <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategory(trans)" color="info">{{getLang(trans)}}</v-btn>
        </template>
      </div>
      <v-text-field label="Video embed frame" v-model="data.video" outline></v-text-field>

      <!-- <div class="display-1 mb-2">
        Additional questions
        <v-switch
          v-model="data.additional"
          label="Enable"
        />
      </div>
      <v-divider/>
      <div class="pt-4">
        <v-textarea label="Question 1" v-model="data.translation[0].data.question_4" box></v-textarea>
        <v-textarea label="Question 2" v-model="data.translation[0].data.question_5" box></v-textarea>
      </div> -->

      <div class="display-1 mb-2">Ingame gifts</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-btn style="margin-bottom: 5px;" to="/gifts" color="success">
          <v-icon>add</v-icon>
          add new gift
        </v-btn>
        <v-select
          label="Locations"
          @input="onCategoriesChange"
          :value="data.categories.map(n => n.id_category)"
          chips
          :items="categories"
          item-text="name"
          item-value="id_category"
          solo
          multiple
        ></v-select>
      </v-layout>
      <v-layout row align-start class="pt-4" style="display: block !important;">
          <v-text-field 
            v-if="categories.find(n => n.id_category == c.id_category) != null"
            :label="categories.find(n => n.id_category == c.id_category) != null? categories.find(n => n.id_category == c.id_category).name+ ' order index' : null" 
            v-for="c in data.categories"
            v-model="c.order_index" 
            type="number" 
            outline
          ></v-text-field>
        </v-layout>

      <div class="display-1 mb-2">Locations</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-btn style="margin-bottom: 5px;" to="/playlist/locations" color="success">
          <v-icon>add</v-icon>
          add new location
        </v-btn>
        <v-select
          label="Locations"
          @input="onLocationsChange"
          :value="data.locations.map(n => n.id_location)"
          chips
          :items="locations"
          item-text="name"
          item-value="id_setting"
          solo
          multiple
        ></v-select>
      </v-layout>
      
      <v-layout row align-start class="pt-4" style="display: block !important;">
        <v-layout row align-start class="pt-4"
        style="width:100%;display: block !important;" 
        v-if="locations.find(n => n.id_setting == loc.id_location)!=null"
        v-for="loc in data.locations">
          <div style="display:inline-block;">
              <v-text-field 
                style="max-width:150px"
                :label="locations.find(n => n.id_setting == loc.id_location)!=null ? locations.find(n => n.id_setting == loc.id_location).name + ' order index' : null" 
                v-model="loc.order_index" 
                type="number" 
                outline
              ></v-text-field>
          </div>
          <div style="display:inline-block; margin:0px 3px;">
            <v-switch
            v-model="loc.isRecommended"
            :disabled="loc.isPopular || loc.isChild? true: false"
            label="Recommended"
          />
          </div>
          <div style="display:inline-block; margin:0px 3px;">
             <v-switch
            v-model="loc.isChild"
            :disabled="loc.isPopular || loc.isRecommended? true: false"
            label="Child"
          />
          </div>
          <div style="display:inline-block; margin:0px 3px;">
            <v-switch
            v-model="loc.isPopular"
            :disabled="loc.isChild || loc.isRecommended? true: false"
            label="Popular"
          />
          </div>
        </v-layout>
      </v-layout>

      <!-- <div class="display-1 mb-2">Number players</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-text-field label="Players minimum" v-model="data.min_players" type="number" outline></v-text-field>
        <v-spacer/>
        <v-text-field label="Players maximum" v-model="data.max_players" type="number" outline></v-text-field>
      </v-layout>

      <div class="display-1 mb-2">Age</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-text-field label="Age minimum" v-model="data.min_age" type="number" outline></v-text-field>
        <v-spacer/>
        <v-text-field label="Age maximum" v-model="data.max_age" type="number" outline></v-text-field>
      </v-layout>

      <div class="display-1 mb-2">Section</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-select
          label="Section"
          v-model="data.section"
          :items="[
            {
              text: 'ילדים',
              value: 'chl'
            },
            {
              text: 'מבוגר',
              value: 'adl'
            },
            {
              text: 'מעורב',
              value: 'mix'
            },
          ]"
          solo
        ></v-select>
      </v-layout>

      <div class="display-1 mb-2">Gender</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-radio-group v-model="data.gender">
          <v-radio
            label="MALE"
            value="man"
          ></v-radio>
          <v-radio
            label="FEMALE"
            value="fml"
          ></v-radio>
          <v-radio
            label="BOTH"
            value="two"
          ></v-radio>
        </v-radio-group>
      </v-layout> -->

      <div class="display-1 mb-2">Level</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-radio-group v-model="data.level">
          <v-radio
            label="hard"
            :value="1"
          ></v-radio>
          <v-radio
            label="harder"
            :value="2"
          ></v-radio>
          <v-radio
            label="the hardest"
            :value="3"
          ></v-radio>
        </v-radio-group>
      </v-layout>

      <div class="display-1 mb-2">
        Credit
        <v-icon @click="deleteAuthor">delete</v-icon>
      </div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-text-field @input="searchUser" label="User name" v-model="user" type="text" solo></v-text-field>
        <v-select
          label="User"
          v-model="data.id_author"
          :items="users"
          item-text="name"
          item-value="id_user"
          solo
        ></v-select>
      </v-layout>
      <v-layout row align-start class="pt-4">
        <v-text-field @input="searchSchool" label="School" v-model="school" type="text" solo></v-text-field>
        <v-select
          label="School"
          v-model="data.id_school"
          :items="schools"
          item-text="name"
          item-value="id_school"
          solo
        ></v-select>
      </v-layout>
      <v-layout row align-start class="pt-4">
        <v-text-field label="City" v-model="data.city" type="text" solo></v-text-field>
      </v-layout>

      <div class="display-1 mb-2">Teacher guide</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-text-field label="Teacher guide" v-model="data.translation[0].data.teachers_guide" type="text" outline></v-text-field>
      </v-layout>
    </v-form>

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

    <v-snackbar
      v-model="alert.delete"
      right
      top
      :timeout="2000"
    >
      Deleted.
      <v-btn
        color="pink"
        flat
        @click="alert.delete = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog
      v-model="dialog.delete"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Delete ensurance
        </v-card-title>

        <v-card-text>
          Do you realy want to delete it?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="default"
            flat
            @click="dialog.delete = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            flat
            @click="remove"
          >
            Yes, delete it
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
          <v-text-field label="Question 1" v-model="transLang.data.question_1" category="text"></v-text-field>
          <v-text-field label="Question 2" v-model="transLang.data.question_2" category="text"></v-text-field>
          <v-text-field label="Question 3" v-model="transLang.data.question_3" category="text"></v-text-field>
          <v-text-field label="Question 4" v-model="transLang.data.question_4" category="text"></v-text-field>
          <v-text-field label="Question 5" v-model="transLang.data.question_5" category="text"></v-text-field>
          <v-text-field label="Teacher Guide" v-model="transLang.data.teachers_guide" category="text"></v-text-field>
          <v-layout justify-end>
          </v-layout>

          <v-btn @click="save"  color="success">
            update
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VuetifyAudio from 'vuetify-audio'
import CryptoJS from "crypto-js";
import { Base64 } from 'js-base64';

export default {
  components: {
    VuetifyAudio,
  },  
  data() {
    return {
      data: [],
      test: null,
      dialogTr: false,
      lang: [],
      categories: [],
      sections: [],
      school: '',
      category: {
        name: '',
        id_section: '',
      },
      alert: {
        update: false,
        delete: false,
      },
      dialog: {
        delete: false,
      },
      loading: {
        video: false,
      },
      transLang: '',
      user: '',
      users: [],
      schools: [],
      locations: [],
      promos:[],
      promosFiltered:[]
    };
  },
  methods: {
    openCategory (lang) {
      this.dialogTr = true;
      this.transLang = lang;
    },
    getLang(trans){
      console.log(trans);
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
  },
    onLocationsChange(value) {
      let array = value.map(n => {
        const loc = this.data.locations.find(z => z.id_location == n);
        return {
          id_location: n,
          order_index: loc ? loc.order_index : 0,
        }
      });
      this.data.locations = array.map(element=>{
        const locat = this.data.locations.find(z => z.id_location == element.id_location);
        return{
          id_location: element.id_location,
          order_index: element ? element.order_index : 0,
          isChild: locat ? locat.isChild : 0,
          isPopular: locat ? locat.isPopular : 0,
          isRecommended: locat ? locat.isRecommended : 0,
        }
        
      })
    },
    onCategoriesChange(value) {
      console.log(value)
      this.data.categories = value.map(n => {
        const category = this.categories.find(z => z.id_category == n);
        return {
          id_category: n,
          order_index: category ? category.order_index!=null? category.order_index:'' : '',
        }
      });
    },
    updateImage() {
      var data = new FormData();
      data.append('file', this.$refs.file.files[0]);
      axios.post('/playlist/' + this.$route.params.id_playlist + '/image', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.img = res.data.url;
      });
    },
    deleteImage () {
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/image').then(res => {
        this.data.img = null;
      });
    },
    //Preview
    updatePreviewHeb() {
      var data = new FormData();
      data.append('file', this.$refs.previewHeb.files[0]);
      data.append('lang','heb');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/preview', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.preview = res.data.url;
      });
    },
    deletePreviewHeb() {
      let lang = 'heb';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/preview/'+lang).then(res => {
        this.data.preview = null;
      });
    },
    updatePreviewRu() {
      var data = new FormData();
      data.append('file', this.$refs.previewRu.files[0]);
      data.append('lang','ru');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/preview', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.preview = res.data.url;
      });
    },
    deletePreviewRu() {
      let lang = 'ru';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/preview/'+lang).then(res => {
        this.data.preview = null;
      });
    },
    updatePreviewEng() {
      var data = new FormData();
      data.append('file', this.$refs.previewEng.files[0]);
      data.append('lang','eng');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/preview', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.preview = res.data.url;
      });
    },
    deletePreviewEng() {
      let lang = 'eng';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/preview/'+lang).then(res => {
        this.data.preview = null;
      });
    },
    updatePreviewAr() {
      var data = new FormData();
      data.append('file', this.$refs.previewAr.files[0]);
      data.append('lang','ar');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/preview', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.preview = res.data.url;
      });
    },
    deletePreviewAr() {
      let lang = 'ar';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/preview/'+lang).then(res => {
        this.data.preview = null;
      });
    },
    //Video
    updateVideoHeb() {
      var data = new FormData();
      this.loading.video = true;
      data.append('file', this.$refs.videoHeb.files[0]);
      data.append('lang','heb');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/video', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data._video = res.data.url;
      }).finally(() => {
        this.loading.video = false;
      });
    },
    updateVideoEng() {
      var data = new FormData();
      this.loading.video = true;
      data.append('file', this.$refs.videoEng.files[0]);
      data.append('lang','eng');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/video', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data._video = res.data.url;
      }).finally(() => {
        this.loading.video = false;
      });
    },
    updateVideoRu() {
      var data = new FormData();
      this.loading.video = true;
      data.append('file', this.$refs.videoRu.files[0]);
      data.append('lang','ru');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/video', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data._video = res.data.url;
      }).finally(() => {
        this.loading.video = false;
      });
    },
    updateVideoAr() {
      var data = new FormData();
      this.loading.video = true;
      data.append('file', this.$refs.videoAr.files[0]);
      data.append('lang','ar');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/video', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data._video = res.data.url;
      }).finally(() => {
        this.loading.video = false;
      });
    },
    //
    deleteVideoHeb () {
      let lang = 'heb';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/video/'+lang).then(res => {
        this.data._video = null;
      });
    },
    deleteVideoEng () {
      let lang = 'eng';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/video/'+lang).then(res => {
        this.data._video = null;
      });
    },
    deleteVideoRu () {
      let lang = 'ru';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/video/'+lang).then(res => {
        this.data._video = null;
      });
    },
    deleteVideoAr () {
      let lang = 'ar';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/video/'+lang).then(res => {
        this.data._video = null;
      });
    },
    //Audio
    updateAudioHeb() {
      var data = new FormData();
      data.append('file', this.$refs.audioHeb.files[0]);
      data.append('lang','heb');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/audio', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.audio = res.data.url;
      });
    },
    updateAudioEng() {
      var data = new FormData();
      data.append('file', this.$refs.audioEng.files[0]);
      data.append('lang','eng');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/audio', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.audio = res.data.url;
      });
    },
    updateAudioRu() {
      var data = new FormData();
      data.append('file', this.$refs.audioRu.files[0]);
      data.append('lang','ru');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/audio', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.audio = res.data.url;
      });
    },
    updateAudioAr() {
      var data = new FormData();
      data.append('file', this.$refs.audioAr.files[0]);
      data.append('lang','ar');
      axios.post('/playlist/' + this.$route.params.id_playlist + '/audio', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.data.audio = res.data.url;
      });
    },
    //
    deleteAudioHeb () {
      let lang = 'heb';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/audio/'+lang).then(res => {
        this.data.audio = null;
      });
    },
    deleteAudioEng () {
      let lang = 'eng';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/audio/'+lang).then(res => {
        this.data.audio = null;
      });
    },
    deleteAudioRu () {
      let lang = 'ru';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/audio/'+lang).then(res => {
        this.data.audio = null;
      });
    },
    deleteAudioAr () {
      let lang = 'ar';
      axios.delete('/playlist/' + this.$route.params.id_playlist + '/audio/'+lang).then(res => {
        this.data.audio = null;
      });
    },
    deleteAuthor () {
      this.users = [];
      this.user = '';
      this.data.id_author = null;

      this.schools = [];
      this.school = '';
      this.data.id_school = null;

      this.data.city = null;
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
    searchUser() {
      if(!this.user.length) return;
      axios.post('/user/search', this.encryptObject({
        name: this.user
      })).then(res => {
        let data = this.decryptData(res.data)
        this.users = data.map(n => {
          n.name = n.name + ' ' + n.surname;
          return n;
        });
        this.users.unshift({
          name: 'Empty',
          id_user: null,
        });
      });
    },
    sync() {
      axios.get('/playlist/' + this.$route.params.id_playlist + '/full').then(res => {
        this.data = res.data;

        // let locs = [];
        // console.log(this.data.locations)
        // this.data.locations.forEach(element=>{
        //   if(this.locations.find(n => n.id_setting == element.id_location)!=null)
        //   {
        //     locs.push(element)
        //   }
        // })
        // this.data.locations = locs;
        // console.log(this.data.locations)

        // let gifts = [];
        // this.data.categories.forEach(element=>{
        //   if(this.categories.find(n => n.id_category == element.id_category) != null)
        //   {
        //     gifts.push(element)
        //   }
        // })
        // this.data.categories = gifts;

        if(res.data.author_info) {
          this.users.push({
            name: 'Empty',
            id_user: null,
          });
          this.users.push(res.data.author_info);
          this.user = res.data.author_info.name;

        }
        if(res.data.school_info) {
          this.schools.push({
            name: 'Empty',
            id_school: null,
          });
          this.schools.push(res.data.school_info);
          this.school = res.data.school_info.name;
        }
      });
      this.lang =  JSON.parse(localStorage.getItem('translate'));

    },
    syncCategories() {
      axios.get('/playlist/categories').then(res => {
        this.categories = res.data;
      });
    },
    syncSections() {
      axios.get('/playlist/category/sections').then(res => {
        this.sections = res.data;
      });
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
    syncPromo() {
      axios.get('/playlist/category/sections').then(res => {
        this.sections = res.data;
      });
    },
    syncLocations() {
      axios.get('/playlist/settings').then(res => {
        this.locations = res.data;
      });
    },
    save() {

      // translation.forEach(trans=>{
      //   if (trans.langKey==='en'){
      //     trans.data = {
      //       name: 'test',
      //       question_1:'test test test test test',
      //       question_2:'test test test test test',
      //       question_3:'test test test test test',
      //     }
      //   } else if (trans.langKey==='ru'){
      //     trans.data = {
      //       name: 'Тест русского',
      //       question_1:'тест русского языка тест русского языка',
      //       question_2:'тест русского языка тест тест русского языка тест',
      //       question_3:'тест русского языка ',
      //     }
      //   } else if(trans.langKey==='ar'){
      //     trans.data = {
      //       name: 'الدَّرْسُ الثَّالِثُ',
      //       question_1:'كِتَابٌ: الْكِتَابُ كِتَابٌ: الْكِتَابُ',
      //       question_2:' كِتَابٌ: الْكِتَابُكِتَابٌ: الْكِتَابُ كِتَابٌ: الْكِتَابُ كِتَابٌ: الْكِتَابُ',
      //       question_3:' بَيْتٌ: الْبَيْتُ كِتَابٌ: الْكِتَابُبَيْتٌ: الْبَيْتُ',
      //     }
      //   }
      // });
      // console.log(translation);
     
      this.data.translation[0].data.name = this.data.name;
      axios.put('/playlist/' + this.$route.params.id_playlist, this.data).then(res => {
        this.alert.update = true;
      });
      this.dialogTr = false;
    },
    addCategory() {
      axios.post('/playlist/category', {
        name: this.category.name,
        id_section: this.category.id_section,
      }).then(res => {
        this.syncCategories();
        this.dialog.gift = false;
      });
    },
    remove() {
      axios.delete('/playlist/' + this.$route.params.id_playlist).then(res => {
        this.dialog.delete = false;
        this.alert.delete = true;
        this.$router.push('/playlist');
      })
    },
    searchSchool() {
      if(!this.school.length) return;
      axios.post('/school/search', {
        name: this.school,
      }).then(res => {
        this.schools = res.data;
        this.schools.unshift({
          name: 'Empty',
          id_school: null,
        });
      });
    },
  },
  async created() {
    this.getPromoCodes();
    this.syncSections();
    await this.syncCategories();
    await this.syncLocations();
    this.sync();
  }
}
</script>

<style lang="scss" scoped>


.header {
  padding: 10px;
}
.main {
  padding-top: 20px;
}
.title {
  text-transform: uppercase;
}
.col {
  padding: 10px 20px;
}
.desc {
  text-transform: uppercase;
  font-weight: 500;
  color: silver;
}
.languages{
  margin-bottom: 20px;
}
</style>
