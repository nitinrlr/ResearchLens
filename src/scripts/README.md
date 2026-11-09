# Scripts

## import-papers

Imports research papers from OpenAlex into PostgreSQL.

It goes through English open-access Computer Science papers from most-cited down, and
saves them with their abstracts, authors and topics until the database reaches
the total you ask for.

```bash
npm run import:papers -- 10000
```

With no number, it fills the database to 50,000 papers.

Running it again is safe, and picks up where it left off. Papers already in the
database are skipped, along with duplicates and any paper missing a PDF link,
authors or a real abstract. Existing papers are not updated.

Set `OPENALEX_API_KEY` in `.env` to get your own daily OpenAlex budget instead
of sharing one with your network. Each request fetches 200 papers.

To browse the result:

```bash
npx prisma studio
```
