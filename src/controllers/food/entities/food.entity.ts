import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FoodEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    carbs: number;

    @Column()
    protein: number;

    @Column()
    fat: number;

    @Column()
    calories: number;
}