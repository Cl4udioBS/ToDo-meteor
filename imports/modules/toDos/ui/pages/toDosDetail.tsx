import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {toDosApi} from '../../api/toDosApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField
  from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import * as appStyle from '/imports/materialui/styles';
import Print from '@mui/icons-material/Print';
import Close from '@mui/icons-material/Close';
import {PageLayout} from '/imports/ui/layouts/pageLayout';
import {getUser} from '/imports/libs/getUser';

import FormControlLabel from '@mui/material/FormControlLabel';

interface IToDosDetail {
  screenState: string;
  loading: boolean;
  isPrintView: boolean;
  toDosDoc: object;
  save: { (doc: object, callback?: {}): void };
  history: { push(url: string): void };
}

const ToDosDetail = ({
  isPrintView,
  screenState,
  loading,
  toDosDoc,
  save,
  history,
}: IToDosDetail) => {

  const [personalTask,setPersonalTask] = React.useState(toDosDoc ? (toDosDoc.personalTask? toDosDoc.personalTask : false) : false)

  React.useEffect(()=>{
    if(toDosDoc){
      setPersonalTask(toDosDoc.personalTask? toDosDoc.personalTask : false)
    }
  },[toDosDoc])
  // let personalTask = toDosDoc.personalTask? toDosDoc.personalTask : false;

  const handleSubmit = (doc: object) => {
    doc.personalTask = personalTask
    save(doc);
  };
  const handleChange = ()=>{
    setPersonalTask(!personalTask)
    // personalTask = !personalTask
  }

  return (
      <PageLayout
          title={screenState === 'view'
              ? 'Visualizar tarefa'
              : (screenState === 'edit' ? 'Editar tarefa' : 'Criar tarefa')}
          onBack={() => history.push('/toDos')}
          actions={[
            !isPrintView ? (
                <span style={{
                  cursor: 'pointer',
                  marginRight: 10,
                  color: appStyle.primaryColor,
                }} onClick={() => {
                  history.push(`/toDos/printview/${toDosDoc._id}`);
                }}><Print/></span>
            ) : (
                <span style={{
                  cursor: 'pointer',
                  marginRight: 10,
                  color: appStyle.primaryColor,
                }} onClick={() => {
                  history.push(`/toDos/view/${toDosDoc._id}`);
                }}><Close/></span>
            ),
          ]}
      >
        <SimpleForm
            mode={screenState}
            schema={toDosApi.getSchema()}
            doc={toDosDoc}
            onSubmit={handleSubmit}
            loading={loading}
        >

          <FormGroup key={'fieldsOne'}>
            <TextField
                placeholder="Titulo"
                name="title"
            />
            <TextField
                placeholder="Descrição"
                name="description"
            />
            <FormControlLabel
              label={"Pessoal"}
              control={
                <Switch 
                  onChange={handleChange}
                  checked={personalTask}
                  name="personal"
                />
              }
            />

          </FormGroup>


          <div key={'Buttons'} style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            paddingTop: 20,
            paddingBottom: 20,
          }}>
            {!isPrintView ? (
                <Button
                    key={'b1'}
                    style={{marginRight: 10}}
                    onClick={screenState === 'edit' ? () => history.push(
                        `/toDos/view/${toDosDoc._id}`) : () => history.push(
                        `/toDos/list`)}
                    color={'secondary'} variant="contained">
                  {screenState === 'view' ? 'Voltar' : 'Cancelar'}
                </Button>
            ) : null}


            {!isPrintView && screenState === 'view' ? (
                <Button key={'b2'} onClick={() => {
                  history.push(
                      `/toDos/edit/${toDosDoc._id}`);
                }}
                        color={'primary'} variant="contained">
                  {'Editar'}
                </Button>
            ) : null}
            {!isPrintView && screenState !== 'view' ? (
                <Button key={'b3'} color={'primary'} variant="contained"
                        submit="true">
                  {'Salvar'}
                </Button>
            ) : null}
          </div>
        </SimpleForm>

      </PageLayout>
  );
};

interface IToDosDetailContainer {
  screenState: string;
  id: string;
  history: { push(url: string): void };
  showNotification: (data: { type: string, title: string, description: string }) => void;
}

export const ToDosDetailContainer = withTracker(
    (props: IToDosDetailContainer) => {
      const {screenState, id} = props;
      const subHandle = !!id
          ? toDosApi.subscribe('toDosDetail', {_id: id})
          : null;
      let toDosDoc = id && subHandle.ready()
          ? toDosApi.findOne({_id: id})
          : {};
      return ({
        screenState,
        toDosDoc,
        save: (doc, callback) => toDosApi[screenState === 'create'
            ? 'insert'
            : 'update']({...doc, userId: getUser()._id}, (e, r) => {
          if (!e) {
            props.history.push(
                `/toDos/view/${screenState === 'create' ? r : doc._id}`);
            props.showNotification({
              type: 'success',
              title: 'Operação realizada!',
              description: `A tarefa foi ${doc._id
                  ? 'atualizado'
                  : 'cadastrado'} com sucesso!`,
            });
          } else {
            console.log('Error:', e);
            props.showNotification({
              type: 'warning',
              title: 'Operação não realizada!',
              description: `Erro ao realizar a operação: ${e.message}`,
            });
          }

        }),
      });
    })(ToDosDetail);
