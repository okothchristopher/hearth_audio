-- Hearth Audio schema: people, speakers, rentals, listening notes (hearth-audio-spec.md).
-- Run once in the Supabase SQL Editor, then run supabase/seed.sql.

create extension if not exists btree_gist;

-- People -----------------------------------------------------------------------

create table public.people (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null,
  area text,                                 -- shown on listening notes, e.g. "Kilimani"
  role text not null default 'renter' check (role in ('renter', 'admin'))
);

-- A people row for every sign-up. Name and area come from sign-up metadata.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.people (id, name, email, area)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''), new.email, new.raw_user_meta_data ->> 'area');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.people where id = auth.uid() and role = 'admin')
$$;

-- Speakers ---------------------------------------------------------------------

create table public.speakers (
  id text primary key,                       -- slug, e.g. 'ember-monitor'
  name text not null,
  type text not null,                        -- type and tuning for cards
  price_per_month integer not null check (price_per_month > 0),
  description text not null,
  details jsonb not null default '{}',       -- kind, tuning, size, room, connections
  photo_path text,                           -- object in the speaker-photos bucket
  status text not null default 'available' check (status in ('available', 'rented')),
  position integer not null default 0        -- Browse order
);

-- Rentals ----------------------------------------------------------------------

create table public.rentals (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people (id),
  speaker_id text not null references public.speakers (id),
  start_date date not null,
  return_date date generated always as (start_date + 30) stored,
  returned_at timestamptz,
  created_at timestamptz not null default now(),
  -- No two active rentals of one speaker overlap, even when two people book at once.
  -- The app maps this violation (SQLSTATE 23P01) to "Someone just booked this speaker."
  constraint rentals_no_overlap exclude using gist (
    speaker_id with =, daterange(start_date, return_date, '[)') with &&
  ) where (returned_at is null)
);

create index rentals_person_idx on public.rentals (person_id);

-- Booking marks the speaker rented; marking a rental returned frees it again.
-- Security definer because renters may not update speakers themselves.
create function public.sync_speaker_status() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.speakers s
  set status = case when exists (
    select 1 from public.rentals r where r.speaker_id = s.id and r.returned_at is null
  ) then 'rented' else 'available' end
  where s.id = new.speaker_id;
  return new;
end $$;

create trigger rentals_sync_speaker_status after insert or update of returned_at on public.rentals
  for each row execute function public.sync_speaker_status();

-- Listening notes --------------------------------------------------------------

create table public.listening_notes (
  id uuid primary key default gen_random_uuid(),
  speaker_id text not null references public.speakers (id),
  person_id uuid references public.people (id),  -- null only for seeded sample notes
  author_name text not null,                     -- first name, copied from people on insert
  author_area text,
  stars smallint not null check (stars between 1 and 5),
  text text not null check (char_length(text) >= 20),
  created_at timestamptz not null default now()
);

create index listening_notes_speaker_idx on public.listening_notes (speaker_id, created_at desc);

-- Notes are public but people rows are not, so copy the author's first name and
-- area onto the note. Overwrites whatever the client sent.
create function public.set_note_author() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.person_id is not null then
    select split_part(p.name, ' ', 1), p.area into new.author_name, new.author_area
    from public.people p where p.id = new.person_id;
  end if;
  return new;
end $$;

create trigger listening_notes_set_author before insert on public.listening_notes
  for each row execute function public.set_note_author();

-- Views for Browse -------------------------------------------------------------

create view public.speaker_ratings with (security_invoker = true) as
  select speaker_id, round(avg(stars), 1) as rating, count(*)::int as note_count
  from public.listening_notes group by speaker_id;

-- "Returns 3 Nov": runs as owner so anyone sees return dates, but only the
-- speaker and date, never who rented it.
create view public.speaker_returns as
  select speaker_id, max(return_date) as return_date
  from public.rentals where returned_at is null group by speaker_id;

-- Row-level security -----------------------------------------------------------

alter table public.people enable row level security;
alter table public.speakers enable row level security;
alter table public.rentals enable row level security;
alter table public.listening_notes enable row level security;

-- No update policy on people: nobody can change their own role.
create policy "read own profile" on public.people for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy "anyone reads speakers" on public.speakers for select using (true);
create policy "admins manage speakers" on public.speakers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "read own rentals" on public.rentals for select to authenticated
  using (person_id = (select auth.uid()) or public.is_admin());
create policy "book for yourself" on public.rentals for insert to authenticated
  with check (person_id = (select auth.uid()));
create policy "admins update rentals" on public.rentals for update to authenticated
  using (public.is_admin());

create policy "anyone reads notes" on public.listening_notes for select using (true);
create policy "note on a speaker you rented" on public.listening_notes for insert to authenticated
  with check (
    person_id = (select auth.uid())
    and exists (
      select 1 from public.rentals r
      where r.person_id = (select auth.uid()) and r.speaker_id = listening_notes.speaker_id
    )
  );

-- Storage ----------------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('speaker-photos', 'speaker-photos', true)
  on conflict (id) do nothing;

create policy "admins upload speaker photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'speaker-photos' and public.is_admin());
create policy "admins change speaker photos" on storage.objects for update to authenticated
  using (bucket_id = 'speaker-photos' and public.is_admin());
create policy "admins delete speaker photos" on storage.objects for delete to authenticated
  using (bucket_id = 'speaker-photos' and public.is_admin());
