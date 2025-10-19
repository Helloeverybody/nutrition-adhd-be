import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {IFoodDetailsResponse, IFoodItem, IFoodsResponse} from "./interfaces/response.interfaces";
import {map, Observable, switchMap, tap} from "rxjs";
import {FatSecretApiError} from "./interfaces/error.interfaces";
import {AxiosResponse} from "axios";
import {FatSecretTokenService} from "./fat-secret-token.service";

@Injectable()
export class FatSecretApiService {

    constructor(
        private httpService: HttpService,
        private tokenService: FatSecretTokenService
    ) {}

    getFoodList(searchValue: string | undefined, page: number = 1, maxOnPage: number = 20): Observable<IFoodsResponse> {
        return this.tokenService.authKey$.pipe(
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
        return this.tokenService.authKey$.pipe(
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