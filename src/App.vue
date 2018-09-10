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
        <div class="container has-text-centered">
          Enter your lichess username to generate your tactics.
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

export default {
  name: 'app',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    pullGames() {
      
    },
  },
  created() {
    this.games = ['5rr1/3nqpk1/p3p2p/Pp1pP1pP/2pP1PN1/2P1Q3/2P3P1/R4RK1 b - f3 0 28',
                'r4rk1/pp1b3p/6p1/8/3NpP2/1P4P1/P2K3P/R6R w - - 0 22'
                ]
  }
}
</script>
