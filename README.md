# Forlang.dk / API

## Getting started locally

You'll need a `.env` file, with these values (assuming you've set up your own Supabase project)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
FORM_SECRET=
```

The `FORM_SECRET` is necessary if you want to locally test the password functionality.
You can leave it empty.

After that, you should be able to just run `npm install && npm run dev`.

## to-do

This is very much a work-in-progress.

Pull requests are always welcome :)

[See GitHub issues](https://github.com/rasben/forlang/issues) to see the current to-dos and bugs.

## Supabase APIs

Supabase is used for creating API endpoints to create the summaries and AI calls.

We're doing the logic here, rather than in Svelte, as this opens up for using the service in other Apps too, [like this Zulip Chatbot.](https://github.com/rasben/openai-zulip/blob/main/supabase/functions/readerbot/index.ts)

For now, the API is not public, but you can deploy the edgefunctions yourself on Supabase. See [/supabase/functions](/supabase/functions) for the code.

### "reader" - edge function

Using [mozilla/readability](https://github.com/mozilla/readability), we parse the supplied website and get a clean article.

### "enshorter" - edge function

Using the output of `reader` we use AI summarization tools to create a summary, to be displayed to the user.

## Forlang.dk website

**Built with**

- [SvelteKit](https://kit.svelte.dev/)
- [Skeleton.dev](https://www.skeleton.dev/) - a UI kit, built ontop of **Svelte** and **TailwindCSS**
- [Vercel](https://vercel.com/) for hosting the forlang.dk
- [GitHub](https://media2.giphy.com/media/Ui84ztoe6yVEBZhvnt/giphy.gif?cid=ecf05e475p8dpoklcvda1achqi76fs34sflfzaokidp7eryp&rid=giphy.gif&ct=g) for code-hosting and basic tests using GitHub actions.

## More docs

[SvelteKit README](SVELTE-README.md)
