-- Sample content: invented speakers and notes (Ember Monitor's from claude-design-prompt.md).
-- Run after migrations/0001_initial.sql. Safe to re-run: it replaces the sample rows.

delete from public.listening_notes where person_id is null;

insert into public.speakers (id, name, type, price_per_month, description, details, status, position) values
  ('ember-monitor', 'Ember Monitor', 'Bookshelf speaker, warm tuning', 18000,
   'A warm, forward-sounding bookshelf speaker. Voices sit in the room, and the bass stays full without overwhelming a small space.',
   '{"kind": "Two-way bookshelf", "tuning": "Warm", "size": "28 cm tall", "room": "Small to medium rooms", "connections": "Bluetooth and line-in"}',
   'available', 1),
  ('slate-tower', 'Slate Tower', 'Floor-standing, neutral tuning', 32000,
   'A three-way floor-standing speaker with deep, even bass. It needs a medium to large room and some space from the wall.',
   '{"kind": "Three-way floor-standing", "tuning": "Neutral", "size": "104 cm tall", "room": "Medium to large rooms", "connections": "Speaker wire, amplifier required"}',
   'available', 2),
  ('aria-studio', 'Aria Studio', 'Active monitor pair, bright and detailed', 24000,
   'Powered monitors with Bluetooth and an optical input. Plug in and listen. No separate amplifier needed.',
   '{"kind": "Active monitor pair", "tuning": "Bright and detailed", "size": "30 cm tall", "room": "Small to medium rooms", "connections": "Bluetooth, optical and RCA"}',
   'rented', 3),
  ('quill-compact', 'Quill Compact', 'Small-room speaker, forward midrange', 15000,
   'A compact two-way speaker with a forward midrange and a quiet, controlled treble. Voices come through clearly in rooms up to 20 m².',
   '{"kind": "Two-way compact", "tuning": "Forward midrange", "size": "24 cm tall", "room": "Small rooms", "connections": "Speaker wire, amplifier required"}',
   'available', 4),
  ('meridian-wide', 'Meridian Wide', 'Wide soundstage, relaxed tuning', 28000,
   'A warm, open midrange and a wide soundstage. A relaxed tuning for long evening sessions.',
   '{"kind": "Two-way stand-mount", "tuning": "Relaxed, wide soundstage", "size": "38 cm tall", "room": "Medium rooms", "connections": "Speaker wire, amplifier required"}',
   'rented', 5),
  ('lumen-stand', 'Lumen Stand', 'Slim stand-mount, balanced tuning', 21000,
   'A slim stand-mount with a balanced tuning. Detailed without leaning forward, and easy to place in a narrow room.',
   '{"kind": "Two-way stand-mount", "tuning": "Balanced", "size": "36 cm tall", "room": "Small to medium rooms", "connections": "Bluetooth and line-in"}',
   'available', 6)
on conflict (id) do update set
  name = excluded.name, type = excluded.type, price_per_month = excluded.price_per_month,
  description = excluded.description, details = excluded.details, status = excluded.status,
  position = excluded.position;

insert into public.listening_notes (speaker_id, author_name, author_area, stars, text, created_at) values
  ('ember-monitor', 'Wanjiru', 'Kilimani', 5, 'Played Sunday jazz and a lot of afrobeats. Vocals sit forward and nothing is harsh, even at night volume. In my small living room the bass was full without booming.', '2026-10-12 12:00+03'),
  ('ember-monitor', 'Brian', 'Westlands', 4, 'Great for long evenings. Keep it about 30 cm from the wall or the low end gets heavy. I would want more sparkle on strings.', '2026-09-28 12:00+03'),
  ('ember-monitor', 'Amina', 'Lavington', 4, 'Warm and forgiving with older recordings. Less exciting with electronic music. Easy to live with for a month.', '2026-09-03 12:00+03'),
  ('ember-monitor', 'Kevin', 'Karen', 5, 'Played benga and film scores. Clean and relaxed, and it never tired my ears.', '2026-08-20 12:00+03'),
  ('slate-tower', 'Aisha', null, 5, 'Deep, even bass with no boom in a large room. Orchestral recordings had real scale.', '2026-09-10 12:00+03'),
  ('slate-tower', 'Peter', null, 5, 'Needs space. At 60 cm from the back wall the bass tightened up a lot.', '2026-08-12 12:00+03'),
  ('aria-studio', 'Brian', null, 4, 'Easy setup with the TV over optical. Clear dialogue. The bass thins out above half volume.', '2026-09-30 12:00+03'),
  ('aria-studio', 'Mercy', null, 4, 'Bluetooth from my phone stayed stable across the room. Good for a desk or a small bedroom.', '2026-09-01 12:00+03'),
  ('aria-studio', 'Daniel', null, 5, 'No amplifier needed, which was the point for me. Warmer than I expected from powered speakers.', '2026-08-05 12:00+03'),
  ('quill-compact', 'Otieno', null, 4, 'Needs a good amplifier to come alive. Once matched, the stage is wide and quiet.', '2026-09-28 12:00+03'),
  ('quill-compact', 'Amina', null, 5, 'The most precise imaging I have heard at home. Less bass than I expected for jazz trios.', '2026-09-02 12:00+03'),
  ('meridian-wide', 'Njeri', null, 5, 'Long evenings with vocal records were the highlight. The midrange is warm without going soft. It filled my lounge easily.', '2026-09-23 12:00+03'),
  ('meridian-wide', 'Kevin', null, 5, 'Smooth treble, so loud rock never felt harsh. I wanted a little more bass punch for electronic music.', '2026-08-24 12:00+03'),
  ('meridian-wide', 'Faith', null, 4, 'Needs a decent amplifier. With a good one it sounded calm and detailed.', '2026-07-25 12:00+03');
