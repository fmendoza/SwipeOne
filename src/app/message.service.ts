import { Injectable } from '@angular/core'
import * as Parse from 'parse'

@Injectable({
  providedIn: 'root'
})
export class Message extends Parse.Object {

  constructor() {
    super('Message')
  }

  get name(): string {
    return this.get('name')
  }

  get text(): string {
    return this.get('text')
  }
}

Parse.Object.registerSubclass('Message', Message)
