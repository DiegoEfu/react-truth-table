import React from 'react';
import { Paper, Grid, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Typography } from '@mui/material';

const Results = ({formula, tables, variables}) => {
    return (
        <>
            <Typography variant='body-1' color="white"><strong>Interpreted Formula:</strong> {formula}</Typography>
            <Typography variant='h2' color="white" align='center'>Results</Typography>
            <Typography variant='h4' color="white" align='center'>Variables</Typography>
            <Grid container style={{paddingTop: '15px', paddingBottom: '15px'}} justifyContent="space-evenly" direction="row-reverse">
                {/* This is going to be its own component */}
                {Object.keys(variables).map( (k) => (
                    <Grid style={{marginBottom: "10px"}} item lg={Object.keys(variables).length < 5 ? 10/Object.keys(variables).length : 4} xs={10}>                    
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>
                                            <strong>{k}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        variables[k].map((v) =>
                                            <TableRow>
                                                <TableCell align='center'>
                                                    {v ? "T" : "F"}
                                                </TableCell>
                                            </TableRow>
                                        )                                      
                                    }                                
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                ))}
            </Grid>
                <Typography variant='h4' color="white" align='center'>Formulas</Typography>
                <Grid container style={{paddingTop: '15px', paddingBottom: '15px'}} justifyContent="space-evenly">
                {/* This is going to be its own component */}
                {Object.keys(tables).map( (k) => (
                    <Grid style={{marginBottom: "10px"}} item lg={10/Object.keys(tables).length} xs={10}>                    
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center' key={k}>
                                            <strong>{k}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        tables[k].map((v) =>
                                            <TableRow>
                                                <TableCell align='center'>
                                                    {v ? "T" : "F"}
                                                </TableCell>
                                            </TableRow>
                                        )                                      
                                    }                                
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                ))}   
            </Grid>
        </>
        
  )
}

export default Results