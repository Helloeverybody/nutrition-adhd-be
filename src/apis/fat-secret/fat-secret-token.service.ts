import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {IAuthKeyResponse} from "./interfaces/response.interfaces";
import {map, Observable, of, tap, timer} from "rxjs";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class FatSecretTokenService {
    private cachedAuthKey: string | undefined;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    public get authKey$(): Observable<string> {
        return this.cachedAuthKey
            ? of(this.cachedAuthKey)
            : this.requestAuthKey()
                .pipe(
                    tap(key => this.cachedAuthKey = key)
                )
    }

    private requestAuthKey(): Observable<string> {
        const form = new FormData()

        const formData = {
            grant_type: 'client_credentials',
            scope: 'basic premier'
        }

        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value)
        })

        const requestHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const clientSecret = this.configService.get('FATSECRET_CLIENT_SECRET');
        const clientId = this.configService.get('FATSECRET_CLIENT_ID');

        return this.httpService.post<IAuthKeyResponse>('https://oauth.fatsecret.com/connect/token', form, {
            headers: requestHeaders,
            auth: {
                username: clientId,
                password: clientSecret
            }
        }).pipe(
            map(({ data }) => {
                this.setTokenUpdating(data.expires_in)
                return data.access_token
            }),
        )
    }

    private setTokenUpdating(expiresInSec: number = 86400) {
        const timeBufferSec = 60
        const msInSeconds = 1000

        timer((expiresInSec - timeBufferSec) * msInSeconds)
            .subscribe(() => {
                this.cachedAuthKey = undefined;
                this.authKey$.subscribe()
            })
    }
}