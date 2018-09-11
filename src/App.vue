<template>
  <div id="app">
    <section class="hero is-fullheight">
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div>
              <a href="/">
                <p class="title">Chess Blunder Investigator (beta)</p>
                <p class="subtitle">Generate tactics from your own lichess blunders.</p>
              </a>
            </div>
            <div id="navbarMenu" class="navbar-menu">
              <div class="navbar-end"></div>
            </div>
          </div>
        </nav>
      </div>
      <div class="hero-body">
        <div class="container">
          <b-field grouped position="is-centered">
              <b-input placeholder="Lichess username"
                  size="is-large"
                  v-model="username">
              </b-input>
              <p class="control">
                  <button @click="generate" class="button is-large is-primary">Generate tactics</button>
              </p>
          </b-field>

          <div class="has-text-centered">Enter your lichess username to generate your tactics. </div>
          <br>
          <pre>
            <span v-if="tactics.length==0">The pgn file will be generated here. Copy the content and save it as pgn</span>
            <template  v-for="t in tactics">
              {{t}}
            </template>
          </pre>
        </div>

      </div>

      <div class="hero-foot">
        <div class="container">
          <div class="has-text-centered">
            Made by <a href="http://vitomd.com">@vitomd</a> with <a href="https://vuejs.org/">Vue.js</a>
          </div>
        </div>
      </div>
    </section>
    
  
  </div>

</template>

<script>
import Chess from 'chess.js'

export default {
  name: 'app',
  data () {
    return {
      username: 'e4Guardian',
      tactics: []
    }
  },
  methods: {
    generate() {
      let loading = this.$loading.open({
           canCancel: true
      })
      let toast = this.$toast.open('Downloading and processing games. This will take a minute')
      let url = `https://lichess.org/games/export/${this.username}?max=50&analysed=true&evals=true&moves=true&perfType=blitz,rapid,classical`
      this.$http.get(url, {headers: {'Accept': 'application/x-ndjson'}}).then(result => {
          this.tactics = []
          let games = result.bodyText.split("\n").filter(x => x !== "").map(x => JSON.parse(x))
          let blunders = this.findBlunders(games)
          this.generateTactics(blunders)
          loading.close()
      }, error => {
          console.error(error);
      });
    },
    findBlunders(games) {
      let blunders = []
      for (let game of games) {
        let lastEval = 0
        for (let [index, move] of game.analysis.entries() ) {
          if (move.judgment && move.judgment.name == 'Blunder' && index > 0) {
            let prevMove = game.analysis[index-1]
            if (prevMove.judgment && prevMove.judgment.name == 'Blunder') {
              blunders.push({'game': game, 'index': index-1, 'eval':move.eval, 'variation': move.variation})
            }
          }
        }
      }
      return blunders
    },
    generateTactics(blunders) {
      for (let [index, blunder] of blunders.entries() ) {
        let game = new Chess()
        let moves = blunder.game.moves.split(' ')
        let blunderMove = ''
        let result = '1-0'
        for (let [index, move] of moves.entries()) {
          if (index == blunder.index) {
            blunderMove = moves[index]
            if ((index+1)%2 != 0) { //The blunder move was made by white. so black wins
              result = '0-1'
            }
            break
          }
          game.move(move)
        }
        let fen = game.fen()
        let tacticMoves = blunderMove +' '+ blunder.variation
        game = new Chess(fen)
        for (let move of tacticMoves.split(' ')) {
          game.move(move)
        }
        game = this.addHeaders(game, blunder, index, result)
        this.tactics.push(game.pgn())
      }
    },
    addHeaders(game, blunder, index, result) {
      let date = new Date(blunder.game.createdAt)
      let formatDate = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate()
      game.header('Site', 'https://lichess.org/'+blunder.game.id)
      game.header('Date', formatDate)
      game.header('White', blunder.game.players.white.user.id)
      game.header('Black', blunder.game.players.black.user.id)
      game.header('SetUp', index.toString())
      game.header('Result', result)
      return game
    }
  },
  created() {
    this.bodyText = `{"id":"9Llyao5C","rated":true,"variant":"standard","speed":"rapid","perf":"rapid","createdAt":1535766417332,"lastMoveAt":1535766890981,"status":"resign","players":{"white":{"user":{"id":"zidane1986","name":"Zidane1986"},"rating":1674,"ratingDiff":36,"analysis":{"inaccuracy":5,"mistake":1,"blunder":0,"acpl":39}},"black":{"user":{"id":"e4guardian","name":"e4Guardian"},"rating":1813,"ratingDiff":-105,"provisional":true,"analysis":{"inaccuracy":4,"mistake":2,"blunder":1,"acpl":74}}},"winner":"white","moves":"c4 Nc6 Nc3 e5 Nf3 Nf6 d4 exd4 Nxd4 Nxd4 Qxd4 Bb4 Bg5 Be7 Ne4 Bb4+ Nc3 Be7 Ne4 Nxe4 Qxe4 O-O Qxe7 Qxe7 Bxe7 Re8 Bb4 d6 e3 Bf5 Be2 a5 Bc3 a4 a3 Re6 Bf3 c6 O-O Rae8 Bd1 Re4 Bc2 Rxc4 Bxf5","analysis":[{"eval":0},{"eval":77,"best":"c7c5","variation":"c5 Nf3 Nf6 g3 d5 cxd5 Nxd5 Bg2 Nc6 d3","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was c5."}},{"eval":25,"best":"d2d4","variation":"d4 e5 d5 Bb4+ Nd2 Nce7 Nf3 Bxd2+ Nxd2 Nf6","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was d4."}},{"eval":23},{"eval":-4},{"eval":21},{"eval":0},{"eval":19},{"eval":-8},{"eval":37},{"eval":37},{"eval":35},{"eval":37},{"eval":37},{"eval":-15,"best":"e2e4","variation":"e4 d6 Bd2 O-O Be2 b6 O-O Bb7 Be3 Nd7","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was e4."}},{"eval":77,"best":"f6e4","variation":"Nxe4 Qxe4 d6 g3 h6 Bxe7 Qxe7 Bg2 c6 b3 Qxe4 Bxe4 Be6 O-O-O","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Nxe4."}},{"eval":38},{"eval":81},{"eval":5,"best":"e2e4","variation":"e4 d6 Be2 O-O Rd1 Re8 Bd2 b6 O-O Bb7 b3 a5 f3 h6","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was e4."}},{"eval":18},{"eval":-10},{"eval":531,"best":"d7d6","variation":"d6 g3 h6 Bxe7 Qxe7 Bg2 Qxe4 Bxe4 c6 O-O-O Ke7 b3 a5 a4","judgment":{"name":"Blunder","comment":"Blunder. Best move was d6."}},{"eval":470,"best":"g5e7","variation":"Bxe7 Re8 Bxd8 Rxe4 e3 c6 Bc7 Re6 Bg3 d5 cxd5 cxd5 Bd3 Bd7","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Bxe7."}},{"eval":491},{"eval":456},{"eval":490},{"eval":480},{"eval":490},{"eval":454},{"eval":497},{"eval":467},{"eval":500},{"eval":480},{"eval":506},{"eval":471},{"eval":510},{"eval":447,"best":"e1d2","variation":"Kd2","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Kd2."}},{"eval":580,"best":"f5e4","variation":"Be4 Ke2 f6 h4 Kf7 h5 b6 Rad1 Rae8 Rh4 R8e7 h6 g5 Rh3","judgment":{"name":"Mistake","comment":"Mistake. Best move was Be4."}},{"eval":457,"best":"e1c1","variation":"O-O-O Rae8 Rd4 Be4 Rhd1 Bxf3 gxf3 Rh6 Rxd6 f6 Kd2 Rxh2 Ke2 Rg2","judgment":{"name":"Mistake","comment":"Mistake. Best move was O-O-O."}},{"eval":515,"best":"f5c2","variation":"Bc2 Be2 Rae8 Rfc1 Bb3 g3 f5 Kg2 Kf7 Ba5 g6 Bb6 Re4 h4","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Bc2."}},{"eval":467},{"eval":565,"best":"e8a8","variation":"Ra8","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Ra8."}},{"eval":543},{"eval":826,"best":"e4f4","variation":"Rf4 Bxf5 Rxf5 Rad1 Rd8 Rd4 b6 Rfd1 Rf6 e4 Re6 e5 f6 exd6","judgment":{"name":"Mistake","comment":"Mistake. Best move was Rf4."}},{"eval":745}],"clock":{"initial":600,"increment":0,"totalTime":600}}
{"id":"XOvyEHA8","rated":true,"variant":"standard","speed":"rapid","perf":"rapid","createdAt":1535082755939,"lastMoveAt":1535083694853,"status":"mate","players":{"white":{"user":{"id":"faeb187","name":"faeb187"},"rating":1704,"ratingDiff":-8,"analysis":{"inaccuracy":5,"mistake":3,"blunder":4,"acpl":72}},"black":{"user":{"id":"e4guardian","name":"e4Guardian"},"rating":1720,"ratingDiff":93,"provisional":true,"analysis":{"inaccuracy":5,"mistake":5,"blunder":1,"acpl":49}}},"winner":"black","moves":"e4 Nc6 d4 e5 d5 Nce7 Bd3 Ng6 f4 Nxf4 Bxf4 exf4 Nf3 Bc5 c3 a5 a3 d6 Nbd2 Nf6 h3 O-O Qe2 Re8 O-O-O c6 dxc6 bxc6 Nd4 Bxd4 cxd4 c5 dxc5 d5 Qf3 d4 Qxf4 Ba6 Bxa6 Rxa6 Rhe1 Qc8 Qf5 Rc6 Qxc8 Rcxc8 b4 axb4 axb4 Ra8 Kb2 Ra4 e5 Nd5 Kb3 Rxb4+ Kc2 Ne3+ Rxe3 dxe3 Nf3 Rc4+ Kd3 Rxc5 Kxe3 h6 Kf4 Rc4+ Nd4 Rd8 Ke4 Ra4 Rd3 Ra2 g4 Kf8 Rf3 Ra4 Rd3 Re8 Kf5 g6+ Kf6 Rxd4 Rxd4 Re6#","analysis":[{"eval":0},{"eval":46},{"eval":40},{"eval":86},{"eval":61},{"eval":60},{"eval":42},{"eval":47},{"eval":-90,"best":"g1f3","variation":"Nf3 c6 O-O cxd5 exd5 d6 c4 Be7 Nc3 f5","judgment":{"name":"Mistake","comment":"Mistake. Best move was Nf3."}},{"eval":-90},{"eval":-95},{"eval":-79},{"eval":-104},{"eval":-108},{"eval":-158,"best":"d1d2","variation":"Qd2 Be3","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Qd2."}},{"eval":-128},{"eval":-162},{"eval":-173},{"eval":-215},{"eval":-204},{"eval":-208},{"eval":-203},{"eval":-337,"best":"f3d4","variation":"Nd4 c6","judgment":{"name":"Mistake","comment":"Mistake. Best move was Nd4."}},{"eval":-262,"best":"f6d5","variation":"Nxd5 exd5 Re8 Ne4 f5 Nxc5 Rxe2+ Bxe2 dxc5 O-O-O Qd6 Bb5 Bd7 Bxd7","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Nxd5."}},{"eval":-305},{"eval":-236,"best":"f6d5","variation":"Nxd5 Nf1","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Nxd5."}},{"eval":-236},{"eval":-237},{"eval":-252},{"eval":-214},{"eval":-227},{"eval":-197},{"eval":-204},{"eval":-55,"best":"d8c7","variation":"Qc7 Qf2","judgment":{"name":"Mistake","comment":"Mistake. Best move was Qc7."}},{"eval":-202,"best":"e2f2","variation":"Qf2","judgment":{"name":"Mistake","comment":"Mistake. Best move was Qf2."}},{"eval":7,"best":"d8c7","variation":"Qc7","judgment":{"name":"Mistake","comment":"Mistake. Best move was Qc7."}},{"eval":33},{"eval":68},{"eval":73},{"eval":70},{"eval":0,"best":"e4e5","variation":"e5 Qc7 Qxd4 Rxe5 Nb3 a4 Qd8+ Qxd8 Rxd8+ Ne8 Nd4 Rxc5+ Kb1 Re5","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was e5."}},{"eval":86,"best":"f6d7","variation":"Nd7 Nb3 a4 Nxd4 Nxc5 e5 Qd5 Kb1 Qxg2 Rg1 Qe4+ Qxe4 Nxe4 Nf5","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Nd7."}},{"eval":0,"best":"c1b1","variation":"Kb1","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Kb1."}},{"eval":87,"best":"a6e6","variation":"Rae6 Kb1 g6 Qg5 Qb7 Rc1 Rb8 b3 Nxe4 Rxe4 Rxe4 c6 Qb6 c7","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Rae6."}},{"eval":75},{"eval":84},{"eval":36},{"eval":40},{"eval":47},{"eval":299,"best":"c8b8","variation":"Rb8","judgment":{"name":"Mistake","comment":"Mistake. Best move was Rb8."}},{"eval":230,"best":"d2b3","variation":"Nb3","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Nb3."}},{"eval":385,"best":"a8b8","variation":"Rab8 Ka3","judgment":{"name":"Mistake","comment":"Mistake. Best move was Rab8."}},{"eval":-54,"best":"b2b3","variation":"Kb3","judgment":{"name":"Blunder","comment":"Blunder. Best move was Kb3."}},{"eval":74,"best":"a4b4","variation":"Rxb4+ Kc2 Nd7 Rb1 Ra4 Rb5 Ra2+ Kd3 Rc8 Nb3 Rxg2 Rb7 Rg3+ Kxd4","judgment":{"name":"Mistake","comment":"Mistake. Best move was Rxb4+."}},{"eval":-333,"best":"d2b3","variation":"Nb3","judgment":{"name":"Blunder","comment":"Blunder. Best move was Nb3."}},{"eval":-333},{"eval":-330},{"eval":-322},{"eval":-323},{"eval":-316},{"eval":-322},{"eval":-307},{"eval":-302},{"eval":-297},{"eval":-309},{"eval":-251,"best":"f7f6","variation":"f6","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was f6."}},{"eval":-280},{"eval":-263},{"eval":-357,"best":"d1d4","variation":"Rd4","judgment":{"name":"Inaccuracy","comment":"Inaccuracy. Best move was Rd4."}},{"eval":-325},{"eval":-322},{"eval":-314},{"eval":-322},{"eval":-316},{"eval":-355},{"eval":0,"best":"g7g5","variation":"g5 Kf3 Kh7 Ke4 Ra4 Rd1 Kg6 Rd2 Re8 Rf2 Re6 Rb2 f6 Rb5","judgment":{"name":"Blunder","comment":"Blunder. Best move was g5."}},{"eval":-352,"best":"d4e6","variation":"Ne6+ fxe6 Rxd8+ Ke7 Rd3 Re2+ Kd4 Rb2 Ra3 Rh2 Ra7+ Kf8 Ra8+ Kf7","judgment":{"name":"Blunder","comment":"Blunder. Best move was Ne6+."}},{"eval":-313},{"eval":-290},{"eval":-290},{"eval":-290},{"eval":-264},{"mate":-2,"best":"f5f4","variation":"Kf4 g5+ Kf5 Rd8 Ke4 Kg7 Ke3 Kh7 Ke4 Kg6 Rd1 h5 Rd2 h4","judgment":{"name":"Blunder","comment":"Checkmate is now unavoidable. Best move was Kf4."}},{"mate":-1},{"mate":-1}],"clock":{"initial":600,"increment":0,"totalTime":600}}`
  }
}
</script>

<style>
  .hero-head {
    padding-top: 10px;
  }
  .hero-foot {
    padding-bottom: 10px;
  }
  pre, code {
      white-space: pre-line;
  }
</style>
