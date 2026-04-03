-- Run in Supabase SQL Editor (or migrate). Creates table + RLS + seed rows.
-- Table: public.syntax_challenges

create table if not exists public.syntax_challenges (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  question text not null,
  code text not null,
  choices text[] not null check (cardinality(choices) between 2 and 8),
  correct_index smallint not null check (correct_index >= 0 and correct_index < 8),
  explanation text,
  source text not null default 'curated' check (source in ('curated', 'community')),
  is_published boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint syntax_challenges_correct_in_range check (
    correct_index < cardinality(choices)
  )
);

create index if not exists syntax_challenges_published_idx
  on public.syntax_challenges (is_published)
  where is_published = true;

alter table public.syntax_challenges enable row level security;

-- Public: only published rows (play the game without login)
create policy "syntax_challenges_select_published"
  on public.syntax_challenges
  for select
  using (is_published = true);

-- Logged-in visitors: add community rows (forced to community + published in policy)
create policy "syntax_challenges_insert_community"
  on public.syntax_challenges
  for insert
  to authenticated
  with check (
    source = 'community'
    and is_published = true
    and created_by = auth.uid()
  );

-- Optional: service role / dashboard can manage curated rows without going through RLS
-- (Supabase dashboard uses service role.)

-- Seed data (curated)
insert into public.syntax_challenges (language, question, code, choices, correct_index, explanation, source)
values
(
  'TypeScript',
  'What completes this type so `x` is a string or number?',
  'type Id = _________;\nconst x: Id = Math.random() > 0.5 ? "a" : 1;',
  array['string | number', 'string & number', 'unknown', 'any'],
  0,
  '`string | number` is a union: the value may be either primitive.',
  'curated'
),
(
  'JavaScript',
  'Which method creates a new array with only truthy values removed (conceptually)?',
  'const nums = [0, 1, "", "hi"].______();',
  array['filter(Boolean)', 'map(Boolean)', 'reduce(Boolean)', 'splice(0)'],
  0,
  '`filter(Boolean)` drops falsy values like 0 and empty string.',
  'curated'
),
(
  'CSS',
  'What property centers a flex item along the cross axis in a row flex container?',
  '.box {\n  display: flex;\n  flex-direction: row;\n  _______: center;\n}',
  array['align-items', 'justify-content', 'place-content', 'vertical-align'],
  0,
  '`align-items` controls cross-axis alignment; `justify-content` is the main axis.',
  'curated'
),
(
  'Python',
  'What keyword defines a generator function?',
  '_______ count():\n    n = 0\n    while True:\n        yield n\n        n += 1',
  array['def', 'async', 'lambda', 'generator'],
  0,
  'Python uses `def` for functions; `yield` makes it a generator.',
  'curated'
),
(
  'SQL',
  'Which clause limits how many rows are returned?',
  'SELECT * FROM posts\nWHERE published = true\n_______ 10;',
  array['LIMIT', 'TAKE', 'TOP', 'FIRST'],
  0,
  'Standard SQL in Postgres uses `LIMIT`.',
  'curated'
),
(
  'Angular',
  'Which decorator marks a class field as a writable signal?',
  'import { signal, ______ } from "@angular/core";\n\nexport class Counter {\n  n = signal(0);\n}',
  array['No extra decorator — use signal()', '@Signal()', '@Writable()', '@State()'],
  0,
  'Angular signals use `signal()`; there is no `@Signal` decorator for fields.',
  'curated'
);

-- Run this seed block once per project. Re-running inserts duplicate rows unless you truncate first.
