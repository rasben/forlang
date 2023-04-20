// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { sanitizeUrl } from 'https://cdn.skypack.dev/@braintree/sanitize-url?dts';
// @ts-ignore
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
// @ts-ignore
import { Readability } from 'https://cdn.skypack.dev/@mozilla/readability?dts';
// @ts-ignore
import { md5 } from 'https://esm.run/hash-wasm@4';

import { returnResponse, PageContent, ReadabilityParsed } from '../shared.ts';

function returnValidURL(input_url: string): boolean | URL {
	input_url = sanitizeUrl(input_url);

	let url;

	try {
		url = new URL(input_url);
	} catch (_) {
		return false;
	}

	if (!(url.protocol === 'http:' || url.protocol === 'https:')) {
		return false;
	}

	return url;
}

async function getContent(url: string): Promise<PageContent | boolean> {
	const cleanURL = returnValidURL(url);

	// if cleanUrl is a URL
	if (!(cleanURL instanceof URL)) {
		return false;
	}

	const response = await fetch(cleanURL);
	const html = await response.text();

	const doc = new DOMParser().parseFromString(html, 'text/html');

	const reader = new Readability(doc, {
		debug: false,
		maxElemsToParse: 100000,
		nbTopCandidates: 5,
		charThreshold: 500,
		classesToPreserve: []
	});

	const parsed = reader.parse() as ReadabilityParsed;
	return {
		...parsed,
		url: cleanURL,
		hash: await md5(parsed?.textContent),
		type: 'PageContent'
	};
}

serve(async (request: Request): Promise<Response> => {
	const { url } = await request.json();

	const pageContent = await getContent(url);

	if (typeof pageContent === 'boolean' || pageContent?.type !== 'PageContent') {
		return returnResponse(
			{
				content: 'Invalid URL'
			},
			400
		);
	}

	if (!pageContent?.textContent) {
		return returnResponse(
			{
				content: 'Could not get page content'
			},
			500
		);
	}

	return returnResponse({
		content: pageContent.textContent,
		page_content: pageContent
	});
});
