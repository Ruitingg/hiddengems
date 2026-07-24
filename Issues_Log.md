# HiddenGems — Issues Log

### 22 Jul 2026 — Slot release function missing
Found while working on: Availability & Slots
What happened: release_due_slot_batches() function referenced by the cron job did not exist in the database, so batches never left "pending_release" status.
Fix: Created the function to update both slot_batches.status and availability.status for all batches past their release_time. Verified manually via SQL and confirmed cron job now succeeds.
Commit: fix: recreate release_due_slot_batches function

### 22 Jul 2026 — Release time saved in wrong timezone
Found while working on: Step 1, Availability & Slots (discovered while app-testing the release function fix)
What happened: The "Release slots at" datetime-local input value was passed to Supabase as a raw string with no timezone offset, causing it to be stored ~8 hours ahead of the intended SGT time (interpreted as UTC).
Fix: Convert to a proper Date object and call .toISOString() before sending to Supabase, in CalendarManagementPage.jsx's handleCreateBatch.
Commit: fix: convert release time to UTC before saving batch