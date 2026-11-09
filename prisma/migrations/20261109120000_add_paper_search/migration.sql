-- One searchable column per paper. Search spans title, abstract, authors and
-- topics, and a single indexed column is what keeps that fast at scale.
ALTER TABLE "Paper" ADD COLUMN "searchVector" tsvector;

-- Rebuilds the column for the given papers. Called after their authors and
-- topics are saved, because the text comes from all of those tables.
CREATE FUNCTION refresh_paper_search(paper_ids TEXT[]) RETURNS void
LANGUAGE sql
AS $$
  UPDATE "Paper" AS paper
  SET "searchVector" = to_tsvector(
    'english',
    concat_ws(
      ' ',
      paper.title,
      paper.abstract,
      (
        SELECT string_agg(author.name, ' ')
        FROM "PaperAuthor" AS link
        JOIN "Author" AS author ON author.id = link."authorId"
        WHERE link."paperId" = paper.id
      ),
      (
        SELECT string_agg(topic.name, ' ')
        FROM "PaperTopic" AS link
        JOIN "Topic" AS topic ON topic.id = link."topicId"
        WHERE link."paperId" = paper.id
      )
    )
  )
  WHERE paper.id = ANY(paper_ids);
$$;

SELECT refresh_paper_search(ARRAY(SELECT id FROM "Paper"));

CREATE INDEX "Paper_publishedDate_idx" ON "Paper"("publishedDate");
CREATE INDEX "Paper_searchVector_idx" ON "Paper" USING GIN ("searchVector");
