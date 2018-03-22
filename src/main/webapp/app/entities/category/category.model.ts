import { BaseEntity } from './../../shared';

export class Category implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public information?: string,
        public items?: BaseEntity[],
    ) {
    }
}
