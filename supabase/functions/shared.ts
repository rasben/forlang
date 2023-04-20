export interface ReadabilityParsed {
	title: string;
	content?: string;
	textContent: string;
	length: number;
	excerpt: string;
	byline: string;
	dir: string;
	siteName: string;
	lang: string;
}

export interface PageContent extends ReadabilityParsed {
	url: URL;
	hash: string;
	readonly type: 'PageContent';
}

export interface ResponsePayload {
	content: string;
	page_content?: PageContent;
}

export function returnResponse(payload: ResponsePayload, status = 200): Response {
	return new Response(JSON.stringify(payload), {
		headers: { 'Content-Type': 'application/json' },
		status: status
	});
}
