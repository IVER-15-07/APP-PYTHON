import { courseService } from '../services/course.service.js';

export const getCourse = async (req, res) => {
    try {
        const courses = await courseService.getCourse();
        res.status(200).json(courses); ({ success: true, data: courses });

    } catch (error) {
        console.error("getCourse error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
