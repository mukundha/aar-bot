# hubot-aar

Hubot scripts that searches for answers in Apigee Answer Repository [AAR]

Commands:
```
hubot rfp <keyword> - searches AAR
```

See [`src/rfp.js`](src/rfp.js) for full documentation [ and code ;)]

## Installation

In hubot project repo, run:

`npm install git://github.com/mukundha/aar-bot --save`

Then add **aarbot** to your `external-scripts.json`:

```json
[
  "aarbot"
]
```
