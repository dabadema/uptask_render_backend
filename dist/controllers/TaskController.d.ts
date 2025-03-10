import type { Request, Response } from 'express';
export declare class TaskController {
    static createTask: (req: Request, res: Response) => Promise<void>;
    static getTasksByProjectId: (req: Request, res: Response) => Promise<void>;
    static getTaskById: (req: Request, res: Response) => Promise<void>;
    static updateTaskById: (req: Request, res: Response) => Promise<void>;
    static deleteTaskById: (req: Request, res: Response) => Promise<void>;
    static updateTaskStatus: (req: Request, res: Response) => Promise<void>;
}
