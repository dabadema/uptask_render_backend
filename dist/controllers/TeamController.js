"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
class TeamMemberController {
    static findMemberById = async (req, res) => {
        const { email } = req.body;
        //Find user
        const user = await User_1.default.findOne({ email }).select('_id name email');
        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return;
        }
        res.json(user);
    };
    static getProjectTeam = async (req, res) => {
        const project = await Project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name',
        });
        res.json(project.team);
    };
    static addMemberById = async (req, res) => {
        const { _id } = req.body;
        // Find user
        const user = await User_1.default.findById({ _id }).select('_id');
        if (!user) {
            const error = new Error('User not found');
            res.status(409).json({ error: error.message });
            return;
        }
        // Adding user to the team
        if (req.project.team.some((team) => team.toString() === user.id.toString())) {
            const error = new Error('User already exists in the project');
            res.status(404).json({ error: error.message });
            return;
        }
        req.project.team.push(user.id);
        await req.project.save();
        res.send('User added successfully');
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        if (!req.project.team.some((team) => team.toString() === userId.toString())) {
            const error = new Error('User does not exist in the project');
            res.status(404).json({ error: error.message });
            return;
        }
        req.project.team = req.project.team.filter((teamMember) => teamMember.toString() !== userId);
        await req.project.save();
        res.send('User removed successfully');
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map