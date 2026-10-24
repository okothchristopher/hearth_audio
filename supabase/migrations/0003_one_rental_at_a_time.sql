-- One speaker at a time: a renter can't book while they have an active rental,
-- except the next speaker in a swap, which may start on or after the collection day.
-- Run in the Supabase SQL Editor after 0002_swap.sql.

create function public.enforce_one_rental() returns trigger
language plpgsql set search_path = '' as $$
begin
  -- Serialise bookings per renter so two at once can't both pass the check
  perform pg_advisory_xact_lock(hashtext(new.person_id::text));
  if exists (
    select 1 from public.rentals r
    where r.person_id = new.person_id
      and r.returned_at is null
      and r.id <> new.id
      and (r.collection_date is null or new.start_date < r.collection_date)
  ) then
    -- The app maps this code to "You already have a speaker. Swap it first…"
    raise exception 'Renter already has an active rental' using errcode = 'HA001';
  end if;
  return new;
end $$;

create trigger rentals_one_at_a_time before insert on public.rentals
  for each row execute function public.enforce_one_rental();
