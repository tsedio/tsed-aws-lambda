import { Service } from "@tsed/di"

@Service()
export class GreetingService {
  greet(name: string): string {
    return `Hello, ${name}!`
  }
}
