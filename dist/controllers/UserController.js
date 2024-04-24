"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const gateRepository_1 = require("../repositories/gateRepository");
const roleRepository_1 = require("../repositories/roleRepository");
const api_errors_1 = require("../helpers/api-errors");
class UserController {
    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     tags:
     *       - Users
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
     *                 $ref: '#/components/schemas/User'
     */
    async list(req, res) {
        const users = await userRepository_1.userRepository.find({
            loadRelationIds: true,
        });
        return res.status(200).json(users);
    }
    /**
     * @swagger
     * /api/users:
     *   post:
     *     summary: Create a new user
     *     tags:
     *       - Users
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
     *               email:
     *                 type: string
     *               login:
     *                 type: string
     *               password:
     *                 type: string
     *               role_id:
     *                 type: string
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     */
    async create(req, res) {
        const { name, email, login, password, image, role_id } = req.body;
        if (!name)
            throw new api_errors_1.BadRequestError('O nome é obrigatório');
        if (!email)
            throw new api_errors_1.BadRequestError('O email é obrigatório');
        if (!login)
            throw new api_errors_1.BadRequestError('O login é obrigatório');
        if (!password)
            throw new api_errors_1.BadRequestError('A senha é obrigatória');
        if (!role_id)
            throw new api_errors_1.BadRequestError('O papel é obrigatório');
        const loginExists = await userRepository_1.userRepository.findOneBy({ login });
        if (loginExists)
            throw new api_errors_1.BadRequestError('O login já existe');
        const emailExists = await userRepository_1.userRepository.findOneBy({ email });
        if (emailExists)
            throw new api_errors_1.BadRequestError('O email já existe');
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const role = await roleRepository_1.roleRepository.findOneBy({ id: role_id });
        if (!role)
            throw new api_errors_1.NotFoundError('O papel não existe');
        const newUser = userRepository_1.userRepository.create({
            name,
            email,
            login,
            password: hashPassword,
            active: true,
            image,
            role,
        });
        await userRepository_1.userRepository.save(newUser);
        return res.status(201).json({ id: newUser.id });
    }
    /**
     * @swagger
     * /api/users/{idUser}:
     *   put:
     *     summary: Update user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idUser
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               active:
     *                 type: boolean
     *               image:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    async update(req, res) {
        const { name, email, active, image, role_id } = req.body;
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('O usuário não existe');
        const role = await roleRepository_1.roleRepository.findOneBy({ id: role_id });
        if (!role)
            throw new api_errors_1.NotFoundError('O papel não existe');
        await userRepository_1.userRepository.update(idUser, {
            name,
            email,
            active,
            image,
            role,
        });
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/users/{idUser}:
     *   delete:
     *     summary: Delete user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idUser
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: No Content
     */
    async delete(req, res) {
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('O usuário não existe');
        await userRepository_1.userRepository.delete(idUser);
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/users/profile:
     *   get:
     *     summary: Get user profile
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    async profile(req, res) {
        return res.status(200).json(req.user);
    }
    /**
     * @swagger
     * /api/users/{idUser}/gate:
     *   post:
     *     summary: Add gate to user
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idUser
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               gate_id:
     *                 type: string
     *     responses:
     *       204:
     *         description: No Content
     */
    async userGate(req, res) {
        const { gate_id } = req.body;
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOne({
            relations: { gates: true },
            where: { id: idUser },
        });
        if (!user)
            throw new api_errors_1.NotFoundError('O usuário não existe');
        if (!gate_id)
            throw new api_errors_1.BadRequestError('O portão é obrigatório');
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: gate_id });
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        const checkRelations = user.gates.find((user_gate) => user_gate.id === gate.id);
        if (checkRelations)
            throw new api_errors_1.BadRequestError('O portão já está relacionado ao usuário');
        const userUpdate = {
            ...user,
            gates: [...user.gates, gate],
        };
        await userRepository_1.userRepository.save(userUpdate);
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/users/signIn:
     *   post:
     *     summary: Sign in
     *     tags:
     *       - Authorization
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               login:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     */
    async signIn(req, res) {
        var _a, _b;
        const { login, password } = req.body;
        if (!login)
            throw new api_errors_1.BadRequestError('O login é obrigatório');
        if (!password)
            throw new api_errors_1.BadRequestError('A senha é obrigatória');
        const user = await userRepository_1.userRepository.findOne({
            relations: { devices: true },
            where: { login },
        });
        if (!user)
            throw new api_errors_1.BadRequestError('Usuário ou senha incorretos');
        if (!user.active)
            throw new api_errors_1.ForbiddenError('Usuário inativo');
        const checkPassword = await bcrypt_1.default.compare(password, user.password);
        if (!checkPassword)
            throw new api_errors_1.BadRequestError('Usuário ou senha incorretos');
        const token = jsonwebtoken_1.default.sign({ user_id: user.id }, (_a = process.env.JWT_PASS) !== null && _a !== void 0 ? _a : '', {
            expiresIn: (_b = process.env.JWT_EXPIRES_IN) !== null && _b !== void 0 ? _b : '30d',
        });
        await userRepository_1.userRepository.update(user.id, {
            last_login: new Date().toISOString(),
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userLogin } = user;
        return res.status(200).json({
            user: userLogin,
            token,
        });
    }
    /**
     * @swagger
     * /api/users/signOut:
     *   post:
     *     summary: Sign out
     *     tags:
     *       - Authorization
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    async signOut(req, res) {
        // const { login, password } = req.body
        return res.status(200).json({
            message: 'Logout realizado com sucesso',
        });
    }
}
exports.UserController = UserController;
