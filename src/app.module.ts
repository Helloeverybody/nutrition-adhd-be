import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import Joi from "@hapi/joi";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CalendarModule} from "./controllers/calendar/calendar.module";
import {FoodModule} from "./controllers/food/food-module";
import {MealModule} from "./controllers/meal/meal.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                PORT: Joi.number(),
            })
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
                entities: [__dirname + '/../**/*.entity.js'],
                synchronize: true,
                logging: false,
            })
        }),
        CalendarModule,
        FoodModule,
        MealModule
    ]
})
export class AppModule {

}
