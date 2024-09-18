import { Request, Response } from 'express';

export default class StudentController {
    async login(req: Request, res: Response) {
        // const data = handleValidationResult(
        //     res,
        //     StudentLoginSchema.validate(req.body)
        // );
        // if (!data) return res.end();
        // const { student, error } =
        //     await studentService.findStudentByEmailAndPassword({
        //         email: data.email,
        //         password: data.password,
        //     });
        // if (error) {
        //     return res.status(400).send({
        //         success: false,
        //         message: error.message,
        //     });
        // }
    }
    async register(req: Request, res: Response) {}
}
