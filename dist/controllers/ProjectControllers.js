"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        const project = new Project_1.default(req.body);
        // Asigning project manager
        project.manager = req.user.id;
        console.log(req.user);
        try {
            await project.save();
            res.send('Project created properly');
        }
        catch (error) {
            res.status(500).json({ error: 'Project not created' });
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                //Conditional to just bring projects which the user is manager
                $or: [{ manager: { $in: req.user.id } }, { team: { $in: req.user.id } }],
            });
            res.json(projects);
            return;
        }
        catch (error) {
            res.status(500).json({ error: 'Projects not found' });
            return;
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id).populate('tasks');
            if (!project) {
                const error = new Error('Project not found');
                res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user.id.toString() &&
                !project.team.includes(req.user.id)) {
                const error = new Error('Not valid action');
                res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            res.status(500).json({ error: 'Project not found' });
        }
    };
    static updateProjectById = async (req, res) => {
        try {
            req.project.clientName = req.body.clientName;
            req.project.projectName = req.body.projectName;
            req.project.description = req.body.description;
            await req.project.save();
            res.send('Project updated');
        }
        catch (error) {
            res.status(500).json({ error: 'Project not updated' });
        }
    };
    static deleteProjectById = async (req, res) => {
        try {
            await req.project.deleteOne();
            res.send('Project deleted');
        }
        catch (error) {
            res.status(500).json({ error: 'Project not deleted' });
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectControllers.js.map