"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const Token_1 = __importDefault(require("../models/Token"));
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            /** Preventing duplicate accounts */
            const userExists = await User_1.default.findOne({ email });
            if (userExists) {
                const error = new Error('User already exists');
                res.status(409).json({ error: error.message });
                return;
            }
            /** Creating a new user */
            const user = new User_1.default(req.body);
            /** Hashing password */
            user.password = await (0, auth_1.hashPassword)(password);
            /** Generating a token */
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.userId = user.id;
            /** Sending confirmation email */
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([token.save(), user.save()]);
            res.send('User account created, please check your email for confirmation');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Token not found');
                res.status(401).json({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExists.userId);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('Account confirmed successfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('User not found');
                res.status(404).json({ error: error.message });
                return;
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.userId = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });
                const error = new Error('User account has not been confirmed, please check your email for confirmation');
                res.status(401).json({ error: error.message });
                return;
            }
            //Checking if password is correct
            const isPasswordCorrect = await (0, auth_1.comparePassword)(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('Invalid password');
                res.status(401).json({ error: error.message });
                return;
            }
            const token = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            /** Does the user exists? */
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('User it is not registered');
                res.status(404).json({ error: error.message });
                return;
            }
            /** Is it already confirmed? */
            if (user.confirmed) {
                const error = new Error('User it is already confirmed');
                res.status(403).json({ error: error.message });
                return;
            }
            /** Generating a token */
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.userId = user.id;
            /** Sending confirmation email */
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            await Promise.allSettled([token.save(), user.save()]);
            res.send('New token was sent to your email.');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            /** Does the user exists? */
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('User it is not registered');
                res.status(404).json({ error: error.message });
                return;
            }
            /** Generating a token */
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.userId = user.id;
            await token.save();
            /** Sending confirmation email */
            await AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            res.send('Check your email for instructions');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Token not found');
                res.status(401).json({ error: error.message });
                return;
            }
            res.send('Token valid, set your new password');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Token not found');
                res.status(404).json({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExists.userId);
            user.password = await (0, auth_1.hashPassword)(password);
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('Password was modified succesfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static user = async (req, res) => {
        res.json(req.user);
        return;
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('That email is already registered');
            res.status(409).json({ error: error.message });
            return;
        }
        req.user.name = name;
        req.user.email = email;
        try {
            await req.user.save();
            res.send('Profile updated successfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.comparePassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Actual password is incorrect');
            res.status(401).json({ error: error.message });
            return;
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send('Password updated successfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map