import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1772128312400 implements MigrationInterface {
  name = 'CreateSchema1772128312400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create User table
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id"       UUID              NOT NULL DEFAULT uuid_generate_v4(),
        "email"    CHARACTER VARYING NOT NULL,
        "googleId" CHARACTER VARYING,
        "name"     CHARACTER VARYING,
        "avatar"   CHARACTER VARYING,
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )
    `);

    // Create Url table
    await queryRunner.query(`
      CREATE TABLE "url" (
        "id"               SERIAL                   NOT NULL,
        "longUrl"          CHARACTER VARYING         NOT NULL,
        "shortCode"        CHARACTER VARYING         NOT NULL,
        "clickCount"       INTEGER                   NOT NULL DEFAULT 0,
        "createdAt"        TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT now(),
        "expiresAt"        TIMESTAMP                 NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
        "userId"           UUID,
        "dailyClickCount"  INTEGER                   NOT NULL DEFAULT 0,
        "weeklyClickCount" INTEGER                   NOT NULL DEFAULT 0,
        CONSTRAINT "UQ_url_shortCode" UNIQUE ("shortCode"),
        CONSTRAINT "PK_url" PRIMARY KEY ("id")
      )
    `);

    // Create Click table
    await queryRunner.query(`
      CREATE TABLE "click" (
        "id"        SERIAL                  NOT NULL,
        "urlId"     INTEGER                 NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_click" PRIMARY KEY ("id")
      )
    `);

    // Foreign key: url.userId → user.id
    await queryRunner.query(`
      ALTER TABLE "url"
        ADD CONSTRAINT "FK_url_user"
        FOREIGN KEY ("userId")
        REFERENCES "user"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    `);

    // Foreign key: click.urlId → url.id (CASCADE on delete)
    await queryRunner.query(`
      ALTER TABLE "click"
        ADD CONSTRAINT "FK_click_url"
        FOREIGN KEY ("urlId")
        REFERENCES "url"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "click" DROP CONSTRAINT "FK_click_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "url"   DROP CONSTRAINT "FK_url_user"`,
    );
    await queryRunner.query(`DROP TABLE "click"`);
    await queryRunner.query(`DROP TABLE "url"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
