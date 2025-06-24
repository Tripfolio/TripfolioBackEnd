CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"member_id" integer,
	"content" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"on_register" boolean DEFAULT true NOT NULL,
	"on_login" boolean DEFAULT true NOT NULL,
	"on_loginfail" boolean DEFAULT true NOT NULL,
	"on_comment" boolean DEFAULT true NOT NULL,
	"on_bookmark" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "favorites_member_id_post_id_unique" UNIQUE("member_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"schedule_id" integer NOT NULL,
	"cover_url" varchar(2048),
	"content" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_places" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_id" integer,
	"name" varchar(100),
	"address" varchar(255),
	"photo" varchar(2048),
	"arrival_hour" integer,
	"arrival_minute" integer,
	"place_order" integer,
	"date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(20) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"description" varchar(500),
	"cover_url" varchar(2048),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trip_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" integer NOT NULL,
	"shared_with_user_id" integer NOT NULL,
	"shared_by_user_id" integer NOT NULL,
	"permission" varchar NOT NULL,
	"token" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "trip_shares_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(10) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"gender" varchar(10),
	"phone" varchar(20),
	"birthday" date,
	"avatar" varchar,
	"is_premium" boolean DEFAULT false,
	"created_at" timestamp (2) DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_trip_id_schedules_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_shared_with_user_id_users_id_fk" FOREIGN KEY ("shared_with_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_shared_by_user_id_users_id_fk" FOREIGN KEY ("shared_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;