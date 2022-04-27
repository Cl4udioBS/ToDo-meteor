// region Imports
import { Meteor } from 'meteor/meteor';
import {ApiBase} from '../../../api/base';
import {taskSch} from './toDosSch';
import {getUser} from '/imports/libs/getUser';

// endregion

class ToDosApi extends ApiBase {
  constructor(props) {
    super('toDos', taskSch);

    this.addPublication('toDosList', (filter = {}, options = {}) => {
      const user = getUser();
      const newFilter = {...filter};
      const newOptions = {
        ...options,
        projection: {isChecked:1, title: 1, description: 1, _id: 1},
      };
      return this.defaultCollectionPublication(newFilter, newOptions);
    });

    this.addPublication('toDosDetail', (filter = {}, options = {}) => {
      const user = getUser();
      const newFilter = {...filter};
      const newOptions = {...options};
      return this.defaultCollectionPublication(newFilter, newOptions);
    });

    this.registerMethod('toggleChecked', this.serverToggleCheck);
  }

  toggleChecked = (doc, callback) => {
    this.callMethod('toggleChecked', doc, callback);
  }

  serverToggleCheck = (doc) => {
    const user = getUser();
    if (Meteor.isServer) {
      const task = this.findOne(doc._id);
      if (!task || task.userId !== user._id){
        throw new Meteor.Error("Erro de tarefa ou id");
      }
      this.serverUpdate({ _id: doc._id, isChecked: !(task.isChecked)  }, this);
    }  
  }


}

export const toDosApi = new ToDosApi();
