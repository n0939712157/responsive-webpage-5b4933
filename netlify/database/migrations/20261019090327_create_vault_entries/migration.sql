CREATE TABLE "entries" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"kind" text NOT NULL,
	"category" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"steps" text DEFAULT '[]' NOT NULL,
	"script" text DEFAULT '' NOT NULL,
	"favorite" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
