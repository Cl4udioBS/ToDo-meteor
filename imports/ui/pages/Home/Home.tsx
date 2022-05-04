import React from 'react';
import {toDosApi} from '../../../modules/toDos/api/toDosApi';
import Container from '@mui/material/Container';
import * as appStyle from '/imports/materialui/styles';
import { getUser } from '/imports/libs/getUser';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import _ from 'lodash';
import Button from '@mui/material/Button';


import {withTracker} from 'meteor/react-meteor-data';
import {Link} from 'react-router-dom';
import {initSearch} from '../../../libs/searchUtils';


//FAZER o tracker


interface IHome {
  toDos: object[];
  showNotification: (notification: object) => void;

}

const Home = ({
  toDos,
  showNotification,

}: IHome) => {
     const user = getUser();

     const handleChecked = (doc) => {
      toDosApi.toggleChecked(doc, (e)=>{
        if(e){
          showNotification({
            type: 'warning',
            title: 'Operação proibida!',
            message: `Você não criou esta tarefa`,
          })
        }
      })
    }

     return(
    <>
      <Container>
        <h1>Olá, {user.username }</h1>
        <p>Atividades recentes.</p>
      </Container>

      <SimpleTable
            schema={_.pick(toDosApi.schema,
                [ 'isChecked', 'title', 'description','username'])}
            data={toDos}
            handleChange={handleChecked}

        />
      <Button 
          variant={'contained'}
          component={Link}
          to="/toDos"
      >
        Minhas tarefas
      </Button>
    </>
     )
};




export const subscribeConfig = new ReactiveVar({
  pageProperties: {
    currentPage: 1,
    pageSize: 5,
  },
  sortProperties: {field: 'createdat', sortAscending: false},
  filter: {},
  searchBy: null,
});

const toDosSearch = initSearch(
    toDosApi, // API
    subscribeConfig, // ReactiveVar subscribe configurations
    ['title', 'description'], // list of fields
);


export default homeContainer = withTracker((props) => {

  //Reactive Search/Filter
  const config = subscribeConfig.get();
  const sort = {
    [config.sortProperties.field]:
        config.sortProperties.sortAscending ? 1 : -1,
  };
  toDosSearch.setActualConfig(config);
  let user = getUser()
  //Subscribe parameters
  const filter = {
    $or:[{personalTask:false},{userId:user._id}]
  };
  
  const limit = config.pageProperties.pageSize;

  //Collection Subscribe
  const subHandle = toDosApi.subscribe('toDosList', filter,
      {sort, limit});
  const toDos = subHandle.ready()
      ? toDosApi.find(filter, {sort}).fetch()
      : [];
  return ({
    toDos,
    loading: !!subHandle && !subHandle.ready(),
    searchBy: config.searchBy,
  });
})(Home);


// export default Home;
//arrumar export pra ser tracker