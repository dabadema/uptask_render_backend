"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const Task_1 = __importDefault(require("../models/Task"));
class TaskController {
    static createTask = async (req, res) => {
        try {
            const task = new Task_1.default(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]);
            res.send('Task created properly');
        }
        catch (error) {
            res.status(500).json({ error: 'Task not created' });
        }
    };
    static getTasksByProjectId = async (req, res) => {
        try {
            const tasks = await Task_1.default.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: 'Tasks not found' });
        }
    };
    static getTaskById = async (req, res) => {
        try {
            const task = await Task_1.default.findById(req.task.id)
                .populate({
                path: 'completedBy.user',
                select: 'id name email',
            })
                .populate({
                path: 'notes',
                populate: { path: 'createdBy', select: 'id name email' },
            });
            res.json(task);
        }
        catch (error) {
            res.status(500).json({ error: 'Task not found' });
        }
    };
    static updateTaskById = async (req, res) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save();
            res.send('Task updated properly');
        }
        catch (error) {
            res.status(500).json({ error: 'Task not updated' });
        }
    };
    static deleteTaskById = async (req, res) => {
        try {
            req.project.tasks = req.project.tasks.filter((task) => task.id.toString() !== req.task.id.toString());
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
            res.send('Task deleted properly');
        }
        catch (error) {
            res.status(500).json({ error: 'Task not deleted' });
        }
    };
    static updateTaskStatus = async (req, res) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user.id,
                status,
            };
            req.task.completedBy.push(data);
            await req.task.save();
            res.send('Task status updated properly');
        }
        catch (error) {
            res.status(500).json({ error: 'Task status not updated' });
        }
    };
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map