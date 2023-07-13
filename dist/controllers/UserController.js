"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userRepository_1 = require("../repositories/userRepository");
const gateRepository_1 = require("../repositories/gateRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_errors_1 = require("../helpers/api-errors");
const roleRepository_1 = require("../repositories/roleRepository");
class UserController {
    async list(req, res) {
        const users = await userRepository_1.userRepository.find({
            loadRelationIds: true
        });
        return res.status(200).json(users);
    }
    async create(req, res) {
        const { name, email, login, password, role_id } = req.body;
        if (!name)
            throw new api_errors_1.BadRequestError('Name is required');
        if (!email)
            throw new api_errors_1.BadRequestError('Email is required');
        if (!login)
            throw new api_errors_1.BadRequestError('Login is required');
        if (!password)
            throw new api_errors_1.BadRequestError('Password is required');
        if (!role_id)
            throw new api_errors_1.BadRequestError('Role is required');
        const loginExists = await userRepository_1.userRepository.findOneBy({ login });
        if (loginExists)
            throw new api_errors_1.BadRequestError('User login already exists');
        const emailExists = await userRepository_1.userRepository.findOneBy({ email });
        if (emailExists)
            throw new api_errors_1.BadRequestError('User email already existse');
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const role = await roleRepository_1.roleRepository.findOneBy({ id: role_id });
        if (!role)
            throw new api_errors_1.NotFoundError('The role does not exist');
        const newUser = userRepository_1.userRepository.create({
            name, email, login, password: hashPassword, active: true, role
        });
        await userRepository_1.userRepository.save(newUser);
        return res.status(201).json({ id: newUser.id });
    }
    async update(req, res) {
        const { name, email, active, role_id } = req.body;
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('The user does not exist');
        const role = await roleRepository_1.roleRepository.findOneBy({ id: role_id });
        if (!role)
            throw new api_errors_1.NotFoundError('The role does not exist');
        await userRepository_1.userRepository.update(idUser, {
            name, email, active, role
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('The user does not exist');
        await userRepository_1.userRepository.delete(idUser);
        return res.status(204).send();
    }
    async profile(req, res) {
        return res.status(200).json(req.user);
    }
    async userGate(req, res) {
        const { gate_id } = req.body;
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOne({ relations: { gates: true }, where: { id: idUser } });
        if (!user)
            throw new api_errors_1.NotFoundError('The user does not exist');
        if (!gate_id)
            throw new api_errors_1.BadRequestError('Gate is required');
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: gate_id });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        const checkRelations = user.gates.find(user_gate => user_gate.id == gate.id);
        if (checkRelations)
            throw new api_errors_1.BadRequestError('The gate has already been linked to the user');
        const userUpdate = {
            ...user,
            gates: [...user.gates, gate]
        };
        await userRepository_1.userRepository.save(userUpdate);
        return res.status(204).send();
    }
    async login(req, res) {
        var _a;
        const { login, password } = req.body;
        if (!login)
            throw new api_errors_1.BadRequestError('Login is required');
        if (!password)
            throw new api_errors_1.BadRequestError('Password is required');
        const user = await userRepository_1.userRepository.findOne({ loadRelationIds: true, where: { login } });
        if (!user) {
            throw new api_errors_1.BadRequestError('Incorrect username or password');
        }
        if (!user.active) {
            throw new api_errors_1.ForbiddenError('Inactive user');
        }
        const checkPassword = await bcrypt_1.default.compare(password, user.password);
        if (!checkPassword) {
            throw new api_errors_1.BadRequestError('Incorrect username or password');
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user.id }, (_a = process.env.JWT_PASS) !== null && _a !== void 0 ? _a : '', { expiresIn: '100y' });
        const { password: _, ...userLogin } = user;
        return res.status(200).json({
            user: userLogin,
            token
        });
    }
}
exports.UserController = UserController;
