import { createClient } from '@supabase/supabase-js';

import type { ResponsePayload as SupabaseResponse } from '../../supabase/functions/shared';

import { SUPABASE_URL, SUPABASE_ANON_KEY, FORM_SECRET } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const url = formData.get('url');
		const secret = formData.get('secret');

		if (secret !== FORM_SECRET) {
			return {
				success: false,
				fail_reason: 'Du gav ikke det rigtige kodeord'
			};
		}

		const { data, error } = await supabase.functions.invoke('enshorter', {
			body: { url: url }
		});

		if (error) {
			return {
				success: false,
				fail_reason: 'Der skete en fejl'
			};
		}

		const supabaseResponse = data as SupabaseResponse;

		return {
			secret: secret,
			success: true,
			content: supabaseResponse?.content,
			pageContent: supabaseResponse?.page_content
		};
	}
};
