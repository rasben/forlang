// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// @ts-ignore
import { returnResponse, PageContent } from '../shared.ts';

// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
	// @ts-ignore
	Deno.env.get('SUPABASE_URL') ?? '',
	// @ts-ignore
	Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// Send messages to AI, and get a text response.
async function getAiSummary(pageContent: PageContent): Promise<string | boolean> {
	const options = {
		method: 'POST',
		url: 'https://api.edenai.run/v2/text/summarize',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${Deno.env.get('EDENAI_TOKEN')}`
		},
		body: JSON.stringify({
			output_sentences: 10,
			providers: 'microsoft',
			text: pageContent.textContent,
			language: pageContent.lang
		})
	};

	const response = await fetch('https://api.edenai.run/v2/text/summarize', options);
	const text = await response.json();

	console.log('summaryAI');
	console.log(text?.microsoft?.result);

	return text?.microsoft?.result;
}

// Load an existing summary from Supabase DB.
async function loadExistingSummary(pageContent: PageContent): Promise<string | boolean> {
	const hash = pageContent?.hash ?? false;

	if (!hash) {
		return false;
	}

	const { data, error } = await supabase.from('summaries').select('summary').eq('id', hash);

	if (error) {
		console.error(error);
	}

	if (error || !data?.length) {
		return false;
	}

	return data[0].summary ?? false;
}

// Load an existing summary from Supabase DB.
async function saveExistingSummary(pageContent: PageContent, summary: string): Promise<boolean> {
	const hash = pageContent?.hash;

	if (!hash) {
		console.error('No hash, not saving summary');
		return false;
	}

	const { error } = await supabase.from('summaries').upsert(
		{
			id: hash,
			summary: summary
		},
		{ onConflict: 'id' }
	);

	if (error) {
		console.error(error);
	}

	return !error;
}

serve(async (request: Request): Promise<Response> => {
	const { url } = await request.json();

	const { data, error } = await supabase.functions.invoke('reader', {
		body: { url: url }
	});

	const pageContent = data?.page_content as PageContent | undefined;

	if (error || !pageContent) {
		console.error(error);

		return returnResponse(
			{
				content: 'Could not get page content'
			},
			500
		);
	}

	// If the page isn't long, we might aswell return the whole text.
	if (pageContent?.textContent.length < 300) {
		console.log('Page is short, returning full text');

		return returnResponse({
			content: pageContent?.textContent
		});
	}

	// If we have a hash, we can try to load the summary from the DB.
	const existingSummary = await loadExistingSummary(pageContent);

	// The response payload is not a boolean, so we can assume it's a payload.
	if (typeof existingSummary === 'string') {
		console.log('Found existing summary');

		return returnResponse({
			page_content: pageContent,
			content: existingSummary
		});
	}

	// The response was not a payload, so we need to do the expensive
	// OpenAI call, to get a Summary.
	const aiSummary = await getAiSummary(pageContent);

	if (typeof aiSummary === 'boolean') {
		return returnResponse(
			{
				content: 'Could not recap content'
			},
			500
		);
	}

	// Save the summary to the DB.
	await saveExistingSummary(pageContent, aiSummary);

	return returnResponse({
		page_content: pageContent,
		content: aiSummary
	});
});
