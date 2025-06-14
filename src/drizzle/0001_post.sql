CREATE TABLE "community_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	"cover_url" text,
	"content" text,
	"created_at" timestamp DEFAULT now()
);
