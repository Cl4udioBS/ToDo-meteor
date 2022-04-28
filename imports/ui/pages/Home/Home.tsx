import React from 'react';
import {toDosApi} from '../../../modules/toDos/api/toDosApi';
import Container from '@mui/material/Container';
import * as appStyle from '/imports/materialui/styles';
import { getUser } from '/imports/libs/getUser';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import _ from 'lodash';

//FAZER o tracker


const Home = () => {
     const user = getUser();
     const sort = {createdat : -1};
     
     const subHandle = toDosApi.subscribe('toDosList', {} ,
     {sort, limit: 5, skip: 0});)

     const toDos = subHandle.ready()
     ? toDosApi.find( {} , {sort}).fetch()
     : [];
     return(
    <>
      <Container>
        <h1>Olá, {user.username }</h1>
        <p>Seus projetos muito mais organizados.</p>
      </Container>

      <SimpleTable
            schema={_.pick(toDosApi.schema,
                [ 'isChecked', 'title', 'description','userId'])}
            data={toDos}
        />




      

    </>
     )
};

export default Home;
