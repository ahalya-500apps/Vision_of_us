<template>
  <b-row>
    <div class="col-4 pl-0">
      <img
        src="https://media.istockphoto.com/vectors/vector-banner-with-microphone-and-place-for-text-vector-id1162824777?b=1&amp;k=20&amp;m=1162824777&amp;s=170667a&amp;w=0&amp;h=bvnX1nP5mgXRR8PeRKcbIvf8eHOM-MLbGUEUbOwizZo="
        class="img-fluid"
      />
    </div>
    <div class="col-8 pl-5 py-5 text-left">
      <h3>What song in your mind?</h3>
      <small> Give us your favorite track and we'll serve up a sweet playlist with similar songs that you'll love</small>
      <div class="pt-2">
        <!-- {{ showLoader }} v-else -->

        <b-button variant="primary" type="button" class="px-5 rounded custom-btn" @click="runSpeechRecognition()">
          <span v-if="!showLoader"> <img src="../assets/mic.svg" /> Try singing </span>
          <p v-else id="preloader_1">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </p>
        </b-button>
      </div>
      <span id="action"></span>
      <div class="col-6 pl-0 pt-2">
        <b-form-group class="mb-3 mt-3">
          <b-input id="bindData" @change="guessMovie()" disabled type="text" name="company" v-model="text" placeholder="Find and play music you love" required></b-input>
        </b-form-group>
      </div>
      <div id="output" class="hide"></div>
    </div>
    <div class="border-top mx-0 pt-4 row" v-if="result && result.length > 0">
      <b-col md="4" v-for="(item, index) in result" :key="index">
        <!--  -->
        <b-card
          :img-src="item.image ? item.image : 'https://icon-library.com/images/song-icon-png/song-icon-png-27.jpg'"
          img-alt="Card image"
          fluid
          class="mb-3 mx-auto audio p-2"
          @click="playAudio(item.song, index)"
        >
          <b-card-text class="text-left">
            <p class="mb-1 small">Title : {{ item.title }}</p>
            <p class="mb-1 small">movie : {{ item.movie }}</p>
            <p class="mb-1 small">singer : {{ item.singer }}</p>
          </b-card-text>
          <audio v-if="item.song" :id="`myAudio_${index}`" controls>
            <source :src="item.song" />
          </audio>
        </b-card>
      </b-col>
    </div>
    <div v-else-if="err && err.length > 0 && speechObj && speechObj.text && speechObj.text.length > 0">
      {{ err }}
    </div>
  </b-row>
</template>
<script>
import guessMovieJs from "@/js/guessMovie.js";

export default {
  data() {
    return {
      text: "",
      speechObj: "",
      showLoader: false,
      result: [],
      err: "",
    };
  },
  mounted() {
  },

  methods: {
    runSpeechRecognition() {
      this.result = [];
      this.speechObj = "";
      this.showLoader = true;
      const self = this;
      // get output div reference
      var bindData = document.getElementById("bindData");

      // get action element reference
      var action = document.getElementById("action");
      // new speech recognition object
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
      this.speechObj = recognition;
      // This runs when the speech recognition service starts
      recognition.onstart = function() {
        action.innerHTML = "<small>listening, please speak...</small>";
      };

      recognition.onspeechend = function() {
        action.innerHTML = "<small>stopped listening, hope you are done...</small>";
        self.showLoader = false;
        recognition.stop();
      };

      // This runs when the speech recognition service returns result
      recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        this.text = transcript;

        bindData.value = transcript;
        self.guessMovie();
      };

      // start recognition
      recognition.start();
    },
    async guessMovie() {
      let text = this.speechObj.text.split(" ");

      if (text.length > 3) {
        text.slice(0, 3);
        this.speechObj.text = text[0] + " " + text[1] + " " + text[2];
      }
      let response = await guessMovieJs.spotify(this.speechObj.text);
      if (response.length == 0) response = await guessMovieJs.shazam(this.speechObj.text);

      this.result = response;
      this.result.length == 0 ? (this.err = "No result found") : this.err;
    },
    playAudio(song) {
      var audio = new Audio(song);
      audio.play();
    },
  },
};
</script>
<style>
/* CSS comes here */
body {
  font-family: arial;
}
button {
  padding: 10px;
  background-color: #6a67ce;
  color: #ffffff;
  border: 0px;
  cursor: pointer;
  border-radius: 5px;
}
#output {
  background-color: #f9f9f9;
  padding: 10px;
  width: 100%;
  margin-top: 20px;
  line-height: 30px;
}
.hide {
  display: none;
}
.custom-btn {
  height: 40px;
  width: 200px;
}
.show {
  display: block;
}
#preloader_1 {
  position: absolute;
  left: 14%;
  top: 45%;
  background: #ecf0f1;
}
#preloader_1 span {
  display: block;
  bottom: 0px;
  width: 9px;
  height: 5px;
  background: #fff;
  position: absolute;
  -webkit-animation: preloader_1 1.5s infinite ease-in-out;
  -moz-animation: preloader_1 1.5s infinite ease-in-out;
  -ms-animation: preloader_1 1.5s infinite ease-in-out;
  -o-animation: preloader_1 1.5s infinite ease-in-out;
  animation: preloader_1 1.5s infinite ease-in-out;
}

#preloader_1 span:nth-child(2) {
  left: 11px;
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -ms-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
#preloader_1 span:nth-child(3) {
  left: 22px;
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  -ms-animation-delay: 0.4s;
  -o-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
#preloader_1 span:nth-child(4) {
  left: 33px;
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  -ms-animation-delay: 0.6s;
  -o-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
#preloader_1 span:nth-child(5) {
  left: 44px;
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  -ms-animation-delay: 0.8s;
  -o-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
@-webkit-keyframes preloader_1 {
  0% {
    height: 5px;
    -webkit-transform: translateY(0px);
    background: #fff;
  }
  25% {
    height: 30px;
    -webkit-transform: translateY(15px);
    background: #fff;
  }
  50% {
    height: 5px;
    -webkit-transform: translateY(0px);
    background: #fff;
  }
  100% {
    height: 5px;
    -webkit-transform: translateY(0px);
    background: #fff;
  }
}

@-moz-keyframes preloader_1 {
  0% {
    height: 5px;
    -moz-transform: translateY(0px);
    background: #fff;
  }
  25% {
    height: 30px;
    -moz-transform: translateY(15px);
    background: #fff;
  }
  50% {
    height: 5px;
    -moz-transform: translateY(0px);
    background: #fff;
  }
  100% {
    height: 5px;
    -moz-transform: translateY(0px);
    background: #fff;
  }
}

@-ms-keyframes preloader_1 {
  0% {
    height: 5px;
    -ms-transform: translateY(0px);
    background: #fff;
  }
  25% {
    height: 30px;
    -ms-transform: translateY(15px);
    background: #fff;
  }
  50% {
    height: 5px;
    -ms-transform: translateY(0px);
    background: #fff;
  }
  100% {
    height: 5px;
    -ms-transform: translateY(0px);
    background: #fff;
  }
}

@keyframes preloader_1 {
  0% {
    height: 5px;
    transform: translateY(0px);
    background: #fff;
  }
  25% {
    height: 30px;
    transform: translateY(15px);
    background: #fff;
  }
  50% {
    height: 5px;
    transform: translateY(0px);
    background: #fff;
  }
  100% {
    height: 5px;
    transform: translateY(0px);
    background: #fff;
  }
}
.audio img {
  width: 100px;
  margin: auto !important;
}
audio {
  height: 39px;
}
</style>
