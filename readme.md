# search-fasp-receivers

**Search for [Friendly Audio Streaming Protocol](https://github.com/derhuerst/friendly-audio-streaming-protocol) receivers in the local network.**

*Note*: `search-fasp-receivers` works only in Node, because it needs access to [mDNS](https://en.wikipedia.org/wiki/Multicast_DNS) to find the receivers.

[![npm version](https://img.shields.io/npm/v/search-fasp-receivers.svg)](https://www.npmjs.com/package/search-fasp-receivers)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/search-fasp-receivers.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install search-fasp-receivers
```


## Usage

```js
const search = require('search-fasp-receivers')

const timeout = 5 * 1000

search.byName('alice-fasp-receiver', timeout, (err, service) => {
	if (err) console.error(err)
	else console.log('found', service.host, service.port)
})
```

If you know the ID of a receiver, it is safer to search using this instead of the name:

```js
search.byId('86af5e4a3c62635d', timeout, (err, service) => {
	// …
})
```


## Contributing

If you have a question or have difficulties using `search-fasp-receivers`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/search-fasp-receivers/issues).
