# HiddenGems — Issues Log

### 22 Jul 2026 — Slot release function missing
Found while working on: Availability & Slots
What happened: release_due_slot_batches() function referenced by the cron job did not exist in the database, so batches never left "pending_release" status.
Fix: Created the function to update both slot_batches.status and availability.status for all batches past their release_time. Verified manually via SQL and confirmed cron job now succeeds.
Commit: fix: recreate release_due_slot_batches function

### 22 Jul 2026 — Release time saved in wrong timezone
Found while working on: Availability & Slots (discovered while app-testing the release function fix)
What happened: The "Release slots at" datetime-local input value was passed to Supabase as a raw string with no timezone offset, causing it to be stored ~8 hours ahead of the intended SGT time (interpreted as UTC).
Fix: Convert to a proper Date object and call .toISOString() before sending to Supabase, in CalendarManagementPage.jsx's handleCreateBatch.
Commit: fix: convert release time to UTC before saving batch

### 22 Jul 2026 — Past dates and invalid release times allowed in batch creation
Found while working on: Availability & Slots
What happened: The batch creation form allowed slot dates/times in the past, and allowed "release slots at" to be set after the slot date/time itself, both of which should be blocked.
Fix: Added validation in handleCreateBatch to reject past slot dates and release times set after the earliest slot. Confirmed via three test cases (past date blocked, release-after-slot blocked, valid case still works).
Commit: fix: block past dates and invalid release times in batch form

### 23 Jul 2026 — Awaiting Payment amount showed $0, chain of bugs
Found while working on: In-App Ordering Flow
What happened: "amount not shown" had five separate bugs:
1) order creation never set final_price for Fixed Price orders
2) OrderStatusPage.jsx and PaymentPage.jsx both referenced a missing quoted_price column
3) AvailabilityCalendar.jsx's date/time buttons lacked type="button", causing the order form to auto-submit and create duplicate/incomplete test orders
4) missing foreign key from orders.hbb_id to hbb_profiles caused PaymentPage.jsx's joined query to fail with a PostgREST relationship error, showing "Order not found" for valid orders
5) usePayment.js's simulatePayment referenced a nonexistent paid_at column, causing "Payment could not be processed" on a genuinely valid order.

Fix: Set final_price at order creation in useOrderForm.js; corrected both display files to use final_price; added type="button" to calendar buttons; added the missing orders_hbb_id_fkey foreign key constraint; corrected usePayment.js to use updated_at.
Commit: fix: set final_price on order creation for fixed pricing
Commit: fix: display order amount using final_price column
Commit: fix: prevent order form auto-submit on slot selection
Commit: fix: use updated_at instead of nonexistent paid_at column

### 23 Jul 2026 — Owner dashboard showed blank quote amount and wrong Gem Points
Found while working on: In-App Ordering Flow (owner dashboard)
What happened: OrderDashboardPage.jsx referenced the same missing quoted_price column found earlier in the customer-facing files. Caused "Quoted: $" to load with no amount on the Awaiting Payment tab, and , caused Gem Points to be calculated from the product's list price instead of the actual final_price when an order was marked completed.
Fix: Swapped both references from order.quoted_price to order.final_price.
Commit: fix: use final_price instead of nonexistent quoted_price in dashboard