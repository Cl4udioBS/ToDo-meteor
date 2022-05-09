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
import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import  Typography  from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { padding } from '@mui/system';
import { AlignHorizontalLeft } from '@mui/icons-material';
import { ISxStyleObject } from "/imports/types/ISxStyleObject";
import {homeStyles} from './HomeStyle'
import Itask from 'imports/modules/toDos/api/toDosSch'

interface IHome {
  toDos: object[];
  showNotification: (notification: object) => void;

}

const Home = ({
  toDos,
  showNotification,

}: IHome) => {
     const user = getUser();

     const [data,setData] = React.useState(toDos)

     React.useEffect(()=>{
       setData(toDos)
     },[toDos])

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
    <Box>
      <Container>
        <h1>Olá, {user.username }</h1>
        <p>Atividades recentes.</p>
      </Container>

      {/* <SimpleTable
            schema={_.pick(toDosApi.schema,
                [ 'isChecked', 'title', 'description','username'])}
            data={toDos}
            handleChange={handleChecked}

        /> */}
      <Card key={'taskListHeader'}>
          <Box sx={homeStyles.insideCard}>
            <Box sx={homeStyles.titleSection}>
              <Typography variant='subtitle1' sx={{fontWeight:'bold'}} >
                Concluida
              </Typography>
            </Box>
            <Box sx={homeStyles.titleSection}>
              <Typography variant='subtitle1' sx={{fontWeight:'bold'}}>
                Titulo
              </Typography>
            </Box>
            <Box sx={homeStyles.titleSection}>
              <Typography variant='subtitle1' sx={{fontWeight:'bold'}}>
                Descrição
              </Typography>
            </Box>
            <Box sx={homeStyles.titleSection}>
              <Typography variant='subtitle1' sx={{fontWeight:'bold'}}>
                Autor
              </Typography>
            </Box>
              

          </Box>
              {
                data.map((task:Itask)=>{
                  return(
                    <Card key={'taskListHeader'}>
                      <Box sx={homeStyles.task}>
                      <Checkbox 
                          icon={<RadioButtonUncheckedIcon style={{width: '30px'}}/>}
                          checkedIcon={<CheckCircleOutlineIcon style={{width: '30px'}}/>}
                          checked={task.isChecked}
                          onChange={()=>{handleChecked(task)}}
                          sx={homeStyles.taskItem}
                      />
                      <Typography variant='subtitle1' sx={homeStyles.taskItem} >{task.title}</Typography>
                      <Typography variant='subtitle1' sx={homeStyles.taskItem} >{task.description}</Typography>
                      <Typography variant='subtitle1' sx={homeStyles.taskItem} >{task.username}</Typography>       
                      </Box>
                    </Card>                  )
                })
              }
        </Card>



      <Box >
        <Button 
            variant={'contained'}
            component={Link}
            to="/toDos"
            >
          Minhas tarefas
        </Button>
      </Box>
    </Box>
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