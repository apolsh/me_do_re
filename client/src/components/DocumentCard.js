import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import {CardContent, Paper} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Delete from '@material-ui/icons/Delete';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Api from "../Api";


const styles = theme => ({
    card:{
        width: '80%',
        paddingLeft: '10%',
        marginTop: '5px'
    }
});

class DocumentCard extends Component {
    constructor(props){
        super(props);
        this.api = new Api();
    }


    downloadDocument=()=>{
        const {_id} = this.props.docParams;
        let aNode = window.document.createElement('a');
        window.document.body.appendChild(aNode);
        aNode.setAttribute("target", "_blank");
        aNode.setAttribute("rel", "noopener noreferrer");
        aNode.setAttribute("href", 'http://localhost:3001/api/download/' + _id);
        aNode.click();
        window.document.body.removeChild(aNode);
    };

    deleteDocument=()=>{
        const {_id} = this.props.docParams;
        this.api.deleteDocument(_id);
        this.props.onUpdate && this.props.onUpdate();
    };

    render(){
        const {classes} = this.props;
        const {_id, title, authors, year} = this.props.docParams;

        return (
                <Card style={{margin: '10px'}}>
                    <CardContent>
                        <Typography variant='subtitle2' style={{display: 'block', float: 'left', width:'300px', paddingLeft:'10px', paddingRight:'50px'}}>
                            {title}
                        </Typography>
                        <Typography variant='subtitle2' style={{display: 'block', float: 'left', width:'300px', paddingLeft:'10px', paddingRight:'50px'}}>
                            {authors}
                        </Typography>
                        <Typography variant='subtitle2' style={{display: 'block', float: 'left', width:'70px', paddingLeft:'10px', paddingRight:'50px'}}>
                            {year}
                        </Typography>

                        <Tooltip style={{float:'right'}} title="Удалить документ">
                            <IconButton
                                color='secondary'
                                onClick={this.deleteDocument}
                            >
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip style={{float:'right'}} title="Скачать документ">
                            <IconButton
                                color='primary'
                                onClick={this.downloadDocument}
                            >
                                <ArrowDownward/>
                            </IconButton>

                        </Tooltip>
                    </CardContent>

                </Card>
        );
    }

}

export default withStyles(styles) (DocumentCard)