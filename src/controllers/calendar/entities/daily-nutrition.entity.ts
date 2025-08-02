import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class DailyNutritionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    carbs: number;

    @Column()
    protein: number;

    @Column()
    fat: number;

    @Column()
    calories: number;
}