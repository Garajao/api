"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const roleRepository_1 = require("../repositories/roleRepository");
class RoleController {
    /**
     * @swagger
     * /api/roles:
     *   get:
     *     summary: Get all roles
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Role'
     */
    async list(req, res) {
        const roles = await roleRepository_1.roleRepository.find({
            relations: {
                users: true,
            },
        });
        return res.json(roles);
    }
    /**
     * @swagger
     * /api/roles:
     *   post:
     *     summary: Create role
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               level:
     *                 type: number
     *             required:
     *               - name
     *               - level
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Role'
     */
    async create(req, res) {
        const { name, level } = req.body;
        if (!name)
            throw new api_errors_1.BadRequestError('O nome é obrigatório');
        if (!level)
            throw new api_errors_1.BadRequestError('O nível é obrigatório');
        const newRole = roleRepository_1.roleRepository.create({
            name,
            level,
        });
        await roleRepository_1.roleRepository.save(newRole);
        // return res.status(201).json({ id: newRole.id })
        return res.status(201).json(newRole);
    }
    /**
     * @swagger
     * /api/roles/{idRole}:
     *   put:
     *     summary: Update role
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idRole
     *         required: true
     *         schema:
     *           type: string
     *         description: Role ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               level:
     *                 type: number
     *             required:
     *               - name
     *               - level
     *     responses:
     *       204:
     *         description: No content
     */
    async update(req, res) {
        const { name, level } = req.body;
        const { idRole } = req.params;
        const role = await roleRepository_1.roleRepository.findOneBy({ id: idRole });
        if (!role)
            throw new api_errors_1.NotFoundError('O papel não existe');
        await roleRepository_1.roleRepository.update(idRole, {
            name,
            level,
        });
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/roles/{idRole}:
     *   delete:
     *     summary: Delete role
     *     tags:
     *       - Roles
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idRole
     *         required: true
     *         schema:
     *           type: string
     *         description: Role ID
     *     responses:
     *       204:
     *         description: No content
     */
    async delete(req, res) {
        const { idRole } = req.params;
        const role = await roleRepository_1.roleRepository.findOneBy({ id: idRole });
        if (!role)
            throw new api_errors_1.NotFoundError('O papel não existe');
        await roleRepository_1.roleRepository.delete(idRole);
        return res.status(204).send();
    }
}
exports.RoleController = RoleController;
