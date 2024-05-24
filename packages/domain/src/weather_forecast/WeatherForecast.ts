/**
 *  "id": "20240523",
 *         "date": "20240523",
 *         "unit": "CELSIUS",
 *         "temperature": {
 *             "min": 14.07,
 *             "max": 20.69,
 *             "morning": 15.26,
 *             "afternoon": 17.92,
 *             "evening": 19.92,
 *             "night": 14.96
 *         },
 *         "weather": {
 *             "code": "RAIN",
 *             "description": "lluvia moderada"
 *         }
 */
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
