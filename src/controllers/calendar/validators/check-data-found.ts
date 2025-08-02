import {NotFoundException} from "@nestjs/common";

export function checkDataFound(data: any, entityName?: string) {
    if (data === undefined || data === null) {
        throw new NotFoundException('Data not found' + (entityName ? `: ${entityName}` : ''))
    }
}