// Expects: Five Character Code:
// kpnc.io/12345 --> https://example.com

async function handleRequest(request) {
	try {
		var short = new URL(request.url).pathname.substring(1);
	} catch {
		return Response.redirect('https://www.kpnc.io/', 301);
	}

	if (short.length != 5) {
		return Response.redirect('https://www.kpnc.io/' + short, 301);
	}

	try {
		let long = await kv.get(short);
		long = long.split('|||');

		if (long[0] == null) {
			return Response.redirect('https://www.kpnc.io/', 302);
		} else {
			return Response.redirect(long[0], 308);
		}
	} catch {
		return Response.redirect('https://www.kpnc.io/', 302);
	}
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
});