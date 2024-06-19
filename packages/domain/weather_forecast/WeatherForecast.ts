import { Enum, Format, Integer, Required } from "@tsed/schema"

export enum WeatherTypes {
  CLEAR_SKY = "CLEAR_SKY",
  BROKEN_CLOUDS = "BROKEN_CLOUDS",
  FEW_CLOUDS = "FEW_CLOUDS",
  SCATERRED_CLOUDS = "SCATERRED_CLOUDS",
  RAIN = "RAIN"
}

export class Temperature {
  @Required()
  @Integer()
  min: number

  @Required()
  @Integer()
  max: number

  @Required()
  @Integer()
  morning: number

  @Required()
  @Integer()
  afternoon: number

  @Required()
  @Integer()
  evening: number

  @Required()
  @Integer()
  night: number
}

export class Weather {
  @Enum(WeatherTypes)
  @Required()
  code: string

  @Required()
  description: string
}

export class WeatherForecast {
  @Required()
  id: string

  @Required()
  @Format("date")
  date: Date

  @Required()
  unit: string

  @Required()
  temperature: Temperature

  @Required()
  weather: Weather
}
