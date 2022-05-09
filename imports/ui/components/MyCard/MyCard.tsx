
import React from 'react';

import {toDosApi} from '../../../modules/toDos/api/toDosApi';
// import SimpleTable from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';

import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import * as appStyle from '/imports/materialui/styles';

import EditIcon from '@mui/icons-material/Edit';
import {getUser} from '/imports/libs/getUser';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import Itask from 'imports/modules/toDos/api/toDosSch'
import MoreVert from '@mui/icons-material/MoreVert';
import  Typography  from '@mui/material/Typography';

import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {toDosStyle} from '../../../modules/toDos/ui/pages/toDosListStyle'

// const ToDosList = ({
//     toDos,
//     history,
//     remove,
//     showDialog,
//     showNotification,
//     onSearch,
//     showDrawer,
//     total,
//     // loading,
//     setPage,
//     setPageSize,
//     searchBy,
//     pageProperties,
//   }: IToDosList) => {


const  MyCard = ({
    remove,
    showDialog,
    showNotification,
    showDrawer,
    task,
    index,

}:Itask ) => {
  
    // const classes = useStyles();
 
    // const task = props.task;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event,index:number) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
  
  
  
    const handleOpen = (page:string) => {
      let goToPage = page;
      if (typeof goToPage != 'string'){
        goToPage = `/toDos/create/${idToDos}`
      }
  
      const url = goToPage;
      showDrawer({title: 'Tareifa', url:url});
    }
  
    const onClickEdit = ( doc) => {
      handleClose()
      let id = doc._id
      const user = getUser() 
      if(doc.userId !== user._id){
        showNotification({
          type: 'warning',
          title: 'Operação proibida!',
          message: `Você não criou esta tarefa`,
        })
        return;
      }
  
      // HERE
      handleOpen('/toDos/view/' + id)
    };


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
  
    const callRemove = (doc) => {
      handleClose()
      console.log("trying to remove",doc)
      const user = getUser() 
      if(doc.userId !== user._id){
        showNotification({
          type: 'warning',
          title: 'Operação proibida!',
          message: `Você não criou esta tarefa`,
        })
        return;
      }

      const dialogOptions = {
        icon: <Delete/>,
        title: 'Remover exemplo',
        content: () => <p>{`Deseja remover o exemplo "${doc.title}"?`}</p>,
        actions: ({closeDialog}) => [
          <Button
              variant={'outlined'}
              color={'secondary'}
              onClick={closeDialog}
          >{'Não'}</Button>,
          <Button
              variant={'contained'}
              onClick={() => {
                remove(doc);
                closeDialog();
  
              }}
              color={'primary'}>{'Sim'}</Button>,
        ],
      };
      showDialog(dialogOptions);
    };

    return (
          <Card key={'taskListHeader'}>
            <Box sx={toDosStyle.task}>
            <Checkbox 
                icon={<RadioButtonUncheckedIcon style={{width: '30px'}}/>}
                checkedIcon={<CheckCircleOutlineIcon style={{width: '30px'}}/>}
                checked={task.isChecked}
                onChange={()=>{handleChecked(task)}}
                sx={toDosStyle.taskItem}
            />
            <Typography variant='subtitle1' sx={toDosStyle.taskItem} >{task.title}</Typography>
            <Typography variant='subtitle1' sx={toDosStyle.taskItem} >{task.description}</Typography>
            <Typography variant='subtitle1' sx={toDosStyle.taskItem} >{task.username}</Typography>       
            <IconButton
                id={'task-button'+index}
                aria-label={"Modificar tarefa "+index}
                aria-controls={"item lista "+index}
                aria-haspopup="true"
                data-key={'task-menu'+index}
                onClick={(event)=>handleMenu(event,index)}
            >
                <MoreVert/>
            </IconButton>
            <Menu
                id={"menu-taks"+index}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                //problema aqui, todos os menus abrem de uma vez
                onClose={handleClose}
                >
                    <MenuItem
                        key={'Edit-task'+index}
                        onClick={()=> onClickEdit(task)}
                    ><EditIcon/></MenuItem>
                    <MenuItem key={'delete-task'+index}
                            onClick={()=>callRemove(task)}><Delete/></MenuItem>
                </Menu>
            </Box>
          </Card>
    );
}

export default  MyCard;