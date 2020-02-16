import axios from 'axios';
import { parseResponse } from '../utils/Utils';

//TODO: Be aware where the port is going to be
//const instance = axios.create({ baseURL: 'http://35.190.131.104:8888' })
//const instance = axios.create({ baseURL: 'http://localhost:8888' }) // this is for blockchain
const instanceDefault = axios.create({ baseURL: 'http://localhost:8889' }); // this is for firebase
/**
 * This File is for parsing and anything processing middleware with diferent directions
 */
export default {
    files: {
        uploadBlob: input => {
            console.log('UPLOAD BLOB API');
            console.log(input)
            let headersFiles = { 'Content-Type': 'multipart/form-data' }
            return instanceDefault.post('/uploadFiles', input, { headers: headersFiles })
        }
    }
}
