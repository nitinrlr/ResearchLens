# Scripts

## import-papers

Imports research papers from OpenAlex into PostgreSQL.

For each topic in the script's default list, it imports the most-cited
open-access Computer Science papers whose title or abstract contains that exact
phrase, including their abstracts, authors and topics.

```bash
npm run import:papers
```

Import specific topics instead of the default list:

```bash
npm run import:papers -- "vision transformer" "speculative decoding"
```

Running it again is safe. Existing papers are refreshed rather than duplicated,
so a re-run also fills in fields added since the last import.

Set `OPENALEX_API_KEY` in `.env` to raise the OpenAlex limit from 1,000 to
10,000 requests a day. The import uses one request per topic.

To browse the result:

```bash
npx prisma studio
```
