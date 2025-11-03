import { levelRepository } from "../repositories/level.repository.js";

export const levelService = {

    async getLevels() {
        const levels = await levelRepository.getAllLevels();
        return levels || [];
    }

};