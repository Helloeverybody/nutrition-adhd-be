import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MealEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'timestamp' })
    time: Date;

    @Column()
    carbs: number;

    @Column()
    protein: number;

    @Column()
    fat: number;

    @Column()
    calories: number;

    @Column()
    weight: number;

    @Column()
    carbsPerWeight: number;

    @Column()
    proteinPerWeight: number;

    @Column()
    fatPerWeight: number;

    @Column()
    caloriesPerWeight: number;
}