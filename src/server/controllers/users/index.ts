import * as signIn from './SigIn';
import * as singUp from './SignUp';

export const UsersController = {
  ...singUp,
  ...signIn,
};