import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MealEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    brand?: string;

    @Column({ type: 'timestamp' })
    time: Date;

    @Column('float8')
    carbs: number;

    @Column('float8')
    protein: number;

    @Column('float8')
    fat: number;

    @Column('float8')
    calories: number;

    @Column('float8')
    weight: number;

    @Column('float8')
    carbsPerWeight: number;

    @Column('float8')
    proteinPerWeight: number;

    @Column('float8')
    fatPerWeight: number;

    @Column('float8')
    caloriesPerWeight: number;
}