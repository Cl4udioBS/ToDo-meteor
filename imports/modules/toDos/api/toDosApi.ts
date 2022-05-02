// region Imports
import { Meteor } from 'meteor/meteor';
import {ApiBase} from '../../../api/base';
import {taskSch} from './toDosSch';
import {getUser} from '/imports/libs/getUser';

// endregion

class ToDosApi extends ApiBase {
  constructor(props) {
    super('toDos', taskSch);
    //fix from here
    this.addTransformedPublication('toDosList',(filter={},options={}) =>{
      let user = getUser()
      const uId = user._id
      let newFilter = {$or:[{personalTask:false},{userId:user._id}]};
      const newOptions ={
        ...options,
      }
      return this.collectionInstance.find(newFilter,newOptions);
      },
      doc => {
        const userId = doc.userId
        let user = Meteor.users.find({"_id":userId},).fetch()
        const username = user[0].username;
        return{
          ...doc,
          username: username? username : ''
      }
    })
  

    this.addPublication('toDosDetail', (filter = {}, options = {}) => {
      const newFilter = {...filter};
      const newOptions = {...options};
      return this.defaultCollectionPublication(newFilter, newOptions);
    });

    this.registerMethod('toggleChecked', this.serverToggleCheck);
  }

  userCheck = (docObj,context) =>{
      const user = getUser();
      if (user._id !== docObj.userId){
        throw new Meteor.Error("Usuario não é quem criou a tarefa");
      }
      else{
        return true
      }
  }

  beforeUpdate = (docObj,context) =>{
    return this.userCheck(docObj,context)
  }
  beforeRemove = (docObj,context) =>{
    return this.userCheck(docObj,context)
  }

  toggleChecked = (doc, callback) => {
    this.callMethod('toggleChecked', doc, callback);
  }

  serverToggleCheck = (doc) => {
    if (Meteor.isServer) {
      const task = this.findOne(doc._id);
      if (!task){
        throw new Meteor.Error("Erro de tarefa ou id");
      }
      this.serverUpdate({ _id: doc._id, isChecked: !(task.isChecked),userId:doc.userId  }, this);
    }  
  }


}

export const toDosApi = new ToDosApi();
