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

	// https://github.com/agnat/node_mdns/issues/130#issuecomment-120731155
	const seq = [
		mdns.rst.DNSServiceResolve(),
		('DNSServiceGetAddrInfo' in mdns.dns_sd
			? mdns.rst.DNSServiceGetAddrInfo()
			: mdns.rst.getaddrinfo({families: [4]})
		),
		mdns.rst.makeAddressesUnique()
	]
	const browser = new mdns.Browser(mdns.tcp('fasp'), {resolverSequence: seq})
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

const searchByFn = (isMatch, timeout, cb) => {
	let found = false
	const onService = (srv) => {
		if (!found && isMatch(srv)) {
			stop()
			found = true
			cb(null, srv)
		}
	}

	const err = new Error('Search timed out.')
	err.timeout = true
	const onTimeout = () => {
		if (!found) cb(err)
	}

	const stop = search(timeout, onService, onTimeout)
	return stop
}

const searchById = (id, version, timeout, cb) => {
	if ('string' !== typeof id || !id) {
		throw new Error('id must be a non-empty string.')
	}
	if (('string' !== typeof version || !version) && version !== null) {
		throw new Error('version must be a non-empty string of null.')
	}
	if ('function' === typeof timeout) {
		cb = timeout
		timeout = null
	}
	const isMatch = (srv) => {
		const r = srv.txtRecord
		return r && r.id === id && r.version === version
	}
	return searchByFn(isMatch, timeout, cb)
}

const searchByName = (name, version, timeout, cb) => {
	if ('string' !== typeof name || !name) {
		throw new Error('name must be a non-empty string.')
	}
	if (('string' !== typeof version || !version) && version !== null) {
		throw new Error('version must be a non-empty string of null.')
	}
	if ('function' === typeof timeout) {
		cb = timeout
		timeout = null
	}
	const isMatch = (srv) => {
		const r = srv.txtRecord
		return srv.name === name && r && r.version === version
	}
	return searchByFn(isMatch, timeout, cb)
}

search.byId = searchById
search.byName = searchByName
module.exports = search
