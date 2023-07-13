"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1689271624105 = void 0;
class Default1689271624105 {
    constructor() {
        this.name = 'Default1689271624105';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "solicitations" DROP COLUMN "method"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "solicitations" ADD "method" text NOT NULL`);
    }
}
exports.Default1689271624105 = Default1689271624105;
