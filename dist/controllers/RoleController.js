"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const roleRepository_1 = require("../repositories/roleRepository");
class RoleController {
    async list(req, res) {
        const roles = await roleRepository_1.roleRepository.find({
            relations: {
                users: true,
            },
        });
        return res.json(roles);
    }
    async create(req, res) {
        const { name, level } = req.body;
        if (!name)
            throw new api_errors_1.BadRequestError('Name is required');
        if (!level)
            throw new api_errors_1.BadRequestError('Level is required');
        const newRole = roleRepository_1.roleRepository.create({
            name,
            level,
        });
        await roleRepository_1.roleRepository.save(newRole);
        // return res.status(201).json({ id: newRole.id })
        return res.status(201).json(newRole);
    }
    async update(req, res) {
        const { name, level } = req.body;
        const { idRole } = req.params;
        const role = await roleRepository_1.roleRepository.findOneBy({ id: idRole });
        if (!role)
            throw new api_errors_1.NotFoundError('The role does not exist');
        await roleRepository_1.roleRepository.update(idRole, {
            name,
            level,
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idRole } = req.params;
        const role = await roleRepository_1.roleRepository.findOneBy({ id: idRole });
        if (!role)
            throw new api_errors_1.NotFoundError('The role does not exist');
        await roleRepository_1.roleRepository.delete(idRole);
        return res.status(204).send();
    }
}
exports.RoleController = RoleController;
