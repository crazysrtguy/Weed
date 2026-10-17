-- High Stakes: schedules. Hourly: turn a finished league week into payout rows (idempotent). Every 5 minutes: wake the payout function.
-- The function takes no input and only pays rows the database created, so the trigger needs no secret.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

select cron.schedule('hs-settle-week','7 * * * *',$$select public.hs_settle_week()$$);
select cron.schedule('hs-payout','*/5 * * * *',$$select net.http_post(url:='https://xyvhtdrppvbhbudhjdiv.supabase.co/functions/v1/hs-payout',headers:='{"content-type":"application/json"}'::jsonb,body:='{}'::jsonb,timeout_milliseconds:=60000)$$);
