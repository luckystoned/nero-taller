-- Enable Row Level Security for public domain tables.
-- No public policies are created because domain data is accessed server-side via Prisma.

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."vehicles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."work_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."work_order_status_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."quotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."quote_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."approvals" ENABLE ROW LEVEL SECURITY;
