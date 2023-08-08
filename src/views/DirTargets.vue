<template>
  <div class="dir-targets">
    <div class="head">
      <h2>
        Targets for director
      </h2>

      <v-btn @click="save" color="success">
        Save
      </v-btn>
    </div>
    <div class="dir-content" v-if="targetData.makePlaylist">
      <dir-target-item label="Request Playlist" :item="targetData.makePlaylist" />
      <dir-target-item label="Request Shootlist" :item="targetData.makeShootlist" />
      <dir-target-item label="Played Playlist" :item="targetData.playedPlaylist" />
      <dir-target-item label="Played Shootlist" :item="targetData.playedShootlist" />

      <h3 class="full">
        Games Class
      </h3>
      <div class="full-item" v-for="(item, i) in targetData.gamesClass" :key="i">
        <dir-target-item :label="item.name" :item="item" class="full" />
        <h4 class="full">
          Gifts
        </h4>

        <dir-target-item 
          v-for="(gift, i) in item.gifts"
          :key="i"
          :label="getGiftName(gift)"
          :item="gift"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DirTargetItem from "@/components/DirTargetItem";

export default {
  data () {
    return {
      targetData: {},
      gifts: []
    }
  },
  created () {
    axios.get('/director/settings/origin').then(res => {
      this.targetData = res.data.data;
    });

    this.getGift(); 
  },
  methods: {
    getGift() {
      axios.get('/playlist/categories').then(res => {
        this.gifts = res.data;
      });
    },
    getGiftName (item) {
      var res = this.gifts.find(gift => gift.id_category == item.id_gift);
      return res ? res.name : '';
    },
    save () {
      axios.post('/director/settings/origin', {data: this.targetData});
    }
  },
  components: {
    DirTargetItem
  }
}
</script>

<style lang="scss" scoped>
.dir-targets {
  box-sizing: border-box;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 15px;

}

.dir-content {
  display: flex;
  flex-wrap: wrap;

  .full {
    width: 100%;
  }
  .full-item {
    margin-bottom: 25px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}

</style>