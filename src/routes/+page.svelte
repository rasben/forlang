<script>
	import { enhance } from '$app/forms';

	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	// https://icones.js.org/
	import 'iconify-icon';

	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	export let form;

	let loading = false;

	async function handleSubmit(event) {
		event.preventDefault();
		loading = true;

		const formData = new FormData(event.target);

		await fetch('/', {
			method: 'POST',
			body: formData
		});

		loading = false;
	}
</script>

<div class="absolute right-5 top-5">
	<LightSwitch />
</div>

<div class="container mx-auto max-w-lg py-6 px-12 variant-soft-surface">
	<h1 class="my-6">
		<strong class="font-extrabold">Forlang mindre</strong>
		<span class="font-normal">af for lange websites</span>
	</h1>

	<form method="POST" class="my-6" use:enhance on:submit|preventDefault={handleSubmit}>
		<div class=" grid grid-cols-1 gap-4">
			<label class="label">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">
						<iconify-icon icon="heroicons:globe-asia-australia-solid" />
					</div>
					<input type="text" name="url" placeholder="https://forlang.dk" required />
				</div>
			</label>

			<label class="label">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">
						<iconify-icon icon="heroicons:key-solid" />
					</div>
					<input type="text" name="secret" placeholder="Kodeord" value={form?.secret ?? ''} />
				</div>
			</label>

			<button class="btn variant-filled-secondary" disabled={loading} type="submit">
				<iconify-icon icon="heroicons:bolt-20-solid" />

				<span>Læs den for mig!</span>
			</button>
		</div>
	</form>
</div>
<div class="container mx-auto max-w-lg">
	{#if loading}
		<ProgressBar value={undefined} />
	{/if}

	{#if form?.fail_reason}
		<aside class="alert my-6 variant-filled">
			<div>😭</div>

			<div class="alert-message">
				<p>{form?.fail_reason}</p>
			</div>

			<div>😭</div>
		</aside>
	{/if}

	{#if form?.success}
		<article class="card my-6 p-2">
			<header class="m-6">
				<h1 class="unstyled text-3xl font-bold">
					{form?.pageContent?.title}
				</h1>
			</header>
			<section class="m-6">
				{@html form?.content
					.split(/\. (?=[A-Z])/)
					.map((p, i, arr) => `<p class="mb-2">${p}${i === arr.length - 1 ? '' : '.'}</p>`)
					.join('')}

				<hr class="opacity-50" />
			</section>
			<footer class="m-6">
				<a class="btn variant-ghost btn-sm" href={form?.pageContent.url}>
					Læs den fulde artikel ({form?.pageContent?.length} tegn)
				</a>
			</footer>
		</article>
	{/if}
</div>

<div class="relative">
	<div class="absolute right-5 bottom-5">
		<a type="button" class="btn btn-sm variant-filled" href="https://github.com/rasben/forlang/">
			<iconify-icon icon="fa6-brands:github" />
			<span>GitHub</span>
		</a>
	</div>
</div>
