import { courseRepository } from "../repositories/course.repository.js";


export const courseService = {

  async getCourse() {
    return await courseRepository.findAll();
  },




};