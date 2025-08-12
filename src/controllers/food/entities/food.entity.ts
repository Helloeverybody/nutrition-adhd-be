import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FoodEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand?: string;

    @Column('float8')
    carbs: number;

    @Column('float8')
    protein: number;

    @Column('float8')
    fat: number;

    @Column('float8')
    calories: number;
}