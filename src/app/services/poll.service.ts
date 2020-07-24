import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    'Pragma': 'no-cache',
    //'Authorization': 'Basic ' + btoa('P50002103:1q1q1q'),
    'Expires': '0',
    'X-CSRF-Token': 'fetch'
  })
};

let newheaders = { 
  'Content-Type':  'application/json', 
  //'Authorization': 'Basic ' + btoa('P50002103:1q1q1q'),
  'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
  'Pragma': 'no-cache',
  'Expires': '0'
}

const newHttpOptions  = {
  headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      //.set('Authorization', 'Basic ' + btoa('P50002103:1q1q1q'))
      .set('X-CSRF-Token' , 'fetch'),
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private http: HttpClient) {}

  getPollsData() {
    //return this.http.get('http://localhost:3000/polls');
    return this.http.get('/sap/opu/odata/sap/ZPOLL_SRV/GetPollHdrSet?$expand=NavGetPollHdrToQues,NavGetPollHdrToOptions&$filter=Mode%20eq%20%27DIS%27', newHttpOptions);
  }
  getPollSummary() {
    //return this.http.get('http://localhost:3000/pollSummary');
    return this.http.get('/sap/opu/odata/sap/ZPOLL_SRV/GetPollSumHdrSet?$expand=NavGetPollSumHdrToQues,NavGetPollSumHdrToOptions&$filter=Mode%20eq%20%27DIS%27', httpOptions);
  }

  postPollsData(postData, csrfToken): any {
    newheaders['X-CSRF-Token'] = csrfToken;
    //console.log(newheaders);
    const httpOptions = new HttpHeaders(newheaders);
    //console.log(postData);
    return this.http.post<any>('/sap/opu/odata/sap/ZPOLL_SRV/SavePollRespSet', postData, {headers: httpOptions});
  }

  getQuestions() {
    let questions = [
      {
        pollName: 'COVID-19',
        QuesId: 'COVID-19',
        QuesText:
          'How would you rate the helps provided by Reliance in fighting COVID-19?',
        options: [
          { key: 'excellent', value: 'Excellent' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unsatisfactory', value: 'Unsatisfactory' },
        ],
      },
      {
        pollName: 'WORLD CUP',
        QuesId: 'WORLD CUP',
        QuesText:
          'Which country do you think will win the next FIFA World Cup?',
        options: [
          { key: 'Gr', value: 'Germany' },
          { key: 'Fr', value: 'France' },
          { key: 'Ar', value: 'Argentina' },
          { key: 'Eng', value: 'England' },
          { key: 'None', value: 'None of the above' },
        ],
      },
    ];

    return questions;
  }
}
