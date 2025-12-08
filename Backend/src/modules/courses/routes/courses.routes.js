import express from 'express';
import { 
    getMyCourses, 
    createTopicWithResource, 
    getAllTopics, 
    getTopicTypes, 
    getLevels,
    updateCourse,
    updateTopic,
    getTopicForStudent,
    getTopicsByCreator,
    getCoursesWithStudentCount,
    getCourseWithStudentCount

} from '../controllers/courses.Controller.js';
import multer from 'multer';
import { verifyToken } from '../../auth/middleware/auth.middleware.js';



const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/my-courses', getMyCourses);
router.get('/courses-with-students', verifyToken, getCoursesWithStudentCount);
router.get('/course/:cursoId/students', verifyToken, getCourseWithStudentCount);
router.post('/topic', verifyToken, upload.array('files'), createTopicWithResource);
router.get('/topics', getAllTopics);
router.get('/topics/creator/:creatorId', getTopicsByCreator);

router.get('/topic-types', getTopicTypes);
router.get('/levels', getLevels);
router.put('/course/:id', verifyToken, updateCourse);
router.put('/topic/:id', verifyToken, upload.array('files'), updateTopic);
router.get('/topic/:id/student', getTopicForStudent);


export default router;
