import {Module} from "@nestjs/common";
import {FatSecretApiService} from "./fat-secret-api.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";
import {FatSecretTokenService} from "./fat-secret-token.service";

@Module({
    providers: [
        FatSecretApiService,
        FatSecretTokenService
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