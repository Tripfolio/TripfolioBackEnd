CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_preferences" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"on_register" boolean DEFAULT true NOT NULL,
	"on_login" boolean DEFAULT true NOT NULL,
	"on_loginfail" boolean DEFAULT true NOT NULL,
	"on_comment" boolean DEFAULT true NOT NULL,
	"on_bookmark" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itinerary_places" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer,
	"name" text,
	"address" text,
	"photo" text,
	"arrival_hour" integer,
	"arrival_minute" integer,
	"place_order" integer
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
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"gender" varchar(10),
	"phone" varchar(20),
	"email" varchar(100),
	"birthday" date,
	"password" varchar(100),
	"avatar" text
);
--> statement-breakpoint
<<<<<<<< HEAD:src/drizzle/0000_wandering_doctor_spectrum.sql
ALTER TABLE "email_preferences" ADD CONSTRAINT "email_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
========
ALTER TABLE "comments" ADD CONSTRAINT "comments_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
>>>>>>>> dev:src/drizzle/0000_boring_mandroid.sql
