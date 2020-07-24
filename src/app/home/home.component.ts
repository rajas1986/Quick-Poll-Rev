import { Component, OnInit } from '@angular/core';
import { FormGroup, Form } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PollService } from '../services/poll.service';

export interface poll {
  PollId: string;
  QText: string;
  Response: string;
  options: [];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  results = ' Results';
  polls;
  odataPolls = [];
  odataSummary = [];
  submittedPolls = {};
  csrfToken = '';
  lastPollId = '';

  constructor(private http: HttpClient, private pollService: PollService) {}
  ngOnInit(): void {
    // this.polls = this.pollService.getQuestions();
    // // console.log(this.polls);
    // this.polls.forEach((poll) => {
    //   this.submittedPolls[poll.pollName] = false;
    // });

    // *Working with odata
    this.getPollData();
    this.getPollSummary();
    // console.log(this.polls);
    //console.log(this.submittedPolls);
  }

  getPollData() {
    this.pollService.getPollsData().subscribe((response: any) => {
      //console.log(response);
      this.csrfToken = response.headers.get('X-CSRF-Token');
      //console.log(this.csrfToken);
      //console.log(res.d.results[0].NavGetPollHdrToQues.results);
      // *Making an object of questions
      let questionSet: Array<any>;
      if(response.body.d.results.length>0){
        questionSet =
        response.body.d.results[0].NavGetPollHdrToQues.results;
        questionSet.forEach((Que) => {
          //console.log(Que)
          let questionObj = {};
          this.lastPollId = Que.PollId;
          questionObj['PollId'] = Que.PollId;
          questionObj['QText'] = Que.QText;
          questionObj['PollName'] = Que.PollName;
          questionObj['Response'] = Que.Response;
          questionObj['options'] = [];
          this.submittedPolls[Que.PollId] = false;

          //* Here the question object has been made
          this.odataPolls.push(questionObj); //*Now each object is pushed into the poll
        });
      }
      
      // console.log(this.odataPolls);

      // *Now Pushing the options into the each question object of poll
      let optionSet;
      if(response.body.d.results.length>0){
        optionSet = response.body.d.results[0].NavGetPollHdrToOptions.results;
        //console.log(optionSet);
        optionSet.forEach((option) => {
          //console.log(option);
          this.odataPolls.forEach((poll, index) => {
            if (poll.PollId == option.PollId) {
              let Option = {};
              Option['OptionText'] = option.OptionText;
              Option['OptionValue'] =
                option.OptionValue;
              this.odataPolls[index]['options'].push(Option);
              // console.log(this.odataPolls[index]);
            }
          });
        });
      }
      
      // console.log(this.odataPolls);
    });
  }
  getPollSummary() {
    this.odataSummary = [];
    this.pollService.getPollSummary().subscribe((res: any) => {
      // console.log(res);
      if(res.d.results.length>0){
        res.d.results[0].NavGetPollSumHdrToQues.results.forEach(
          (Que) => {
            let questionObj = {};
            questionObj['PollId'] = Que.PollId;
            questionObj['QText'] = Que.QText;
            questionObj['PollName'] = Que.PollName;
            questionObj['Response'] = Que.Response;
            questionObj['options'] = [];
  
            this.odataSummary.push(questionObj);
          }
        );
      }
      
      // console.log(this.odataSummary);
      if(res.d.results.length>0){
        res.d.results[0].NavGetPollSumHdrToOptions.results.forEach(
          (option) => {
            // console.log(option);
  
            this.odataSummary.forEach((poll, index) => {
              if (poll.PollId == option.PollId) {
                let Option = {};
                Option['OptionText'] =
                  option.OptionText;
                Option['Cnt'] = option.Cnt;
                Option['Pct'] = option.Pct;
                Option['Response'] = option.Response;
                this.odataSummary[index]['options'].push(Option);
                // console.log(this.odataPolls[index]);
              }
            });
          }
        );
      }
      
      console.log(this.odataSummary);
    });
  }
  checkPollStatus(poll) {
    console.log(poll);
    return true;
  }
  OnSubmit(form, poll) {
    console.log(form);
    console.log(poll);
    //console.log(this.lastPollId);
    this.postData(form, poll); //* Send the data to backend
  }
  postData(form, poll) {
    //console.log(form.controls.questionControl.value);
    let postVal = {
      'PollId': poll.PollId,
      'Response': form.controls.questionControl.value
    };
    
    // ? Here we can call the post data api.
    // ? After posting the data destroy the submitted 
    this.pollService.postPollsData(JSON.stringify(postVal), this.csrfToken).subscribe(
      (data) => { 
        if (Object.keys(data.d).length === 0) {
          console.log("Error while submitting data");
        } else {
          this.submittedPolls[poll.PollId] = true; //*Destroying the component
          //if(this.lastPollId==poll.PollId){
            this.getPollSummary();
          //}
        }
      }
    );
    // ?Call the getPollSummary() function again so that the results get updated.
  }
}
