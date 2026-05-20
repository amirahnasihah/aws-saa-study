CREATE TABLE IF NOT EXISTS glossary (
  term TEXT PRIMARY KEY,
  definition TEXT NOT NULL,
  category TEXT
);

CREATE INDEX IF NOT EXISTS idx_glossary_category ON glossary(category);
