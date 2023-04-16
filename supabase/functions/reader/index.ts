// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { returnResponse, getContent } from '../shared.ts';

serve(async (request: Request): Promise<Response> => {
	const { url } = await request.json();

	const pageContent = await getContent(url);

	if (typeof pageContent === 'boolean' || pageContent?.type !== 'PageContent') {
		return returnResponse(
			{
				content: 'Invalid URL',
				content_type: 'text'
			},
			400
		);
	}

	if (!pageContent?.content) {
		return returnResponse(
			{
				content: 'Could not get page content',
				content_type: 'text'
			},
			500
		);
	}

	return returnResponse({
		content: pageContent.content,
		content_type: 'text/html'
	});
});
