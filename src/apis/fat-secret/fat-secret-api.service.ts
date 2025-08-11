import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {IAuthKeyResponse, IFoodsResponse} from "./interfaces/response.interfaces";
import {catchError, map, Observable, of, switchMap, take, tap} from "rxjs";
import {ConfigService} from "@nestjs/config";
import {FatSecretApiError} from "./interfaces/error.interfaces";

@Injectable()
export class FatSecretApiService {
    private cachedAuthKey: string;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {}

    private get authKey$(): Observable<string> {
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
            map(response => response.data.access_token),
        )
    }

    getFoodList(searchValue: string | undefined, page: number = 1, maxOnPage: number = 20): Observable<IFoodsResponse> {
        return this.authKey$.pipe(
            switchMap((authKey) =>
                this.httpService.get<IFoodsResponse | FatSecretApiError>('https://platform.fatsecret.com/rest/foods/search/v3', {
                    params: {
                        search_expression: searchValue,
                        page_number: page,
                        max_results: maxOnPage,
                        flag_default_serving: true,
                        format: 'json'
                    },
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                        'Content-Type': 'application/json'
                    }
                })
            ),
            map(({data}) => {
                if ('error' in data) {
                    throw new InternalServerErrorException(`FatSecret API error: ${data?.error?.message}`)
                }

                return data as IFoodsResponse
            }),
        )
    }

}