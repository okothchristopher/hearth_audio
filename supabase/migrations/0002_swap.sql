-- Swap: a renter picks a collection day for their current speaker (prototype Swap.dc.html).
-- The admin marks the rental returned (returned_at) when it is collected.
-- Run in the Supabase SQL Editor after 0001_initial.sql.

alter table public.rentals add column collection_date date;
alter table public.rentals add constraint rentals_collection_in_period
  check (collection_date is null or collection_date between start_date and return_date);

-- Browse's "Returns 3 Nov" uses the collection day once a swap is booked.
create or replace view public.speaker_returns as
  select speaker_id, max(coalesce(collection_date, return_date)) as return_date
  from public.rentals where returned_at is null group by speaker_id;

-- Renters can't update rentals directly (only admins can), so swaps go through
-- this function, which only touches the caller's own active rental.
create function public.request_swap(p_rental_id uuid, p_collection_date date) returns void
language plpgsql security definer set search_path = '' as $$
declare
  r public.rentals;
  tomorrow date := (now() at time zone 'Africa/Nairobi')::date + 1;
begin
  select * into r from public.rentals
  where id = p_rental_id and person_id = (select auth.uid()) and returned_at is null;
  if not found then
    raise exception 'No active rental to swap' using errcode = 'P0002';
  end if;
  if p_collection_date < tomorrow or p_collection_date > r.return_date then
    raise exception 'Collection day must be between tomorrow and the return date' using errcode = '22023';
  end if;
  update public.rentals set collection_date = p_collection_date where id = p_rental_id;
end $$;

revoke execute on function public.request_swap(uuid, date) from public, anon;
grant execute on function public.request_swap(uuid, date) to authenticated;
