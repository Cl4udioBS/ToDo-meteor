// region Imports
import {ApiBase} from '../../../api/base';
import {taskSch} from './toDosSch';
import {getUser} from '/imports/libs/getUser';

// endregion

class ToDosApi extends ApiBase {
  constructor(props) {
    super('toDos', taskSch);

    this.addPublication('toDoList', (filter = {}, options = {}) => {
      const user = getUser();
      const newFilter = {...filter};
      const newOptions = {
        ...options,
        projection: {title: 1, description: 1, _id: 1},
      };
      return this.defaultCollectionPublication(newFilter, newOptions);
    });

    this.addPublication('toDoDetail', (filter = {}, options = {}) => {
      const user = getUser();
      const newFilter = {...filter};
      const newOptions = {...options};
      return this.defaultCollectionPublication(newFilter, newOptions);
    });

  }

}

export const toDosApi = new ToDosApi();
