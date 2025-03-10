import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post(
    '/create-account',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('password_confirmation').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not matching');
            }
            return true;
        }),
        body('name').notEmpty().withMessage('Name is required'),
    ],
    handleInputErrors,
    AuthController.createAccount
);

router.post(
    '/confirm-account',
    body('token')
        .notEmpty()
        .withMessage('Token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('Must be exactly 6 characters'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    handleInputErrors,
    AuthController.login
);

router.post(
    '/request-code',
    [body('email').isEmail().withMessage('Invalid email')],
    handleInputErrors,
    AuthController.requestConfirmationCode
);

router.post(
    '/forgot-password',
    [body('email').isEmail().withMessage('Invalid email')],
    handleInputErrors,
    AuthController.forgotPassword
);

router.post(
    '/validate-token',
    body('token')
        .notEmpty()
        .withMessage('Token is required')
        .isLength({ min: 6, max: 6 })
        .withMessage('Must be exactly 6 characters'),
    handleInputErrors,
    AuthController.validateToken
);

router.post(
    '/update-password/:token',
    param('token').isNumeric().withMessage('Token not valid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords are not matching');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
);

router.get('/user', authenticate, AuthController.user);

/** Profile */

router.put(
    '/profile',
    authenticate,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.updateProfile
);

router.post(
    '/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage('Actual password cannot be empty'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords are not matching');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);

export default router;
