'use strict'

const search = require('.')

const timeout = 5 * 1000

search.byId('86af5e4a3c62635d', '2', timeout, (err, service) => {
	if (err) {
		console.error(err)
		process.exitCode = 1
	} else {
		console.log('by ID', service.name, service.host, service.port)
	}
})

search.byName('some-fasp-receiver', '2', timeout, (err, service) => {
	if (err) {
		console.error(err)
		process.exitCode = 1
	} else {
		const id = service.txtRecord && service.txtRecord.id
		console.log('by name', id, service.host, service.port)
	}
})
