CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

CREATE TABLE "Values" (
    "Id" serial NOT NULL,
    "Name" text NULL,
    CONSTRAINT "PK_Values" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20180921053617_InitialScript', '2.2.4-servicing-10062');

CREATE TABLE "Users" (
    "Id" serial NOT NULL,
    "Name" text NULL,
    "Password" bytea NULL,
    "PasswordSalt" bytea NULL,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20180928055946_AddedUserEntity', '2.2.4-servicing-10062');

ALTER TABLE "Users" RENAME COLUMN "Password" TO "PasswordHash";

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20180928064957_UserPasswordColumnNameRenamed', '2.2.4-servicing-10062');

ALTER TABLE "Users" RENAME COLUMN "Name" TO "Username";

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20180930060506_UserEntityUpdated', '2.2.4-servicing-10062');

ALTER TABLE "Users" ADD "City" text NULL;

ALTER TABLE "Users" ADD "Country" text NULL;

ALTER TABLE "Users" ADD "Created" timestamp without time zone NOT NULL DEFAULT TIMESTAMP '0001-01-01 00:00:00';

ALTER TABLE "Users" ADD "DateOfBirth" timestamp without time zone NOT NULL DEFAULT TIMESTAMP '0001-01-01 00:00:00';

ALTER TABLE "Users" ADD "Gender" text NULL;

ALTER TABLE "Users" ADD "Interests" text NULL;

ALTER TABLE "Users" ADD "Introduction" text NULL;

ALTER TABLE "Users" ADD "KnownAs" text NULL;

ALTER TABLE "Users" ADD "LastActive" timestamp without time zone NOT NULL DEFAULT TIMESTAMP '0001-01-01 00:00:00';

ALTER TABLE "Users" ADD "LookingFor" text NULL;

CREATE TABLE "Photos" (
    "Id" serial NOT NULL,
    "Url" text NULL,
    "Description" text NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "IsMain" boolean NOT NULL,
    "UserId" integer NOT NULL,
    CONSTRAINT "PK_Photos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Photos_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Photos_UserId" ON "Photos" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20181130184912_ExtendedUserModel', '2.2.4-servicing-10062');

ALTER TABLE "Photos" ADD "PublicId" text NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20190212143941_AddedPublicIDColumnInPhotoTable', '2.2.4-servicing-10062');

CREATE TABLE "Likes" (
    "LikerId" integer NOT NULL,
    "LikeeId" integer NOT NULL,
    CONSTRAINT "PK_Likes" PRIMARY KEY ("LikerId", "LikeeId"),
    CONSTRAINT "FK_Likes_Users_LikeeId" FOREIGN KEY ("LikeeId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Likes_Users_LikerId" FOREIGN KEY ("LikerId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_Likes_LikeeId" ON "Likes" ("LikeeId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20190524151504_UserLikeFunctionalityAdded', '2.2.4-servicing-10062');

CREATE TABLE "Messages" (
    "Id" serial NOT NULL,
    "SenderId" integer NOT NULL,
    "RecipientId" integer NOT NULL,
    "Content" text NULL,
    "IsRead" boolean NOT NULL,
    "DateRead" timestamp without time zone NULL,
    "MessageSent" timestamp without time zone NOT NULL,
    "SenderDeleted" boolean NOT NULL,
    "RecipientDeleted" boolean NOT NULL,
    CONSTRAINT "PK_Messages" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Messages_Users_RecipientId" FOREIGN KEY ("RecipientId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Messages_Users_SenderId" FOREIGN KEY ("SenderId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_Messages_RecipientId" ON "Messages" ("RecipientId");

CREATE INDEX "IX_Messages_SenderId" ON "Messages" ("SenderId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20190607062340_MessagesTableAdded', '2.2.4-servicing-10062');

