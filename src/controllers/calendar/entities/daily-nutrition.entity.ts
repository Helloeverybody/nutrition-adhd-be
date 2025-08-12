import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class DailyNutritionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column('float8')
    carbs: number;

    @Column('float8')
    protein: number;

    @Column('float8')
    fat: number;

    @Column('float8')
    calories: number;
}