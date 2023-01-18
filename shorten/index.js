// Expects: Any URI-Encoded URL:
// https://app.kpnc.io/shorten/https%3A%2F%2Fexample.com --> kpnc.io/12345

async function handleRequest(request) {
	try {
		console.log(request.url);

		let long = decodeURIComponent(new URL(request.url).pathname.substring(1)).replace('shorten/', '');
		let url = new URL(long);

		console.log(long);

		if (long == null) {
			return new Response('No URL inputted...', {
				headers: { 'content-type': 'text/plain', 'status' : 400 },
			});
		}

		if (!url.protocol == 'http:' || !url.protocol == 'https:' ) {
			return new Response('Invalid protocol inputted...', {
				headers: { 'content-type': 'text/plain', 'status' : 400 },
			});
		}
	
		while(true) {
			let short = Math.random().toString(36).substr(2, 5).split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');
	
			const check = await kv.get(short);
	
			if (check === null) {
				await kv.put(short, long + '|||' + request.cf.asOrganization);
	
				return new Response(`Success: <a href="https://kpnc.io/${short}">kpnc.io/${short}</a>`, {
					headers: { 'content-type': 'text/plain', 'status' : 200 },
				});
			}
		}
	} catch {
		return new Response('Invalid URL inputted...', {
			headers: { 'content-type': 'text/plain', 'status' : 400 },
		});
	}
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
});