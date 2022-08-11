import { Typography, Grid } from '@mui/material';
import React from 'react';

const Footer = () => {

  return (
    <Grid container>
      <Grid item xs={1} />
      <Grid item>
      <Typography textAlign='center' color={"white"} variant='body-2'>Created by Diego Faria in August, 2022.</Typography>
      </Grid>
      <Grid item xs={1} />
    </Grid>
  )
}

export default Footer