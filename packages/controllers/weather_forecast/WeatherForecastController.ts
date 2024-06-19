import { WeatherForecast } from "@project/domain/weather_forecast/WeatherForecast.js"
import { WeatherForecastClient } from "@project/infra/weather_forecast/WeatherForecastClient.js"
import { QueryParams } from "@tsed/common"
import { Controller, Inject } from "@tsed/di"
import { Get, Max, Min, Required, Returns } from "@tsed/schema"

@Controller("/weather_forecast")
export class WeatherForecastController {
  @Inject()
  protected client: WeatherForecastClient

  @Get("/")
  @Returns(200, Array).Of(WeatherForecast)
  getWeaklyForecast(@Required() @Min(2) @Max(100) @QueryParams("city") city: string) {
    return this.client.getWeeklyForecast(city)
  }
}
