// @ts-ignore
import { sanitizeUrl } from 'https://cdn.skypack.dev/@braintree/sanitize-url?dts';
// @ts-ignore
import { Readability } from 'https://cdn.skypack.dev/@mozilla/readability?dts';
// @ts-ignore
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

interface ReadabilityParsed {
	title: string;
	content: string;
	textContent: string;
	length: number;
	excerpt: string;
	byline: string;
	dir: string;
	siteName: string;
	lang: string;
}

interface PageContent extends ReadabilityParsed {
	url: URL;
	readonly type: 'PageContent';
}

interface ResponsePayload {
	content: string;
	content_type: string;
}

export function returnValidURL(input_url: string): boolean | URL {
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

export function returnResponse(payload: ResponsePayload, status = 200): Response {
	return new Response(
		JSON.stringify({
			payload
		}),
		{
			headers: { 'Content-Type': 'application/json' },
			status: status
		}
	);
}

export async function getContent(url: string): Promise<PageContent | boolean> {
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
	return { ...parsed, url: cleanURL, type: 'PageContent' };
}
