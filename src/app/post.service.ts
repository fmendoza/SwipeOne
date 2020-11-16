import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Post extends Parse.Object {

  constructor() {
    super('Post');
  }

  async loadAll(cache: boolean = true): Promise<Post[]> {

    let query = new Parse.Query(Post)
    query.ascending('title')
    let results = []

    if (cache) {

      results = await query
        .fromLocalDatastore()
        .find()
    }

    if (!cache || !results.length) {

      results = await query
        .fromNetwork()
        .find()

      if (results.length) {
        await (Parse as any).LocalDatastore._clear()
        await Parse.Object.pinAll(results)
      }
    }

    return results
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
