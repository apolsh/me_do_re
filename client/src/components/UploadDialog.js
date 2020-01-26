import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AttachFile from "@material-ui/icons/AttachFile";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme =>({
    input: {
        display: 'none',
    },
    container: {
        display: 'table-cell',
        verticalAlign: 'middle'
    }
});



class UploadDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title:'',
            authors:'',
            year: new Date().getFullYear(),
            fileName:'',
            file:{},
            errors:{
                title:'',
                authors: '',
                year:'',
                file:''
            }
        }
    }


    validateForm(isSaving)
    {
        let REGEX = /^([\s:а-яА-Яa-zA-Z0-9/(),._"-]{3,256})$/;
        let isError = false;
        const {title, authors, year, file} = this.state;

        const cantBeEmpty = "не может быть пустым";
        const wrongSymbols = "разрешенные символы А-Я A-Z 0-9 . , _ / ( ) \" - от 3 до 256 символов";

        this.setState({
            errors:{
                title:'',
                authors: '',
                year:'',
                file:''
            }
        });

        const error = (error) => {
            isError = true;
            const errors = this.state.errors;
            Object.assign(errors,error);
            this.setState({
                errors
            })
        };


        if (isSaving) {
            //checking title
            if (title === "") {
                error({title: cantBeEmpty})
            } else {
                if (!REGEX.test(title)) {
                    error({title: wrongSymbols})
                }
            }
            //checking title
            if (authors === "") {
                error({authors: cantBeEmpty})
            } else {
                if (!REGEX.test(authors)) {
                    error({authors: wrongSymbols})
                }
            }
            //checking title
            if (year > new Date().getFullYear() || year < 1900) {
                error({year: 'Неверно указан год'})
            }
            //checking file
            if (file.size) {
                if(file.size > 16777215)
                    error({file: 'Размер файла превышает максимальное значение в 16mb'})
            } else {
                error({file: 'Нельзя загружать пустые документы'})
            }
        }
        return isError;

    }


    onFileSelect = event =>{
        const file = event.target.files[0];

        this.setState({
            fileName: file.name,
            file: file
        });

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        }, () => {
            this.validateForm(false)
        });

    };

    handleClose=()=>
    {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    handleSave=()=>
    {
        const {title, authors, year, file} = this.state;
        if (!this.validateForm(true) && this.props.onSave) {
            if (this.props.onSave) {
                this.props.onSave({title, authors, year, file});
            }
        }
    };

    render(){
        const {isOpen, classes} = this.props;
        const {title, authors, year, fileName,errors} = this.state;
        return (
            <div>
                <Dialog open={isOpen}
                        aria-labelledby="upload-dialog-title"
                        aria-describedby="upload-dialog-description"
                        >
                    <DialogTitle id="upload-dialog-title">{"Загрузка нового документа"}</DialogTitle>
                    <DialogContent id="upload-dialog-description">
                        <div>
                        <TextField label="Наименование документа"
                                   placeholder="Введите наименование загружаемого документа"
                                   helperText={errors.title}
                                   fullWidth
                                   margin="normal"
                                   onChange={this.handleChange('title')}
                                   value={title}
                                   error={errors.title !== ""}
                        />
                        <TextField label="Авторы"
                                   placeholder="Введите ФИО авторов документа, через запятую"
                                   helperText={errors.authors}
                                   fullWidth
                                   margin="normal"
                                   onChange={this.handleChange('authors')}
                                   value={authors}
                                   error={errors.authors !== ""}
                        />
                        <TextField label="Год издания"
                                   placeholder="Введите год издания"
                                   helperText={errors.year}
                                   type="number"
                                   defaultValue={year}
                                   margin="normal"
                                   style={{width: '100px'}}
                                   onChange={this.handleChange('year')}
                                   error={errors.year !== ""}
                        />
                        </div>
                        <div>



                                    <input onChange={this.onFileSelect} className={classes.input} id="icon-button-file1" type="file" />
                                    <label htmlFor="icon-button-file1" >
                                        <Tooltip title="Прикрепить файл">
                                        <IconButton color="primary"
                                                    aria-label="Загрузить документ"
                                                    component="span">
                                            <AttachFile/>
                                        </IconButton>
                                        </Tooltip>
                                    </label>
                                {
                                    fileName.length > 0 ? (
                                        <Typography style={{width:'400px', marginTop:'20px'}}>
                                            {`Выбран документ: ${fileName}`}
                                        </Typography>

                                    ) : null
                                }
                            {
                                errors.file.length > 0 ?
                                <Typography color="secondary" style={{marginTop:'20px'}}>
                                    {errors.file}
                                </Typography> : null
                            }

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            Отмена
                        </Button>
                        <Button  disabled={!fileName} onClick={this.handleSave} color="primary">
                            Загрузить
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default withStyles (styles) (UploadDialog)