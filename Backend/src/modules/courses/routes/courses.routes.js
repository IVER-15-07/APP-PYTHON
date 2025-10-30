import express from 'express';
import {  getMyCourses, createTopicWithResource, getAllTopics } from '../controllers/courses.Controller.js';
import multer from 'multer';
import { verifyToken } from '../../auth/middleware/auth.middleware.js';



const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/my-courses', getMyCourses);
router.post('/topic', verifyToken,upload.array('files'), createTopicWithResource);
router.get('/topics', getAllTopics);

export default router;
