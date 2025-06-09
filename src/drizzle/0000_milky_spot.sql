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
CREATE TABLE "itinerary_places" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer,
	"name" text,
	"address" text,
	"photo" text
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
CREATE TABLE "traffic_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer,
	"from_place_id" varchar(255) NOT NULL,
	"to_place_id" varchar(255) NOT NULL,
	"transport_mode" varchar(20) NOT NULL,
	"duration" integer NOT NULL,
	"distance" integer
);
