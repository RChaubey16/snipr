import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1772128312399 implements MigrationInterface {
  name = 'InitialSchema1772128312399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '30 days'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url" ALTER COLUMN "expiresAt" SET DEFAULT (now() + '30 days')`,
    );
  }
}
