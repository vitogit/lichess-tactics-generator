# lichess-tactics-generator

> Generate a pgn file with tactics from your own lichess games.

## How it works?

Look how it works live: (coming soon)

Enter your Lichess username and click generate. 
It will pull your last 50 games that have analysis in the blitz, rapid, classical category.

This tactic generator uses the info that lichess attach to your analyzed games. It will look for tactics that you or your opponent missed. This are the ones that have two consecutive Blunders moves, like your opponent left a unguarded piece and you didn't take it, so lichess will provide a variation in the second blunder move with the correct moves. 

Using just the info provided by lichess make this generator super fast. 

If you want other type of tactic generator you can check [https://github.com/vitogit/pgn-tactics-generator](https://github.com/vitogit/pgn-tactics-generator) It's a python script that download your games, analyze it using stockfish and generate a pgn file. It requieres some techincal knowlege to make it work. 

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
