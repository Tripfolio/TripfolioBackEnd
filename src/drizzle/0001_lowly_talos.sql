CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "favorites_member_id_post_id_unique" UNIQUE("member_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "post_id" integer NOT NULL;