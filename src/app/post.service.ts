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
      query.fromLocalDatastore()
      results = await query.find()
    }

    if (!cache || !results.length) {

      query.fromNetwork()
      results = await query.find()

      if (results.length) {
        await Parse.Object.unPinAllObjects()
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
