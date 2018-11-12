import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Post extends Parse.Object {

  constructor() {
    super('Post');
  }

  loadAll() {
    const query = new Parse.Query(Post)
    return query.find()
  }

  get title(): string {
    return this.get('title');
  }

  get url(): string {
    return this.get('url');
  }

  get source(): string {
    return this.get('source');
  }
}

Parse.Object.registerSubclass('Post', Post);
