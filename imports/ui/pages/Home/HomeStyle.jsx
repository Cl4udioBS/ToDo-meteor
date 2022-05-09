/*!

 =========================================================
 * Material Dashboard React - v1.0.0 based on Material Dashboard - v1.2.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */

import {isMobile} from '/imports/libs/deviceVerify';

const homeStyles = {
  title: {
    fontSize: isMobile ? '20px' : '30px',
    paddingTop: isMobile ? '20px' : '20px',
    paddingBottom: isMobile ? '20px' : '20px',
    fontWeight: isMobile ? '500' : '500',
  },
  subTitle: {
    fontSize: isMobile ? '15px' : '25px',
    paddingTop: isMobile ? '10px' : '10px',
    paddingBottom: isMobile ? '20px' : '20px',
    fontWeight: isMobile ? '300' : '300',
    textAlign: 'justify',
    textJustify: 'inter-word',
  },
  containerHome: {
    marginTop: '2em',
    maxWidth: '100%',
    maxHeight: '100%',
  },
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
};

export {
  homeStyles,
};
