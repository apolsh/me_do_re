import React, { Component } from "react";
import Api from './Api';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CloudUpload from '@material-ui/icons/CloudUpload';
import Paper from "@material-ui/core/Paper";
import DocumentCard from "./components/DocumentCard";
import UploadDialog from "./components/UploadDialog";
import Card from "@material-ui/core/Card";

const styles = theme => ({
  selectPanel:{
    width:'100%'
  },
  panelSelectDiv:{
    width: '20%',
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  input: {
    display: 'none',
  },
});


class App extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      faculties: [],
      disciplines: [],
      selected:{
        faculty: 0,
        discipline: ''
      },
      documents:[],
      uploadDialogActive: false,
      bodyMessage: 'Для данной дисциплины отсутствуют загруженные документы'
    }
  }

  componentDidMount() {
    this.getFaculties();
  }

  getFaculties=()=>{
    this.api.getFaculties()
        .then(data=>{
            this.setState(prevState=>{
              const selectedFac = prevState.selected.discipline;

              return {
                ...prevState,
                faculties: data,
                disciplines: [],
              }
            })
          })
        .catch(err=>window.alert('Ошибка связи с сервером'));
  };

  handleFacultySelect=(event,child)=>{
    const {faculties} = this.state;

    this.setState(prevState=>{
      return{
        disciplines: faculties[child.key].disciplines,
        selected: {
          faculty: event.target.value,
          discipline: null
        }
      }

    })
  };

  handleDisciplineSelect=(event)=>{
    const discipline = event.target.value;

    this.setState(prevState=>({
      selected: {
        ...prevState.selected,
        discipline: discipline
      }
    }), this.getDocuments)
  };

  getDocuments = ()=>{
    const{faculty, discipline} = this.state.selected;
    this.api.getDocuments(faculty, discipline)
        .then(documents=>{
          this.setState({
            documents: documents
          })
        })
        .catch(err=>window.alert('Ошибка связи с сервером'));
  };

  uploadDocuments = doc=>{
    const {faculty,discipline} = this.state.selected;
    doc.faculty = faculty;
    doc.discipline = discipline;
    this.api.postDocument(doc)
        .then(()=>this.setState({uploadDialogActive:false}))
        .catch(err=>window.alert('Ошибка связи с сервером'));
  };

  render() {
    const {faculties, disciplines,selected, documents, uploadDialogActive, bodyMessage} = this.state;
    const {classes} = this.props;

    return (
    <div>
      <UploadDialog
        isOpen={uploadDialogActive}
        onClose={()=>this.setState({uploadDialogActive:false})}
        onSave={this.uploadDocuments}
        />
      <AppBar position="static" color={"inherit"}>
        <Toolbar>
          <div style={{height: '64px', width: '64px', position:'relative'}}>
            <svg style={{height: '64px', width: '64px', position: 'absolute', top: '25%', left:'25%'}}>
                <path
                    d="M6.66 0l.134.002h1.336c2.639 0 3.745.464 4.994 1.428 1.819 1.424 2.105 3.492 2.105 4.525 0 1.283-.393 2.638-1.356 3.742-.714.856-1.955 2.097-4.388 2.388-1.663.2-2.891.127-3.506.061v-1.306c.273.038.676.074 1.222.074 1.656 0 2.829-.827 3.543-1.719.81-.983.98-1.909 1.015-2.737h-4.555v-1.282h4.515c-.116-.866-.448-1.528-.985-2.179-1.035-1.283-2.499-1.497-3.462-1.497l-6.505-.002-.768-1.498h6.66zm-6.317 26l.804-1.564v-21.844h3.55v21.82h2.508v-8.523h3.276v8.514h2.838v-3.878c0-2.351-.122-5.622-2.77-7.311l1.542-.566c3.194 1.186 4.791 4.283 4.791 8.362v3.428l.804 1.562h-17.344z"/>
            </svg>
          </div>
          <div>
            <Typography variant='h6'>Хранение и учёт методической документации</Typography>
          </div>
          <div className={classes.panelSelectDiv}>
            <InputLabel id="faculty-label">Факультет</InputLabel>
            <Select
                className={classes.selectPanel}
                labelId="faculty-label"
                id="faculty"
                onChange={this.handleFacultySelect}
            >
              {faculties.map((fac, index)=>
                <MenuItem key={index} value={fac.symbolicName}>
                  {fac.name}
                </MenuItem>
              )}
            </Select>
          </div>

        <div className={classes.panelSelectDiv}>
          <InputLabel id="disciplines-label">Дисциплина</InputLabel>
          <Select
              className={classes.selectPanel}
              labelId="disciplines-label"
              id="disciplines"
              onChange={this.handleDisciplineSelect}
              value={selected.discipline ? selected.discipline : ''}
          >
            {disciplines.map((disc, index)=>
                <MenuItem key={index} value={disc.id}>
                  {disc.name}
                </MenuItem>
            )}
          </Select>
        </div>
          <div>
            <Tooltip title="Загрузить документ">
              <IconButton color="primary"
                          aria-label="Загрузить документ"
                          disabled={!selected.discipline}
                          component="span"
                          onClick={()=>{this.setState({uploadDialogActive:true})}}
              >
                <CloudUpload />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Paper style={{width:'1000px', marginTop: '25px'}}>
        {documents.length > 0 ?
        <div>
          <Card  style={{margin: '10px'}}>
            <Typography variant='h6' style={{display: 'block', float: 'left', width:'300px', paddingLeft:'10px', paddingRight:'70px', fontWeight:'bold'}}>
              Наименование документа
            </Typography>
            <Typography variant='h6' style={{display: 'block', float: 'left', width:'250px', paddingLeft:'10px', paddingRight:'70px', fontWeight:'bold'}}>
              Авторы документа
            </Typography>
            <Typography variant='h6' style={{display: 'block', float: 'left', width:'250px', paddingLeft:'10px', fontWeight:'bold'}}>
              Год издания
            </Typography>
          </Card>
          <div style={{display:'block'}}>
            {documents.map(doc=>
                <DocumentCard
                    docParams={doc}
                    onUpdate={()=>this.getDocuments(selected.discipline)}
                />)}
          </div>

        </div>

            :
            <Typography variant='body1' style={{top:'20%', left:'20%'}}>
              {bodyMessage}
            </Typography>
        }
      </Paper>

    </div>)
  }
}

export default withStyles(styles) (App);
