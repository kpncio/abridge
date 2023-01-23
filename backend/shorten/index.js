// Expects: Any URI-Encoded URL:
// https://app.kpnc.io/shorten/https%3A%2F%2Fexample.com --> kpnc.io/12345

async function handleRequest(request) {
	try {
		if (request.method != 'GET') {
			return new Response(JSON.stringify({'success': false, 'message': '[Failure]: Unsupported request method...'}), {
				headers: {
					'content-type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'status': 200
				}, status: 200
			});
		}

		console.log(request.url);

		let long = decodeURIComponent(new URL(request.url).pathname.substring(1)).replace('shorten/', '');
		let url = new URL(long);

		console.log(long);

		if (long == null) {
			return new Response(JSON.stringify({'success': false, 'message': '[Failure]: No URL inputted...'}), {
				headers: {
					'content-type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'status': 200
				}, status: 200
			});
		}

		if (!(url.protocol == 'http:' || url.protocol == 'https:')) {
			return new Response(JSON.stringify({'success': false, 'message': `[Failure]: Invalid protocol inputted (${url.protocol})...`}), {
				headers: {
					'content-type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'status': 200
				}, status: 200
			});
		}
	
		while(true) {
			let short = Math.random().toString(36).substr(2, 5).split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');
	
			const check = await kv.get(short);
	
			if (check === null) {
				await kv.put(short, long + '|||' + request.cf.asOrganization);
	
				return new Response(JSON.stringify({'success': true, 'message': `[Success]: Shortened to kpnc.io/${short}`}), {
					headers: {
						'content-type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Headers': '*',
						'status': 200
					}, status: 200
				});
			}
		}
	} catch {
		return new Response(JSON.stringify({'success': false, 'message': '[Failure]: Invalid URL inputted...'}), {
			headers: {
				'content-type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
				'status': 200
			}, status: 200
		});
	}
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
});