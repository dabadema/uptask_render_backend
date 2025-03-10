"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'UpTask <noreply@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirm your email',
            text: 'UpTask - Confirm your email',
            html: `<p>Hi ${user.name},</p> <p> Your account in UpTask has been created, everything is about to be ready, just waiting for your confirmation! </p>
            <p> Visit the following link to confirm your email: <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
            and introduce the code: <b>${user.token}</b> to complete the process.</p>
            <p> This token will expire in 10 minutes.</p>`,
        });
        console.log('Email sent', info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'UpTask <noreply@uptask.com>',
            to: user.email,
            subject: 'UpTask - Set a new password',
            text: `UpTask - Set a new password`,
            html: `<p>Hi ${user.name},</p> <p> You have requested to set a new password.</p> <p> Visit the following link: <a href="${process.env.FRONTEND_URL}/auth/new-password ">Set a new password</a>
            and introduce the code: <b>${user.token}</b> to complete the process.</p>
            <p> This token will expire in 10 minutes.</p>`,
        });
        console.log('Email sent', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map