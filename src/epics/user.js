import { FETCHING_DATA } from '../actions'
import { getDataSuccess, getDataFailure } from '../actions/actions'

function getUser() {
    return fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
}

import 'rxjs'
import { Observable } from 'rxjs/Observable'

const fetchUserEpic = action$ => 
    action$.ofType(FETCHING_DATA)
        .mergeMap(action =>
            // getUser()
            Observable.fromPromise(getUser())
            // Observable.from(getUser())
                .map(response => getDataSuccess(response))
                .catch(error => Observable.of(getDataFailure(error)))
        )

export default fetchUserEpic