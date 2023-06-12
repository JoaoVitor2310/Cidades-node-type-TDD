// Provider é o arquivo que irá manipular os dados no banco
import * as create from './Create';
import * as getById from './GetByEmail';

export const UsersProvider = {
  ...getById,
  ...create,
}

