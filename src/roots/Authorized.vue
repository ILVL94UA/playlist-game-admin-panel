<template lang="html">
  <div class="wrapper">
    <div class="sidebar">
      <v-btn text to="/">Home</v-btn>
      <!-- <v-btn text to="/auto_mail">Auto Mailer</v-btn> -->
      <v-btn text to="/playlist">Playlist</v-btn>
      <v-btn text to="/gifts">Gifts</v-btn>
      <v-btn text to="/shootlist">Shootlist</v-btn>
      <v-btn text to="/shootlist_category">Shootlist category</v-btn>
      <v-btn text to="/workshop">Workshop</v-btn>
      <v-btn text to="/funkit">Funkit</v-btn>
      <v-btn text to="/users">Users</v-btn>
      <v-btn text to="/parent">Parent</v-btn>
      <v-btn text to="/event/categories">Event Category</v-btn>
      <v-btn text to="/playlist/locations">Playlist locations</v-btn>
      <v-btn text to="/school">Schools</v-btn>
      <v-btn text to="/playlist/sections">Playlist sections</v-btn>
      <v-btn text to="/funzone">Funzone</v-btn>
      <v-btn text to="/pages-title-list">Pages Headers</v-btn>
      <!-- <v-btn text to="/gift_popular">Educational class gifts</v-btn>
      <v-btn text to="/education_category">Educational class gifts category</v-btn> -->
      <div style="text-align:center">
        <details>
        <summary>Educational class</summary>
        <v-btn text to="/gift_popular">Educational class gifts</v-btn>
      <v-btn text to="/education_category">Educational class gifts category</v-btn>
      </details>
      <details>
        <summary>Matched games</summary>
        <v-btn text to="/matched_games">Matched games class gifts</v-btn>
        <v-btn text to="/matched_games_category">Matched games class gifts category</v-btn>
      </details>

      <details>
        <summary>From the hassle</summary>
        <v-btn text to="/from_chores">From the hassle class gifts</v-btn>
        <v-btn text to="/from_chores_category">From the hassle class gifts category</v-btn>
      </details>

      <details>
        <summary>Sociall skills</summary>
        <v-btn text to="/sociall_skills">Sociall skills class gifts</v-btn>
        <v-btn text to="/sociall_skills_category">Sociall skills class gifts category</v-btn>
      </details>

      <details>
        <summary>Learning skills</summary>
        <v-btn text to="/learning_skills">Learning skills class gifts</v-btn>
        <v-btn text to="/learning_skills_category">Learning skills class gifts category</v-btn>
      </details>

      <details>
        <summary>Games class</summary>
        <v-btn text to="/gift_type">Games class gifts</v-btn>
      <v-btn text to="/types">Games class gifts groups</v-btn>
      </details>

      <details>
        <summary>Seven Page</summary>
        <v-btn text to="/seven_page">Seven Page gifts</v-btn>
      <v-btn text to="/seven_page_category">Seven Page gifts groups</v-btn>
      </details>

      <details>
        <summary>Eight Page</summary>
        <v-btn text to="/eight_page">Eight Page gifts</v-btn>
      <v-btn text to="/eight_page_category">Eight Page gifts groups</v-btn>
      </details>

      <details>
        <summary>Nine Page</summary>
        <v-btn text to="/nine_page">Nine Page gifts</v-btn>
      <v-btn text to="/nine_page_category">Nine Page gifts groups</v-btn>
      </details>

      <details>
        <summary>Ten Page</summary>
        <v-btn text to="/ten_page">Ten Page gifts</v-btn>
      <v-btn text to="/ten_page_category">Ten Page gifts groups</v-btn>
      </details>

      <details>
        <summary>Eleven Page</summary>
        <v-btn text to="/eleven_page">Eleven Page gifts</v-btn>
      <v-btn text to="/eleven_page_category">Eleven Page gifts groups</v-btn>
      </details>

      <details>
        <summary>Twelve Page</summary>
        <v-btn text to="/twelve_page">Twelve Page gifts</v-btn>
      <v-btn text to="/twelve_page_category">Twelve Page gifts groups</v-btn>
      </details>
      </div>
      <v-btn text to="/dir-targets">Targets for director</v-btn>
      <v-btn text to="/lang-list">Languages List</v-btn>

      <v-spacer/>
      <v-btn text color="error" @click="exit">
        Exit
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </div>
    <keep-alive :include="[ 'playlist', 'shootlist' ]">
      <router-view id="content"/>
    </keep-alive>
  </div>

</template>

<script>
export default {
  methods: {
    exit() {
      delete axios.defaults.headers.common['Authorization'];
      this.$root.logged = false;
      this.$cookie.delete('auth');
    }
  },
  created() {
    axios.get('/lang').then(res => {
      this.lang = res.data;
      localStorage.setItem('translate', JSON.stringify(res.data));
    });
  }
}
</script>

<style lang="scss" scoped>
summary{
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #000000DE;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif;
}

#content {
  padding-left: 400px;
  padding-right: 50px !important
}
.sidebar {
  background: #fff;
  overflow-y: scroll;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 345px !important;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

</style>
