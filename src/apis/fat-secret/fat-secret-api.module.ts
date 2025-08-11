import {Module} from "@nestjs/common";
import {FatSecretApiService} from "./fat-secret-api.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";

@Module({
    providers: [
        FatSecretApiService
    ],
    imports: [
        HttpModule,
        ConfigModule
    ],
    exports: [
        HttpModule,
        FatSecretApiService
    ]
})
export class FatSecretApiModule {

}