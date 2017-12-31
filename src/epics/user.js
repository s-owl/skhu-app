import { FETCHING_DATA } from '../actions'
import { getDataSuccess, getDataFailure } from '../actions/actions'

import 'rxjs'
import { Observable } from 'rxjs/Observable'

function getUser() {
    return fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
}

const fetchUserEpic = action$ => 
    action$.ofType(FETCHING_DATA)
        .mergeMap(action =>
            Observable.fromPromise(getUser())
                .map(response => getDataSuccess(response))
                .catch(error => Observable.of(getDataFailure(error)))
        )

export default fetchUserEpic