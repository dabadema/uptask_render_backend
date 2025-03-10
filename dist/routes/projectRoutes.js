"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ProjectControllers_1 = require("../controllers/ProjectControllers");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, express_validator_1.body)('projectName').notEmpty().withMessage('Project´s name is mandatory'), (0, express_validator_1.body)('clientName').notEmpty().withMessage('Client´s name is mandatory'), (0, express_validator_1.body)('description').notEmpty().withMessage('Project´s description is mandatory'), validation_1.handleInputErrors, ProjectControllers_1.ProjectController.createProject);
router.get('/', ProjectControllers_1.ProjectController.getAllProjects);
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('ID not valid'), validation_1.handleInputErrors, ProjectControllers_1.ProjectController.getProjectById);
/** Routes for tasks */
router.param('projectId', project_1.projectExists);
router.put('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID not valid'), (0, express_validator_1.body)('projectName').notEmpty().withMessage('Project´s name is mandatory'), (0, express_validator_1.body)('clientName').notEmpty().withMessage('Client´s name is mandatory'), (0, express_validator_1.body)('description').notEmpty().withMessage('Project´s description is mandatory'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectControllers_1.ProjectController.updateProjectById);
router.delete('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID not valid'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectControllers_1.ProjectController.deleteProjectById);
router.post('/:projectId/tasks', task_1.hasAuthorization, (0, express_validator_1.body)('name').notEmpty().withMessage('Task´s name is mandatory'), (0, express_validator_1.body)('description').notEmpty().withMessage('Task´s description is mandatory'), validation_1.handleInputErrors, TaskController_1.TaskController.createTask);
router.get('/:projectId/tasks', TaskController_1.TaskController.getTasksByProjectId);
router.param('taskId', task_1.taskExists);
router.param('taskId', task_1.taskBelongsToProject);
router.get('/:projectId/tasks/:taskId', (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID not valid'), validation_1.handleInputErrors, TaskController_1.TaskController.getTaskById);
router.put('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID not valid'), (0, express_validator_1.body)('name').notEmpty().withMessage('Task´s name is mandatory'), (0, express_validator_1.body)('description').notEmpty().withMessage('Task´s description is mandatory'), validation_1.handleInputErrors, TaskController_1.TaskController.updateTaskById);
router.delete('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID not valid'), validation_1.handleInputErrors, TaskController_1.TaskController.deleteTaskById);
router.post('/:projectId/tasks/:taskId/status', (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID not valid'), (0, express_validator_1.body)('status').notEmpty().withMessage('Status is mandatory'), validation_1.handleInputErrors, TaskController_1.TaskController.updateTaskStatus);
/** Routes for teams */
router.post('/:projectId/team/find', (0, express_validator_1.body)('email').isEmail().toLowerCase().withMessage('Not valid email'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberById);
router.get('/:projectId/team', TeamController_1.TeamMemberController.getProjectTeam);
router.post('/:projectId/team', (0, express_validator_1.body)('_id').isMongoId().withMessage('Not valid ID'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId').isMongoId().withMessage('Not valid ID'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberById);
/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content').notEmpty().withMessage('Content of the note is mandatory'), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('Not valid ID'), validation_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map