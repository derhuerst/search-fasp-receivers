'use strict'

const mdns = require('mdns')

const noop = () => {}
const defaultTimeout = 10 * 1000

const search = (timeout, onService, onTimeout) => {
	if ('function' === typeof timeout) {
		onTimeout = onService || noop
		onService = timeout
		timeout = null
	}

	const browser = new mdns.Browser(mdns.tcp('fasp'))
	browser.on('serviceUp', onService)

	browser.start()
	const timer = setTimeout(() => {
		browser.stop()
		onTimeout()
	}, timeout || defaultTimeout)

	const stopSearching = () => {
		browser.stop()
		clearTimeout(timer)
	}
	return stopSearching
}

const searchById = (id, timeout, cb) => {
	if ('string' !== typeof id || !id) {
		throw new Error('id must be a non-empty string.')
	}
	if ('function' === typeof timeout) {
		cb = timeout
		timeout = null
	}

	const onService = (srv) => {
		if (!found && srv && srv.txtRecord && srv.txtRecord.id === id) {
			stop()
			found = true
			cb(null, srv)
		}
	}

	const err = new Error(`Search for receiver ${id} timed out.`)
	err.timeout = true
	const onTimeout = () => {
		if (!found) cb(err)
	}

	let found = false
	const stop = search(timeout, onService, onTimeout)
	return stop
}

const searchByName = (name, timeout, cb) => {
	if ('string' !== typeof name || !name) {
		throw new Error('name must be a non-empty string.')
	}
	if ('function' === typeof timeout) {
		cb = timeout
		timeout = null
	}

	const onService = (srv) => {
		if (!found && srv && srv.name === name) {
			stop()
			found = true
			cb(null, srv)
		}
	}

	const err = new Error(`Search for receiver "${name}" timed out.`)
	err.timeout = true
	const onTimeout = () => {
		if (!found) cb(err)
	}

	let found = false
	const stop = search(timeout, onService, onTimeout)
	return stop
}

search.byId = searchById
search.byName = searchByName
module.exports = search
