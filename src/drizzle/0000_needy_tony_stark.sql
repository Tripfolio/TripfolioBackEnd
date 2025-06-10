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
	"avatar" text,
	"google_id" varchar(100),
	"created_at" timestamp DEFAULT now()
);
