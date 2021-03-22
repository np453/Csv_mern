import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


class Homepage extends Component {
    state={
        showdata:false,
        data:{
            file:null
        },
        csv_data: [[],[]],
        page: 0,
        setrow: 0
    }
    handleChangePage= (newpage)=>{
        this.setState({page: newpage});
    }
    handleChangeRowsPerPage = (event) => {
        this.setState({setrow: +event.target.value})
        this.setState({page: 0});
      };
    handleRadio = ({currentTarget:input}) => {
        const data = {...this.state.data};
        data[input.name] = input.value;
        if(input.name === 'file')data[input.name] = input.files[0]
        this.setState({ data });
    };
    onClickHandler= async() =>{
        const data = new FormData();
        data.append('type', "csv")
        data.append('file',this.state.data.file);
        const config={
            headers:{
                'content-type': 'multipart/form-data'
            }
        }
        // console.log(data)
        const {data:csv_data} = await axios.post('http://localhost:1919/api/csv',data,config);
        console.log(csv_data)
        this.setState({csv_data:csv_data});
        this.setState({showdata:true});
    }
    render() {
        const columns = [];
        
        const csv_data =this.state.csv_data === undefined ? [[1],[1]] : this.state.csv_data;
        const length = csv_data[0].length === undefined ? 0 : csv_data[0].length; 
        for(var i=0; i<length; i++) {
            columns.push({id:i,label:csv_data[0][i],minWidth:100})
        }
        
        
        return (
            <div className="container-fluid d-flex flex-column align-items-center">
                 <div className="body-wrapper">
                     <h1 className="title_">Upload CSV File</h1>
                     <div className="row container-fluid d-flex justify-content-center mt-4 mb-4">
                         <label for="file">
                            <Button variant="contained" component="span" className="button_"> Select</Button>
                         </label>
                         <input type="file" id="file" name="file" onChange={this.handleRadio} style={{display:"none"}} />
                         <Button onClick={this.onClickHandler} variant="contained" component="span" className="button_ ml-5">Load</Button>
                     </div>
                 </div>
                 {this.state.showdata && 
                 <div className="table-wrapper">
                    <Paper style={{width: '100%'}}>
                        <TableContainer style={{maxHeight:"240  "}}>
                            <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    >
                                    {column.label}
                                    </TableCell>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {csv_data[1].map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                        <TableCell key={column.id}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                        );
                                    })}
                                    </TableRow>
                                );
                                })}
                            </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={csv_data[1].length}
                            rowsPerPage={this.state.setrow}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>

                 </div>
                 }
            </div>
        );
    }
}

export default Homepage;