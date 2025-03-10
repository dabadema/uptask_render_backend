"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectExists = projectExists;
const Project_1 = __importDefault(require("../models/Project"));
async function projectExists(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await Project_1.default.findById(projectId);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        req.project = project;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Project Id format not valid' });
        return;
    }
}
//# sourceMappingURL=project.js.map