const axios = require('axios');

export default class Api {
    constructor(url = 'http://localhost:3001/api/'){
        this.url = url;
    }
    //Получение факультетов и дисциплин
    async getFaculties(){
        return axios.get(this.url + 'getFaculties')
            .then(resp=>resp.data)
    }
    //Получение документов, прикрепленных к определенному факультету и дисциплине
    async getDocuments(faculty, discipline){
        return axios.get(this.url + 'getDocuments/' + faculty + '/' + discipline).then(resp=>resp.data.documents);
    }

    async postDocument(doc){
        let formData = new FormData();
        formData.append("file", doc.file);
        formData.append("title", doc.title);
        formData.append("authors", doc.authors);
        formData.append("year", doc.year);
        formData.append('discipline', doc.discipline);
        formData.append('faculty', doc.faculty);
        return axios.post(this.url + 'uploadDocument', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    async downloadDocument(documentId){
        return axios.get(this.url + 'download/' + documentId);
    }

    async deleteDocument(documentId){
        return axios.delete(this.url + 'delete', {
            data: {
                id: documentId,
            },
        })
    }

}