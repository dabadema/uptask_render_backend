import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectControllers';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';

const router = Router();

router.use(authenticate);

router.post(
    '/',
    body('projectName').notEmpty().withMessage('Project´s name is mandatory'),
    body('clientName').notEmpty().withMessage('Client´s name is mandatory'),
    body('description').notEmpty().withMessage('Project´s description is mandatory'),
    handleInputErrors,
    ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);

router.get(
    '/:id',
    param('id').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    ProjectController.getProjectById
);

/** Routes for tasks */
router.param('projectId', projectExists);

router.put(
    '/:projectId',
    param('projectId').isMongoId().withMessage('ID not valid'),
    body('projectName').notEmpty().withMessage('Project´s name is mandatory'),
    body('clientName').notEmpty().withMessage('Client´s name is mandatory'),
    body('description').notEmpty().withMessage('Project´s description is mandatory'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProjectById
);

router.delete(
    '/:projectId',
    param('projectId').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProjectById
);

router.post(
    '/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('Task´s name is mandatory'),
    body('description').notEmpty().withMessage('Task´s description is mandatory'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getTasksByProjectId);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get(
    '/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put(
    '/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID not valid'),
    body('name').notEmpty().withMessage('Task´s name is mandatory'),
    body('description').notEmpty().withMessage('Task´s description is mandatory'),
    handleInputErrors,
    TaskController.updateTaskById
);

router.delete(
    '/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID not valid'),
    handleInputErrors,
    TaskController.deleteTaskById
);

router.post(
    '/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID not valid'),
    body('status').notEmpty().withMessage('Status is mandatory'),
    handleInputErrors,
    TaskController.updateTaskStatus
);

/** Routes for teams */

router.post(
    '/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Not valid email'),
    handleInputErrors,
    TeamMemberController.findMemberById
);

router.get('/:projectId/team', TeamMemberController.getProjectTeam);

router.post(
    '/:projectId/team',
    body('_id').isMongoId().withMessage('Not valid ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
);

router.delete(
    '/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('Not valid ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
);

/** Routes for Notes */

router.post(
    '/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('Content of the note is mandatory'),
    handleInputErrors,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

router.delete(
    '/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Not valid ID'),
    handleInputErrors,
    NoteController.deleteNote
);

export default router;
