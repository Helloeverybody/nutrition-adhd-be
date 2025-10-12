import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {IAuthKeyResponse, IFoodDetailsResponse, IFoodItem, IFoodsResponse} from "./interfaces/response.interfaces";
import {map, Observable, of, switchMap, tap} from "rxjs";
import {ConfigService} from "@nestjs/config";
import {FatSecretApiError} from "./interfaces/error.interfaces";
import {AxiosResponse} from "axios";

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
            tap(this.fatSecretErrorHandler),
            map(({data}) => data as IFoodsResponse),
        )
    }

    getFoodDetails(id: number): Observable<IFoodItem> {
        return this.authKey$.pipe(
            switchMap((authKey) =>
                this.httpService.get<IFoodDetailsResponse>('https://platform.fatsecret.com/rest/food/v4', {
                    params: {
                        food_id: id,
                        format: 'json',
                        flag_default_serving: true
                    },
                    headers: {
                        Authorization: `Bearer ${authKey}`,
                        'Content-Type': 'application/json'
                    }
                })
            ),
            tap(this.fatSecretErrorHandler),
            map(({data}) => (data as IFoodDetailsResponse).food)
        )
    }

    private fatSecretErrorHandler({data}: AxiosResponse) {
        if ('error' in data) {
            throw new InternalServerErrorException(`FatSecret API error: ${data?.error?.message}`)
        }
    }
}