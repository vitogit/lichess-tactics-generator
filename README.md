# lichess-tactics-generator

> Generate a pgn file with tactics from your own lichess games.

![http://chesstacticsgenerator.vitomd.com/static/screen.png](http://chesstacticsgenerator.vitomd.com/static/screen.png)
## How it works?

Check it live: http://chesstacticsgenerator.vitomd.com

Enter your Lichess username and click generate.
It will pull your last 50 games that have analysis in the blitz, rapid, classical category.

This tactic generator uses the info that lichess attach to your analyzed games. It will look for tactics that you or your opponent missed. This are the ones that have two consecutive Blunders moves, like your opponent left a unguarded piece and you didn't take it, so lichess will provide a variation in the second blunder move with the correct moves.

Using just the info provided by Lichess make this generator super fast. 

If you want other type of tactic generator you can check [https://github.com/vitogit/pgn-tactics-generator](https://github.com/vitogit/pgn-tactics-generator) It's a python script that download your games, analyze it using stockfish and generate a pgn file. It requieres some techincal knowlege to make it work. 

## Resulting Tactics

It will generate a pgn formatted text that you can copy to create your pgn file.
It will pull some info from the game, like the link, date and players. 
The result indicates who is the tactic winner.
The Termination header indicates the centipawn evaluation or mate.

```
[SetUp "0"]
[FEN "3r2k1/5pp1/7p/4P3/3NK1P1/3R3P/r7/8 b - g3 0 38"]
[Site "https://lichess.org/XOvyEHA8"]
[Date "2018.8.24"]
[White "faeb187"]
[Black "e4guardian"]
[Result "1-0"]
[Termination "0"]

38. ... Kf8 39. Ne6+ fxe6 40. Rxd8+ Ke7 41. Rd3 Re2+ 42. Kd4 Rb2 43. Ra3 Rh2 44. Ra7+ Kf8 45. Ra8+ Kf7 1-0
```

The file can be loaded in a lichess study, a chess database or app like ichess to practice tactics.


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
