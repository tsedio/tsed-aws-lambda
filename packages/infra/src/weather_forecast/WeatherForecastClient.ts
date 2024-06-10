import { WeatherForecast } from "@project/domain/weather_forecast/WeatherForecast.js"
import { Constant, Injectable } from "@tsed/di"
import { CreateAxiosDefaults } from "axios"

import { HttpClient } from "../http/HttpClient.js"

@Injectable()
export class WeatherForecastClient extends HttpClient {
  callee = "WEATHER_FORECAST"

  @Constant("envs.WEATHER_FORECAST_API_URL")
  protected declare baseURL: string

  @Constant("envs.WEATHER_FORECAST_API_KEY")
  protected apiKey: string

  getWeeklyForecast(city: string) {
    return this.get<WeatherForecast>("/forecast/weekly", {
      params: {
        city
      },
      type: WeatherForecast,
      collectionType: Array
    })
  }

  protected create(opts?: CreateAxiosDefaults) {
    return super.create({
      ...opts,
      headers: {
        ...(opts?.headers || {}),
        "x-api-key": this.apiKey
      }
    })
  }
}
