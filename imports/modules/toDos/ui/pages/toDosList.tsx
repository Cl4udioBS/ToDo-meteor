import React from 'react';
import {useState} from 'react'

import {withTracker} from 'meteor/react-meteor-data';
import {toDosApi} from '../../api/toDosApi';
import SimpleTable from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';

import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import {makeStyles} from '@mui/styles';
import {ReactiveVar} from 'meteor/reactive-var';
import {initSearch} from '../../../../libs/searchUtils';

import * as appStyle from '/imports/materialui/styles';

import shortid from 'shortid';
import {PageLayout} from '/imports/ui/layouts/pageLayout';
import TextField
  from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import EditIcon from '@mui/icons-material/Edit';
import {getUser} from '/imports/libs/getUser';

import Modal from '@mui/material/Modal';

import {ToDosDetailContainer} from './toDosDetail'

interface IToDosList {
  toDos: object[];
  history: object;
  remove: (doc: object) => void;
  showDialog: (dialog: object) => void;
  showNotification: (notification: object) => void;
  onSearch: (text?: string) => void;
  total: number;
  loading: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  searchBy?: any;
  pageProperties: object;
}

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  selectDropdown: {color: '#fff', backgroundColor: '#1b1f38'},
  menuItem: {
    '&:hover': {
      backgroundColor: '#3b3f58',
    },
  },
  space: {
    flex: 'none',
    width: 'fit-content',
  },
  caption: {
    flex: 'none',
    width: 'fit-content',
  },
});

const ToDosList = ({
  toDos,
  history,
  remove,
  showDialog,
  showNotification,
  onSearch,
  total,
  loading,
  setPage,
  setPageSize,
  searchBy,
  pageProperties,
}: IToDosList) => {
  const classes = useStyles();

  const idToDos = shortid.generate();

  const [open,setOpen] = useState(false);
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const onClick = ( doc) => {
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

    history.push('/toDos/view/' + id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };
  const [text, setText] = React.useState(searchBy || '');
  const change = (e) => {
    if (text.length !== 0 && e.target.value.length === 0) {
      onSearch();
    }
    setText(e.target.value);
  };
  const keyPress = (e, a) => {
    // if (e.key === 'Enter') {
    if (text && text.trim().length > 0) {
      onSearch(text.trim());
    } else {
      onSearch();
    }
    // }
  };

  const click = (...e) => {
    if (text && text.trim().length > 0) {
      onSearch(text.trim());
    } else {
      onSearch();
    }

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
      <PageLayout
          title={'Lista de Tarefas'}
          actions={[]}
          onBack={() => history.push('/')}
      >
        <TextField label={'Pesquisar'} value={text} onChange={change} onKeyPress={keyPress}  placeholder='Digite aqui o que deseja pesquisa...'
                   action={{ icon: 'search',onClick:click }}
        />
        <SimpleTable
            schema={_.pick(toDosApi.schema,
                [ 'isChecked', 'title', 'description','username'])}
            data={toDos}
            actions={[{icon: <Delete/>, id: 'delete', onClick: callRemove},{icon:<EditIcon/>, id:'edit', onClick: onClick}]}
            handleChange={handleChecked}
        />
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <TablePagination
              style={{width: 'fit-content', overflow: 'unset'}}
              rowsPerPageOptions={[4,10, 25, 50, 100]}
              labelRowsPerPage={<div
                  style={{width: 0, padding: 0, margin: 0}}/>}
              component="div"
              count={total}
              // rowsPerPage={pageProperties.pageSize}
              rowsPerPage={pageProperties.pageSize}
              page={pageProperties.currentPage - 1}
              onPageChange={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              labelDisplayedRows={({
                from,
                to,
                count,
              }) => (`${from}-${to} de ${count}`)}
              SelectProps={{
                inputProps: {'aria-label': 'rows per page'},
                MenuProps: {classes: {paper: classes.selectDropdown}},
              }}
              classes={{
                menuItem: classes.menuItem,
                spacer: classes.space,
                caption: classes.caption,
              }}
          />
        </div>
        <div style={appStyle.fabContainer}>
          <Fab
              id={'add'}
              // onClick={() => history.push(`/toDos/create/${idToDos}`)}
              onClick={handleOpen}
              color={'primary'}>
            {/* HERE */}
              <Add/>
          </Fab>
          {/* <Modal
            open={open}
            onClose={handleClose}
          >
            <ToDosDetailContainer 
            
            />
          </Modal> */}
        </div>

      </PageLayout>
  );

};

export const subscribeConfig = new ReactiveVar({
  pageProperties: {
    currentPage: 1,
    pageSize: 4,
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

let onSearchToDosTyping;

export const ToDosListContainer = withTracker((props) => {

  //Reactive Search/Filter
  const config = subscribeConfig.get();
  const sort = {
    [config.sortProperties.field]:
        config.sortProperties.sortAscending ? 1 : -1,
  };
  toDosSearch.setActualConfig(config);
  user = getUser()
  //Subscribe parameters
  const filter = {
    $or:[{personalTask:false},{userId:user._id}]
  };
  
  const limit = config.pageProperties.pageSize;
  const skip = (config.pageProperties.currentPage - 1) *
      config.pageProperties.pageSize;

  //Collection Subscribe
  const subHandle = toDosApi.subscribe('toDosList', filter,
      {sort, limit, skip});
  const toDos = subHandle.ready()
      ? toDosApi.find(filter, {sort}).fetch()
      : [];
  return ({
    toDos,
    loading: !!subHandle && !subHandle.ready(),
    remove: (doc) => {
      toDosApi.remove(doc, (e, r) => {
        if (!e) {
          props.showNotification({
            type: 'success',
            title: 'Operação realizada!',
            message: `O exemplo foi removido com sucesso!`,
          });
        } else {
          console.log('Error:', e);
          props.showNotification({
            type: 'warning',
            title: 'Operação não realizada!',
            message: `Erro ao realizar a operação: ${e.message}`,
          });
        }

      });
    },
    searchBy: config.searchBy,
    onSearch: (...params) => {
      onSearchToDosTyping && clearTimeout(onSearchToDosTyping);
      onSearchToDosTyping = setTimeout(() => {
        config.pageProperties.currentPage = 1;
        subscribeConfig.set(config);
        toDosSearch.onSearch(...params);
      }, 1000);

    },
    total: subHandle ? subHandle.total : toDos.length,
    pageProperties: config.pageProperties,
    filter,
    sort,
    setPage: (page = 1) => {
      config.pageProperties.currentPage = page;
      subscribeConfig.set(config);
    },
    setFilter: (newFilter = {}) => {
      config.filter = ({...filter, ...newFilter});
      Object.keys(config.filter).forEach((key) => {
        if (config.filter[key] === null || config.filter[key] === undefined) {
          delete config.filter[key];
        }
      });
      subscribeConfig.set(config);
    },
    setSort: (sort = {}) => {
      config.sort = sort;
      subscribeConfig.set(config);
    },
    setPageSize: (size = 25) => {
      config.pageProperties.pageSize = size;
      subscribeConfig.set(config);
    },
  });
})(ToDosList);
