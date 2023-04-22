<script>
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import 'iconify-icon';

	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	export let form;
</script>

<div class="absolute right-5 top-5">
	<LightSwitch />
</div>

<div class="container mx-auto max-w-lg my-16">
	<h1 class="my-6">
		<strong>Forlang mindre</strong> af for lange websites
	</h1>

	<form method="POST" class="m-6">
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
					<input type="password" name="secret" placeholder="Kodeord" />
				</div>
			</label>

			<button class="btn variant-filled-secondary">
				<iconify-icon icon="heroicons:bolt-20-solid" />

				<span>Læs den for mig!</span>
			</button>
		</div>
	</form>

	{form?.fail_reason ?? ''}

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
				<button class="btn variant-ghost btn-sm">
					Læs den fulde, rene artikel ({form?.pageContent?.length} tegn)
				</button>
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
