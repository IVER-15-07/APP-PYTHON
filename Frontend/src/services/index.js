// Centralized services export
// Import from: import { authService, coursesService, ... } from '@/services'

export { authService } from '../../services/auth.api.js';
export { firebaseAuthService } from '../../services/firebase.api.js';
export { coursesService } from '../../services/courses.api.js';
export { topicsService } from '../../services/topic.api.js';
export { adminService } from '../../services/admin.api.js';
export { teacherService } from '../../services/teacher.api.js';
export { coursesService as groupService } from '../../services/group.api.js';
export { evaluationsService } from '../../services/evaluations.api.js';

