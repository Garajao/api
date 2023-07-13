"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1689270541047 = void 0;
class Default1689270541047 {
    constructor() {
        this.name = 'Default1689270541047';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "solicitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" boolean NOT NULL DEFAULT false, "method" text NOT NULL, "code" text, "valid" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "gate_id" uuid NOT NULL, "user_id" uuid, "message_id" integer NOT NULL, CONSTRAINT "PK_53503efa9bcfa87b80700677e88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "open" boolean NOT NULL DEFAULT false, "provisional_open" boolean NOT NULL DEFAULT false, "cep" text NOT NULL, "address" text NOT NULL, "complement" text, "number" integer NOT NULL, "city" text NOT NULL, "uf" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2dd58a77462dd2c5695ec4a7975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "level" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "login" text NOT NULL, "password" text NOT NULL, "active" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_gate" ("gate_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_196ace51c21e5c218fc5bc6f09d" PRIMARY KEY ("gate_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0ccb03b8a09cb62cf09d349d1" ON "user_gate" ("gate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f2ee719bfb08f6f5840d8a474" ON "user_gate" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "solicitations" ADD CONSTRAINT "FK_d4574b28bbf87cfdbadd1196b10" FOREIGN KEY ("gate_id") REFERENCES "gates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solicitations" ADD CONSTRAINT "FK_e8d8a0d0fc8fe6e0c11d290b414" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "solicitations" ADD CONSTRAINT "FK_4ecdfd4a2dfe5ad6797628e8388" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_gate" ADD CONSTRAINT "FK_c0ccb03b8a09cb62cf09d349d13" FOREIGN KEY ("gate_id") REFERENCES "gates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_gate" ADD CONSTRAINT "FK_8f2ee719bfb08f6f5840d8a4745" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_gate" DROP CONSTRAINT "FK_8f2ee719bfb08f6f5840d8a4745"`);
        await queryRunner.query(`ALTER TABLE "user_gate" DROP CONSTRAINT "FK_c0ccb03b8a09cb62cf09d349d13"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "solicitations" DROP CONSTRAINT "FK_4ecdfd4a2dfe5ad6797628e8388"`);
        await queryRunner.query(`ALTER TABLE "solicitations" DROP CONSTRAINT "FK_e8d8a0d0fc8fe6e0c11d290b414"`);
        await queryRunner.query(`ALTER TABLE "solicitations" DROP CONSTRAINT "FK_d4574b28bbf87cfdbadd1196b10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f2ee719bfb08f6f5840d8a474"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0ccb03b8a09cb62cf09d349d1"`);
        await queryRunner.query(`DROP TABLE "user_gate"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "gates"`);
        await queryRunner.query(`DROP TABLE "solicitations"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }
}
exports.Default1689270541047 = Default1689270541047;
