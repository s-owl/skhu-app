import { StackActions, NavigationActions } from 'react-navigation';

export default class NavUtils{
  static getResetAction(routeName){
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: routeName})],
    });
    return resetAction;
  }
}
