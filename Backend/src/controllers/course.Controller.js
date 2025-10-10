
import { courseService } from "../services/course.service.js";

export async function createCourse(req, res, next) {
  try {
    const profesorId = req.user.id;
    const newCourse = await courseService.createCourse(profesorId, req.body);
    return res.status(201).json({ success: true, data: newCourse });
  } catch (err) {
    next(err);
  }
}

export async function getMyCourses(req, res, next) {
  try {
    const profesorId = req.user.id;
    const courses = await courseService.getCoursesByProfesor(profesorId);
    return res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
}

