import { NavigationActions, StackActions } from 'react-navigation';


export default class NavigationService{
    static _navigator;

    static reset(routeName, params) {
      NavigationService._navigator.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: routeName, params: params})],
        })
      );
    }

    static setTopLevelNavigator(navigatorRef) {
      NavigationService._navigator = navigatorRef;
    }
}
