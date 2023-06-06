// Provider é o arquivo que irá manipular os dados no banco
import * as create from './Create';
import * as count from './Count';
import * as deleteById from './DeleteById';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as updateById from './UpdateById';

export const CitiesProvider = {
  ...create,
  ...count,
  ...deleteById,
  ...getAll,
  ...getById,
  ...updateById
};

