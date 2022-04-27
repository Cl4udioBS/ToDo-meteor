import React from 'react';
import {ToDosListContainer} from './toDosList';
import {ToDosDetailContainer} from './toDosDetail';

export default (props: any) => {

  const validState = ['view', 'edit', 'create'];

  const screenState =
      props.match && props.match.params && !!props.match.params.screenState
          ? props.match.params.screenState
          : props.screenState;

  const id =
      props.match && props.match.params && !!props.match.params.exampleId
          ? props.match.params.exampleId
          : props.id;

  if (!!screenState && validState.indexOf(screenState) !== -1) {
    if ((screenState === 'view') && !!id) {
      return <ToDosDetailContainer {...props} screenState={screenState}
                                      id={id}/>;
    } else if (screenState === 'edit' && !!id) {
      return <ToDosDetailContainer {...props} screenState={screenState}
                                      id={id} edit/>;
    } else if (screenState === 'create' && !!id) {
      return <ToDosDetailContainer DetailContainer {...props}
                                     screenState={screenState}
                                      id={id} create/>;
    }
  } else {
    return <ToDosListContainer {...props} />;
  }
};
