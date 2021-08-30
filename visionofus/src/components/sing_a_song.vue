<template>
  <div id="app">
    <b-container fluid>
      <div row wrap justify-center class="mt-4">
        <div xs12 sm10 text-xs-center>
            <!-- <b-form-input type="text" name="text" v-model="text" 
            ></b-form-input>  -->
          <!-- <v-text-field
            label="The text"
            v-model="text"
            textarea
          ></v-text-field> -->
        </div>
        <div xs12 sm8 md4 text-xs-center>
          <speech-to-text :text.sync="text" @speechend="speechEnd"></speech-to-text>
        </div>
        <div xs12 text-xs-center class="mt-4">
          {{sentences}}
        </div>
      </div>
    </b-container>
    <b-card>
    <b-card-text>
      <div row wrap justify-space-around>
        <div xs8 sm9 text-xs-center>
          <p v-if="error" class="grey--text">{{error}}</p>
          <p v-else class="mb-0">
            <span v-if="sentences.length > 0">
            <span  v-for="sentence in sentences" :key="sentence">{{sentence}}. </span>
            </span>
            <span>{{runtimeTranscription}}</span>
          </p>
        </div>
        <div xs2 sm1 text-xs-center>
          <b-button
            dark
            @click.stop="toggle ? endSpeechRecognition() : startSpeechRecognition()"
            icon
            :color="!toggle ? 'grey' : (speaking ? 'red' : 'red darken-3')"
            :class="{'animated infinite pulse': toggle}"
          >
          <i class="fe fe-mic font-weight-bolder" aria-hidden="true"></i>
            <!-- <i>{{toggle ? 'mic_off' : 'mic'}}</i> -->
          </b-button>
        </div>
      </div>
    </b-card-text>
  </b-card>
</div>
</template>
<script>
export default {
 
  data () {
    return {
      error: false,
      speaking: false,
      toggle: false,
      runtimeTranscription: '',
      sentences: [],
      text :'',
      lang:'en-US'
    }
  },
   mounted () {
    
console.log(this.recognition)
    this.checkCompatibility()
  },
  methods: {
    checkCompatibility () {
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
this.recognition = SpeechRecognition? new SpeechRecognition() : false 
      if (!this.recognition) {
        this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
      }
    },
    endSpeechRecognition () {
      this.recognition.stop()
      this.toggle = false
      this.$emit('speechend', {
        sentences: this.sentences,
        text: this.sentences.join('. ')
      })
    },
    startSpeechRecognition () {
     
console.log("this.recognition ",this.recognition )
      if (!this.recognition) {
        this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
        return false
      }
      this.toggle = true
      this.recognition.lang = this.lang
      this.recognition.interimResults = true

      this.recognition.addEventListener('speechstart', event => {
        console.log(event)
        this.speaking = true
      })

      this.recognition.addEventListener('speechend', event => {
        console.log(event)
        this.speaking = false
      })

      this.recognition.addEventListener('result', event => {
        const text = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('')
        this.runtimeTranscription = text
      })

      this.recognition.addEventListener('end', () => {
        if (this.runtimeTranscription !== '') {
          this.sentences.push(this.capitalizeFirstLetter(this.runtimeTranscription))
          this.$emit('update:text', `${this.text}${this.sentences.slice(-1)[0]}. `)
          this.recogniseMovie();
        }
        this.runtimeTranscription = ''
        this.recognition.stop()
        if (this.toggle) {
          // keep it going.
          this.recognition.start()
        }
      })
      this.recognition.start()
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
       speechEnd ({sentences, text}) {
      console.log('text', text)
      console.log('sentences', sentences)
      this.sentences = sentences
    }
  },
}

</script>