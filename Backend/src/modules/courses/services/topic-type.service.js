import { topicTypeRepository } from "../repositories/topic-type.repository.js";

export const topicTypeService = {

    async getTopicTypes() {
        const types = await topicTypeRepository.getAllTopicTypes();
        return types || [];
    }

};