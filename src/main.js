import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueCookie from 'vue-cookie';
import App from "./App";
import VueFilterDateFormat from 'vue-filter-date-format'
import vuetify from './plugins/vuetify';
import Paginate from 'vuejs-paginate'
import Notifications from 'vue-notification';

window.axios = require('axios');
axios.defaults.baseURL = process.env['VUE_APP_API_URL'];
axios.interceptors.response.use(res => {
  return res;
}, err => {
  return Promise.reject(err.response);
});

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueCookie);
Vue.use(Notifications)
Vue.use(VueFilterDateFormat);
Vue.component('paginate', Paginate)
import Index from './views/Index.vue';
import Playlist from './views/Playlist.vue';
// import AutoMail from './views/AutoMail.vue';
import PlaylistEdit from './views/PlaylistEdit.vue';
import Gifts from './views/Gifts.vue';
import Login from './views/Login.vue';
import Workshop from './views/Workshop.vue';
import Funkit from './views/Funkit.vue';
import Shootlist from './views/Shootlist.vue';
import ShootlistEdit from './views/ShootlistEdit.vue';
import EventCategories from './views/EventCategories.vue';
import PlaylistLocations from './views/PlaylistLocations.vue';
import PlaylistSections from './views/PlaylistSections.vue';
import School from './views/School.vue';
import Users from './views/Users.vue';
import Parent from './views/Parent.vue';
import Funzone from './views/Funzone.vue';
import GiftPopular from './views/GiftPopular.vue';
import GiftType from './views/GiftType.vue';
import Types from './views/Types.vue';
import DirTargets from './views/DirTargets.vue';
import ShootlistCategory from './views/ShootlistCategory.vue';
import GiftSevenPage from './views/GiftSevenPage.vue';
import GiftSevenPageCategory from './views/GiftSevenPageCategory.vue';
import GiftEightPage from './views/GiftEightPage.vue';
import GiftEightPageCategory from './views/GiftEightPageCategory.vue';
import GiftNinePage from './views/GiftNinePage.vue';
import GiftNinePageCategory from './views/GiftNinePageCategory.vue';
import GiftTenPage from './views/GiftTenPage.vue';
import GiftTenPageCategory from './views/GiftTenPageCategory.vue';
import GiftElevenPage from './views/GiftElevenPage.vue';
import GiftElevenPageCategory from './views/GiftElevenPageCategory.vue';
import GiftTwelvePage from './views/GiftTwelvePage.vue';
import GiftTwelvePageCategory from './views/GiftTwelvePageCategory.vue';

import GiftPopularCategory from './views/GiftPopularCategory.vue';
import LanguagesList from "./views/LanguagesList.vue";
import GiftMatchedGames from './views/GiftMatchedGames';
import GiftMatchedGamesCategory from './views/GiftMatchedGamesCategory';
import GiftFromChores from './views/GiftFromChores';
import GiftFromChoresCategory from './views/GiftFromChoresCategory';
import GiftSociallSkills from './views/GiftSociallSkills';
import GiftSociallSkillsCategory from './views/GiftSociallSkillsCategory';
import GiftLearningSkills from './views/GiftLearningSkills';
import GiftLearningSkillsCategory from './views/GiftLearningSkillsCategory';
import PagesTitlesList from './views/pagesTitles/PagesTitlesList';

const router = new VueRouter({
  routes: [
    { path: '/', component: Index, name: 'index' },
    { path: '/login', component: Login, name: 'login' },
    // { path: '/auto_mail', component: AutoMail, name: 'auto_mail' },
    { path: '/playlist', component: Playlist, name: 'playlist' },
    { path: '/playlist/locations', component: PlaylistLocations, name: 'playlist-locations' },
    { path: '/playlist/sections', component: PlaylistSections, name: 'playlist-sections' },
    { path: '/playlist/:id_playlist', component: PlaylistEdit, name: 'playlist-edit' },
    { path: '/gifts', component: Gifts, name: 'gifts' },
    { path: '/workshop', component: Workshop, name: 'workshop' },
    { path: '/shootlist', component: Shootlist, name: 'shootlist' },
    { path: '/shootlist_category', component: ShootlistCategory, name: 'ShootlistCategory' },
    { path: '/shootlist/:id_shootlist', component: ShootlistEdit, name: 'shootlist-edit' },
    { path: '/funkit', component: Funkit, name: 'funkit' },
    { path: '/event/categories', component: EventCategories, name: 'event-categories' },
    { path: '/school', component: School, name: 'school' },
    { path: '/users', component: Users, name: 'users' },
    { path: '/parent', component: Parent, name: 'parent' },
    { path: '/funzone', component: Funzone, name: 'funzone' },
    { path: '/gift_popular', component: GiftPopular, name: 'gift_popular' },
    { path: '/education_category', component: GiftPopularCategory, name: 'GiftPopularCategory' },
    { path: '/matched_games', component: GiftMatchedGames, name: 'matched_games' },
    { path: '/matched_games_category', component: GiftMatchedGamesCategory, name: 'matched_games_category' },
    
    { path: '/seven_page', component: GiftSevenPage, name: 'seven_page' },
    { path: '/seven_page_category', component: GiftSevenPageCategory, name: 'seven_page_category' },

    { path: '/eight_page', component: GiftEightPage, name: 'eight_page' },
    { path: '/eight_page_category', component: GiftEightPageCategory, name: 'eight_page_category' },

    { path: '/nine_page', component: GiftNinePage, name: 'nine_page' },
    { path: '/nine_page_category', component: GiftNinePageCategory, name: 'nine_page_category' },

    { path: '/ten_page', component: GiftTenPage, name: 'ten_page' },
    { path: '/ten_page_category', component: GiftTenPageCategory, name: 'ten_page_category' },

    { path: '/eleven_page', component: GiftElevenPage, name: 'eleven_page' },
    { path: '/eleven_page_category', component: GiftElevenPageCategory, name: 'eleven_page_category' },

    { path: '/twelve_page', component: GiftTwelvePage, name: 'twelve_page' },
    { path: '/twelve_page_category', component: GiftTwelvePageCategory, name: 'twelve_page_category' },







    { path: '/from_chores', component: GiftFromChores, name: 'from_chores' },
    { path: '/from_chores_category', component: GiftFromChoresCategory, name: 'from_chores_category' },
    { path: '/sociall_skills', component: GiftSociallSkills, name: 'sociall_skills' },
    { path: '/sociall_skills_category', component: GiftSociallSkillsCategory, name: 'sociall_skills_category' },
    { path: '/learning_skills', component: GiftLearningSkills, name: 'learning_skills' },
    { path: '/learning_skills_category', component: GiftLearningSkillsCategory, name: 'learning_skills_category' },
    { path: '/gift_type', component: GiftType, name: 'gift_type' },
    { path: '/types', component: Types, name: 'types' },
    { path: '/dir-targets', component: DirTargets, name: 'dir-targets' },
    {path: '/lang-list', component: LanguagesList, name: 'lang-list'},
    {path: '/pages-title-list', component: PagesTitlesList, name: 'pages-title-list'},
  ]
});

const store = new Vuex.Store({
  state: {

  },
  mutations: {

  }
});

const app = new Vue({
  render: h => h(App),
  router,
  store,

  data: {
    logged: false,
    loaded: false,
  },

  methods: {

  },

  watch: {

  },

  created() {
    if(this.$cookie.get('auth')) {
      axios.defaults.headers.common['Authorization'] = this.$cookie.get('auth');
      axios.get('/user/info').then(res => {
        this.logged = true;
      }).catch(res => {
        this.logged = false;
        this.$router.push('/login');
      }).finally(res => {
        this.loaded = true;
      });
    } else {
      this.logged = false;
      this.$router.push('/login');
    }
  },

  vuetify,

  mounted() {

  }
}).$mount("#app");


router.beforeEach((to, from, next) => {

  if(!app.logged && app.loaded) {
    next('/login');
  } else {
    console.log(to);
    next();
  }
});
