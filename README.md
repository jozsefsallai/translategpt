# TranslateGPT

The power of GPT-3.5, now as a translation service.

I know this isn't the first, nor the last time someone has done this, but I felt
like experimenting with certain technologies and this quick afternoon project
was a good way to do so. The most important technologies/paradigms used in the
project:

- Next.js
- App Router
- React Server Components and server actions
- TailwindCSS
- shadcn/ui
- Vercel AI SDK
- Zod

## How it works

When you first visit the page, you're asked to enter your API key that you can
get from OpenAI's website. Once provided, the API key will be stored in your
browser's local storage and will be used for all future requests. The API key is
never stored on the server. Each translation request is sent to OpenAI using a
server action (however, a REST API is also available) and will consume your API
credits.

## REST API

You can use the following endpoint to translate text using the service:

```
/api/translate/:src/:dest?text=some%20text%20here
```

- `src` is the source language code (e.g. `en`), you can also use `auto` to
  automatically detect the source language
- `dest` is the destination language code (e.g. `es`), you cannot use `auto`
  here

You must also provide an `X-API-Key` header which contains your OpenAI API key.
The source and destination languages cannot be identical. The text needs to be
between 1 and 4000 characters long. A list of supported values for the `src` and
`dest` parameters can be found [in this file][langs-url].

**Example response:**

```json
{
  "translation": "Hola, ¿cómo estás?"
}
```

## Development

Prerequisites:

- git
- Node.js
- pnpm

**Clone the repository:**

```sh
git clone git@github.com:jozsefsallai/translategpt.git
```

**Install dependencies:**

```sh
pnpm install
```

**Run the development server:**

```sh
pnpm dev
```

## License

MIT.

[langs-url]: https://github.com/jozsefsallai/translategpt/blob/master/constants/languages.ts
