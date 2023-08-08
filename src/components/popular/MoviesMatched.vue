<template>
  <div class="movie">
    <div class="create_block row">
      <h2>
        Movies
      </h2>
      <v-btn @click="createMovie" color="success">
        create movie
      </v-btn>
    </div>
	<input v-show="false" ref="file" type="file" accept="video/*" @change="updateVideo()">
    <div class="rows">
      <div v-for="movie in popular.movies" :key="movie.id">
        <div class="row">
          <div class="columns">
            <v-text-field
              label="Title"
              v-model="movie.title"
              type="text"
            ></v-text-field>
            <v-text-field
              label="Description"
              v-model="movie.description"
              type="text"
            ></v-text-field>
            <video style="max-width: 400px !important;" controls v-if="movie._video" :src="movie._video"></video>
			<div style="display: inline-block; width: 160px !important;">
					
				<v-btn style="margin: 5px;width: 150px;" :loading="loading.video" small color="info" @click="selectMovie(movie)">
				Upload video
				</v-btn>
				<v-btn style="margin: 5px;width: 150px;" small color="red" @click="deleteVideoHeb()">
				Delete audio
				</v-btn>
			</div>
			<div class="language-switcher">
				<input type="radio" :id="'arabic'+movie.id" :name="'language'+movie.id" value="ar" v-model="movie.lang">
				<label :for="'arabic'+movie.id">Arabic</label>

				<input type="radio" :id="'russian'+movie.id" :name="'language'+movie.id" value="ru" v-model="movie.lang">
				<label :for="'russian'+movie.id">Russian</label>

				<input type="radio" :id="'hebrew'+movie.id" :name="'language'+movie.id" value="heb" v-model="movie.lang" checked>
				<label :for="'hebrew'+movie.id">Hebrew</label>

				<input type="radio" :id="'english'+movie.id" :name="'language'+movie.id" value="eng" v-model="movie.lang">
				<label :for="'english'+movie.id">English</label>
			</div>
            <v-btn @click="createMovieQuestion(movie.id)" color="success"
              >createMovieQuestion</v-btn
            >
            <div class="columns" v-if="movie.questions">
              <div
                class="question column"
                v-for="(question, index) in movie.questions"
                :key="index"
              >
                <v-text-field
                  label="Question"
                  v-model="question.question"
                  type="text"
                ></v-text-field>
                <v-btn
                  small
                  @click="removeMovieQuestion(movie.id, index)"
                  color="red"
                >
                  delete
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <v-btn small @click="update(movie)" color="success">
            save
          </v-btn>
          <v-btn small @click="remove(movie)" color="red">
            delete
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    popular: Object,
    lang: {
      default: [],
    },
  },
  data() {
    return {
      selected: false,
      dialogFirst: false,
      dialogQuestion: false,
      transLang: "",
	  loading:{
		video:false
	  }
    };
  },
  methods: {
	selectMovie(movie){ 
		this.movie = movie;
		this.$refs.file.click();
	},
    openCategoryT(lang) {
      this.dialogFirst = true;
      this.transLang = lang;
    },
    openQuestionT(lang) {
      this.dialogQuestion = true;
      this.transLang = lang;
    },
    getLang(trans) {
      let item = this.lang.find((item) => {
        return item.lang_code === trans.langKey;
      });
      return item
        ? item.lang_title
        : trans.langKey === "heb"
        ? "Hebrew"
        : trans.langKey;
    },
    createMovie() {
      axios.post(`/matched-games/${this.popular.id}/movie`).then((res) => {
        this.popular.movies.push(res.data);
      });
    },
    getMoviePos(id) {
      return this.popular.movies.map((movie) => movie.id).indexOf(id);
    },
    createMovieQuestion(id) {
      const posMovie = this.getMoviePos(id);
      if (!this.popular.movies[posMovie].questions) {
        // this.popular.movies[posMovie].questions = [];
        this.$set(this.popular.movies[posMovie], "questions", []);
      }
      this.popular.movies[posMovie].questions.push({
        question: "",
        text: "",
        translation: [
          {
            langKey: "heb",
            data: {
              question: "",
            },
          },
          {
            langKey: "en",
            data: {
              question: "",
            },
          },
          {
            langKey: "ru",
            data: {
              question: "",
            },
          },
          {
            langKey: "ar",
            data: {
              question: "",
            },
          },
        ],
      });
    },
    removeMovieQuestion(movieId, questionIndex) {
      const movie = this.popular.movies[this.getMoviePos(movieId)];
      movie.questions.splice(questionIndex, 1);
      // question.id
    },
    update(movie) {
      axios
        .post(`/matched-games/updateMovie`, movie)
        .then((res) => res.data)
        .then((data) => (movie.questions = data.questions));
    },
    remove(movie) {
      axios
        .delete(`/matched-games/${this.popular.id}/movie/${movie.id}`)
        .then((res) => {
          let index = this.popular.movies.indexOf(movie);
          if (index !== -1) this.popular.movies.splice(index, 1);
        });
    },
    openVideo(movie) {
      this.selected = movie;
      this.$refs.video.click();
    },
    deleteVideo(movie) {
      axios
        .delete(`/matched-games/${this.popular.id}/movie/${this.selected.id}/video`)
        .then((res) => {
          movie.url_movie = null;
        });
    },
    updateVideo() {
      var data = new FormData();
      data.append("file", this.$refs.file.files[0]);
	  data.append('id',this.movie.id);
      axios
        .post(
          `/matched-games/movieVid`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
			this.popular.movies.forEach(element => {
				if(element.id==this.movie.id)
				{
					element._video = res.data.url;
				}
			});
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.language-switcher {
	margin: 20px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-switcher label {
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
}

.language-switcher input[type="radio"] {
  display: none;
}

.language-switcher input[type="radio"] + label:before {
  content: "";
  display: inline-block;
  border: 1px solid #ccc;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 50%;
  background-color: #fff;
}

.language-switcher input[type="radio"] + label:hover:before {
  border-color: #999;
}

.language-switcher input[type="radio"]:checked + label:before {
  background-color: #4caf50;
}
.movie {
  margin: 10px 0;
  .question {
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 5px;
    margin-top: 5px;
    background-color: rgba(0, 0, 0, 0.01);
  }
}

.row {
  display: flex;
  align-items: center;

  > * {
    margin: 5px;
  }

  .columns {
    flex-grow: 1;
  }
}

.video {
  width: 150px;
  height: auto;

  video {
    width: 150px;
    height: auto;
  }
}
</style>
