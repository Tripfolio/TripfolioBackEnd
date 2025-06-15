CREATE TABLE "trip_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" uuid NOT NULL,
	"shared_with_user_id" uuid NOT NULL,
	"shared_by_user_id" uuid NOT NULL,
	"permission" text NOT NULL,
	"token" text NOT NULL,
	"created_time" timestamp DEFAULT now(),
	CONSTRAINT "trip_shares_token_unique" UNIQUE("token")
);
