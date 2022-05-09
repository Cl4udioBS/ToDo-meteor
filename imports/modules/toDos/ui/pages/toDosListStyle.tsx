import { ISxStyleObject } from "/imports/types/ISxStyleObject";
// import {lightElements, primary} from "/imports/materialui/styles";


export const toDosStyle : ISxStyleObject ={
    titleSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'left',
        flexWrap: 'wrap',
        maxWidth: '20%'
    },
    task: {
        display: 'flex',
        gap: '0.5rem 2rem',
        flexWrap: 'wrap',
        marginTop: '1rem',
        justifyContent: 'space-evenly'
    },
    insideCard: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginRight: '1rem',
        gap: '0.5rem 1rem',
    },
    taskItem:{
        flex:1,
        display: 'flex',
        flexWrap: 'wrap',
        maxWidth:'20%',
        fontFamily:'PT Sans',
    },
}