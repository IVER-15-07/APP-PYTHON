import express from 'express';
import { 
    getMyCourses, 
    createTopicWithResource, 
    getAllTopics, 
    getTopicTypes, 
    getLevels,
    updateCourse,
    updateTopic

} from '../controllers/courses.Controller.js';
import multer from 'multer';
//import { verifyToken } from '../../auth/middleware/auth.middleware.js';



const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/my-courses', getMyCourses);
router.post('/topic',  upload.array('files'), createTopicWithResource);
router.get('/topics', getAllTopics);
router.get('/topic-types', getTopicTypes);
router.get('/levels', getLevels);
router.put('/course/:id',updateCourse);
router.put('/topic/:id', upload.array('updatedFiles'), updateTopic);


export default router;
