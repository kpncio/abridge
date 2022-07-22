// Expects: Any URI-Encoded URL:
// https://app.kpnc.io/shorten/https%3A%2F%2Fcalculator.aws --> kpnc.io/12345

async function handleRequest(request) {
	function validurl(string) {
		var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

    	return (res !== null);
	}

	try {
		var long = decodeURIComponent(new URL(request.url).pathname.substring(1)).replace('shorten/', '');

		// const blocked = [ 'Google Cloud', 'Linode LLC', 'DigitalOcean LLC' ];
		// blocked.forEach(organization => {
		// 	if (request.cf.asOrganization == organization) {
		// 		return new Response('Bad request...', {
		// 			headers: { 'content-type': 'text/plain', 'status' : 400 },
		// 		})
		// 	}
		// });

		// if (long === 'wp-admin/' || long === 'favicon.ico') {
		// 	return new Response('Bad request...', {
		// 		headers: { 'content-type': 'text/plain', 'status' : 400 },
		// 	})
		// }
	} catch {
		return new Response('No long...', {
			headers: { 'content-type': 'text/plain', 'status' : 400 },
		})
	}

	if (!validurl(long)) {
		return new Response('No valid long...', {
		headers: { 'content-type': 'text/plain', 'status' : 400 },
		})
	}

	var organization = request.cf.asOrganization;

	while(true) {
		var short = Math.random().toString(36).substr(2, 5).split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');

		const check = await kv.get(short);

		if (check === null) {
			await kv.put(short, long + '|' + organization);

			break;
		}
	}

	return new Response('Success: ' + short + '\n' + 'Logged: ' + organization, {
		headers: { 'content-type': 'text/plain', 'status' : 200 },
	})
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})