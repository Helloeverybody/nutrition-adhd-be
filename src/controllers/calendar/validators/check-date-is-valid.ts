import {BadRequestException} from "@nestjs/common";

export function checkDateIsValid(date: string) {
    if (isNaN(Date.parse(date))) {
        throw new BadRequestException('Date has invalid format')
    }
}