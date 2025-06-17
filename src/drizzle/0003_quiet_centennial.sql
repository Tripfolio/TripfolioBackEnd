CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"on_register" boolean DEFAULT true NOT NULL,
	"on_login" boolean DEFAULT true NOT NULL,
	"on_loginfail" boolean DEFAULT true NOT NULL,
	"on_verify" boolean DEFAULT true NOT NULL,
	"on_comment" boolean DEFAULT true NOT NULL,
	"on_like" boolean DEFAULT true NOT NULL,
	"on_bookmark" boolean DEFAULT true NOT NULL,
	"on_share" boolean DEFAULT true NOT NULL,
	"on_customer_reply" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"created_at" timestamp (2) DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	"cover_url" text,
	"content" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"title" varchar(20) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"description" text,
	"cover_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;