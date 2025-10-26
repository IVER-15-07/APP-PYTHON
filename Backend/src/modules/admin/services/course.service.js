import { GroupRepository } from "../repositories/group.repository.js";


export const courseService = {
    async listPending() {
    return GroupRepository.listPendingTeams();
  },






};