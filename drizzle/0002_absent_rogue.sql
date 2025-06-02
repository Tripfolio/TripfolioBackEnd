ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp (2);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();