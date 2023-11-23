let localarray;

document.addEventListener("DOMContentLoaded", function () {
    loadFromLocalStorage();
    loadQuestionForm(); 

});

var newqbutton = document.getElementById("newqbtn");

newqbutton.addEventListener("click", loadQuestionForm);

// LOADING QUESTION FORM 

function loadQuestionForm() {
    var questionFormContainer = document.getElementById("user-interaction");
    questionFormContainer.innerHTML = "";

    var heading = document.createElement("h2");
    heading.innerHTML = "Welcome To Discussion Portal";
    heading.id = "heading";
    questionFormContainer.appendChild(heading);

    var subHeading = document.createElement("h5");
    subHeading.innerHTML = "Enter a subject and question to get started";
    subHeading.id = "sub-heading";
    questionFormContainer.appendChild(subHeading);

    var subject = document.createElement("input");
    subject.type = "text";
    subject.id = "subject";
    subject.placeholder = "Subject";
    questionFormContainer.appendChild(subject);

    questionFormContainer.appendChild(document.createElement("br"));

    var question = document.createElement("textarea");
    question.rows = 6;
    question.cols = 60;
    question.id = "question";
    question.style.marginTop = "10px";
    question.placeholder = "Ask your question here...";
    questionFormContainer.appendChild(question);

    questionFormContainer.appendChild(document.createElement("br"));

    var submitButton = document.createElement("input");
    submitButton.type = "button";
    submitButton.value = "Submit";
    submitButton.style.color = "white";
    submitButton.style.fontSize = "14px";
    submitButton.style.backgroundColor = " #0069D9";
    submitButton.style.border = " 1px solid #92C7FF"
    submitButton.style.alignSelf = "right";
    questionFormContainer.appendChild(submitButton);

    submitButton.addEventListener("click", function () {
        if (subject.value.trim() !== "" && question.value.trim() !== "") {
            newQuestion(subject.value, question.value);
            subject.value = '';
            question.value = '';
        }
    });
}

// LOADING  QUESTIONS FROM LOCAL STORAGE

function loadFromLocalStorage() {
    var questionListContainer = document.getElementById("question-list");
    questionListContainer.innerHTML = "";

    localarray = JSON.parse(localStorage.getItem('question')) || [];
    
    // loading starred question first

    localarray.forEach(function (questionobj) {
        if(questionobj.resolve === false && questionobj.star === true){
            addQuestionToList(questionobj);
        } 
    });

    // loading non starred question next

    localarray.forEach(function (questionobj) {
        if(questionobj.resolve === false && questionobj.star === false){
            addQuestionToList(questionobj);
        } 
    });
 
}

// SAVING INTO THE LOCAL STORAGE 

function saveToLocalStorage(questionArr) {
    localStorage.setItem("question", JSON.stringify(questionArr));
}

// QUESTION ADDING TO THE QUESTION LIST

function addQuestionToList(questionobj) {
    var questionlist = document.getElementById("question-list");

    var newDiv = document.createElement("div");
    newDiv.id = questionobj.quesid;
    newDiv.classList.add("Test");
    newDiv.style.borderBottom = "1px solid grey";
    questionlist.appendChild(newDiv);

    // ADDING EVENTLISTNER TO THE QUESTION 

    newDiv.addEventListener("click", function(){
        var uidiv = document.getElementById("user-interaction");
        uidiv.innerHTML = "";
        
        var divforques = document.createElement("div");
        uidiv.appendChild(divforques);

        var qh = document.createElement("h2");
        qh.innerText = "Question";
        qh.style.color = "grey";
        divforques.appendChild(qh);

        var s = document.createElement("h4");
        s.innerText = questionobj.subject;
        s.style.marginTop = "-10px";
        s.style.marginLeft = "20px";
        divforques.appendChild(s);

        var q = document.createElement("p");
        q.innerText = questionobj.question;
        q.style.fontSize = "14px";
        q.style.marginTop = "-15px";
        q.style.marginLeft = "20px";
        divforques.appendChild(q);

        var resolvebutton = document.createElement("input")
        resolvebutton.type = "button";
        resolvebutton.value = "Resolve";
        resolvebutton.style.fontSize = "14px";
        resolvebutton.style.backgroundColor = "#0069D9"
        resolvebutton.style.color = "white";
        resolvebutton.style.border = "1px solid #92C7FF";
        resolvebutton.style.padding = "4px 10px 4px 10px";
        resolvebutton.style.borderRadius = "3px";
        resolvebutton.style.marginLeft = "70%";
        divforques.appendChild(resolvebutton);

        // ADDING EVENTLISTENER TO THE RESOLVE BUTTON

        resolvebutton.addEventListener("click", function(){
               questionobj.resolve = true;
               newDiv.remove();
               loadQuestionForm();
               localarray.forEach( function(value){  
                  if(questionobj.id === value.id){
                    value.resolve = true;
                  }
               })
               saveToLocalStorage(localarray);
        })
        
        // RESPONSE  SECTION CREATION 
        var rh = document.createElement("h2");
        rh.innerText = "Responses";
        rh.style.color = "grey";
        uidiv.appendChild(rh);

        var divforresponse = document.createElement("div");
        divforresponse.style.height = "150px"
        divforresponse.style.width = "80%";
        divforresponse.style.overflow = "auto";
        divforresponse.style.backgroundColor = "#F5F5F5";
        uidiv.appendChild(divforresponse);

        // LOADING RESPONSES FROM LOCAL STORAGE
        
        loadResponsesFromLocalStorage(questionobj,divforresponse);   

        // ADD RESPONSE INPUT SECTION
        
        var rih = document.createElement("h2");
        rih.innerText = "Add Responses";
        rih.style.color = "grey";
        uidiv.appendChild(rih);

        var nameresp = document.createElement("input");
        nameresp.placeholder = "Name";
        uidiv.appendChild(nameresp);

        let br = document.createElement("br");
        uidiv.appendChild(br);

        var responseresp = document.createElement("textarea");
        responseresp.style.marginTop = "10px";
        responseresp.placeholder = "Add your Response here..";
        responseresp.rows = "5";
        responseresp.cols = "80";
        uidiv.appendChild(responseresp);

        
        var addresponsebtn = document.createElement("input")
        addresponsebtn.type = "button";
        addresponsebtn.value = "Respond";
        addresponsebtn.style.fontSize = "14px";
        addresponsebtn.style.backgroundColor = "#0069D9"
        addresponsebtn.style.color = "white";
        addresponsebtn.style.border = "1px solid #92C7FF";
        addresponsebtn.style.padding = "4px 10px 4px 10px";
        addresponsebtn.style.borderRadius = "5px";
        addresponsebtn.style.marginLeft = "70%";
        uidiv.appendChild(addresponsebtn);

        // ADDING EVENTLISTNER TO THE THE RESPOND BUTTON
        
        addresponsebtn.addEventListener("click", function(){
            if(nameresp.value.trim() !== "" && responseresp.value.trim() !== ""){
                questionobj = createResponse(nameresp.value, responseresp.value,questionobj);  // calling function to create response object 
                nameresp.value = '';
                responseresp.value = '';
                let lastResponseobj = questionobj.response[questionobj.response.length - 1];
                responseToDiv(lastResponseobj,divforresponse,questionobj); // adding response to div in form
               
            } 
           
            localarray.forEach( function(value){
                if(questionobj.quesid === value.quesid){
                    localarray.value = questionobj;
                }
            })
            saveToLocalStorage(localarray);    // saved changes to the local storage after new response is created
        })
    })

    // TIME OF QUESTION LOGIC  

    var timeofques = document.createElement("label");
    timeofques.classList.add("test");
    newDiv.appendChild(timeofques);

   
    timeFromUpload(questionobj.quesid, timeofques);
    timeofques.style.color = "grey";
    timeofques.style.fontSize = "10px";
    timeofques.style.marginLeft = "90%";
    
    setInterval(function () {
        timeFromUpload(questionobj.quesid, timeofques);
        }, 60000); 

    

    var subhed = document.createElement("h3");
    subhed.innerText = questionobj.subject;
    newDiv.appendChild(subhed);

    var queshed = document.createElement("p");
    queshed.innerText = questionobj.question;
    newDiv.appendChild(queshed);

// QUESTION STARRING LOGIC
    
    var starbutton = document.createElement("label");  // empty star button
    starbutton.innerText = "\u2606";
    starbutton.style.fontSize = "30px";
    starbutton.style.marginLeft = "95%";
    newDiv.appendChild(starbutton);

    starbutton.addEventListener("click", function(event) { // event listener for empty star
        favourite.style.display = "inline";
        starbutton.style.display = "none";
        questionobj.star = true;
        questionlist.insertBefore(newDiv,questionlist.firstChild); // to put the starred message to the top of the list
        event.stopPropagation();

        localarray.forEach( function(value){
            if(questionobj.quesid === value.quesid){
                localarray.value = questionobj;
            }
        })
        saveToLocalStorage(localarray); 
    });

    var favourite = document.createElement("label"); // filled star button
    favourite.innerHTML = "&#x2605;";
    favourite.style.fontSize = "30px";
    favourite.style.marginLeft = "95%";
    favourite.style.display = "none";
    newDiv.appendChild(favourite);


    favourite.addEventListener("click", function(event) { //eventlistener for filled star
        starbutton.style.display = "inline";
        favourite.style.display = "none";
        questionobj.star = false;
        questionlist.appendChild(newDiv);
        event.stopPropagation();

        localarray.forEach( function(value){
            if(questionobj.quesid === value.quesid){
                localarray.value = questionobj;
            }
        })
        saveToLocalStorage(localarray); 
    });

    // condition check for (when loading from local storage) which star to display

    if (questionobj.star === true){
        favourite.style.display = "inline";
        starbutton.style.display = "none";
    }

    else{
        favourite.style.display = "none";
        starbutton.style.display = "inline";
    }
}

function newQuestion(subjectField, questionField) {
    let questionobj = {
        question: questionField,
        subject: subjectField,
        quesid: Date.now(),
        response: [],
        resolve: false,
        star: false
    }
    localarray.push(questionobj);
    saveToLocalStorage(localarray);
    addQuestionToList(questionobj);
}

// FUNCTION FOR CREATING RESPONSE OBJECT AND RETURNING NEW OBJECT AFTER MAKING CHANGES

function createResponse(nameresp,responseresp,questionobj){
     var newresponseobj = {
        name: nameresp,
        response: responseresp,
        respid: Date.now(),
        upvote: 0,
        downvote: 0
    }

    questionobj.response.push(newresponseobj);
    return questionobj;
}

//FUNCTION TO ADD RESPONSES AS A DIV INTO THE DIV CONTAINER 

function responseToDiv(responseobj,divforresponse,questionobj){
    var respdiv = document.createElement("div");
    respdiv.id = responseobj.respid;
    respdiv.style.display = "inline";
    respdiv.style.height = "50%";
    divforresponse.appendChild(respdiv);

    var name = document.createElement("h4");
    name.innerText = responseobj.name;
    name.style.marginLeft = "15px"
    name.style.marginBottom = "-15px"
    respdiv.appendChild(name);

    var response = document.createElement("p");
    response.style.marginLeft = "15px";
    response.innerText = responseobj.response;

    response.appendChild(document.createElement("br"));

    // UPVOTE AND DOWNVOTE LOGIC

    var upvotecount = document.createElement("label");   // element to display upvote count
    upvotecount.innerText = responseobj.upvote;
    upvotecount.style.marginLeft = "80%";
    upvotecount.style.fontSize = "20px";
    response.appendChild(upvotecount);

    var upvote = document.createElement("input")
    upvote.type="button";
    upvote.style.borderRadius = "50%";
    upvote.value = "⇧";
    upvote.style.marginLeft = "5px";
    response.appendChild(upvote);

    upvote.addEventListener("click", function(){   //eventlistener for upvote button
        responseobj.upvote += 1;  
        upvotecount.innerText = responseobj.upvote;
        saveToLocalStorage(localarray);
        divforresponse.innerHTML = "";
        loadResponsesFromLocalStorage(questionobj,divforresponse);
    });

    var downvotecount = document.createElement("label"); // element to display downvote count 
    downvotecount.innerText = responseobj.downvote;
    downvotecount.style.fontSize = "20px";
    downvotecount.style.marginLeft = "5px";
    response.appendChild(downvotecount);

    var downvote = document.createElement("input")
    downvote.type="button";
    downvote.style.borderRadius = "50%";
    downvote.value = "⇩";
    downvote.style.marginLeft = "5px";
    response.appendChild(downvote);

    downvote.addEventListener("click", ()=>{
        responseobj.downvote += 1;
        downvotecount.innerText =  responseobj.downvote;
        saveToLocalStorage(localarray);

    })
    respdiv.appendChild(response);
}

// LOADING RESPONSES FROM LOCAL STORAGE

function loadResponsesFromLocalStorage(questionobj,divforresponse){
    localarray.forEach( function(value){

        if(value.quesid === questionobj.quesid)
        {
          var array =  value.response.sort( function(a,b){   // sorting array according to upvotes
                const A = a.upvote;
                const B = b.upvote;
                return B - A;  
           })

           array.forEach( function(responseobj){
                responseToDiv(responseobj,divforresponse,questionobj);
            });
            return;   
        }
    });
}

// SEARCHING QUESTION LOGIC  

var searchbar = document.getElementById("searchbar");
var qc = document.getElementById("question-list");

searchbar.addEventListener("input", function(event) {

    var svalue = event.target.value.toLowerCase();
    var matchingResults = false;

    qc.innerHTML = ""; 

    localarray.forEach(function(value) {
        if (value.question.toLowerCase().includes(svalue) || value.subject.toLowerCase().includes(svalue)) {
            addQuestionToList(value);

            var content =  qc;
            var obj = new Mark(content);
            obj.mark(svalue);

            matchingResults = true;
        }
    });

    if (matchingResults === false && svalue.trim() === "") {
        loadFromLocalStorage();  
    } else if (!matchingResults) {
        qc.innerHTML = "<h3>No Results Found</h3>";
    }
});

// FUNCTION TO CALCULATE THE TIME FROM WHEN IT WAS ADDED

function timeFromUpload(dateOfUpload, timeofques) {
    
    var currentDate = Date.now();
    var timeDifference = currentDate - dateOfUpload;

    // Convert the time difference to minutes, hours, days, and months

    var minutesDifference = Math.floor(timeDifference / (1000 * 60));
    var hoursDifference = Math.floor(minutesDifference / 60);
    var daysDifference = Math.floor(hoursDifference / 24);
    var monthsDifference = Math.floor(daysDifference / 30); 

    
    if (monthsDifference > 0) {
        timeofques.innerHTML= monthsDifference + " months ago";
    } else if (daysDifference > 0) {
        timeofques.innerHTML = daysDifference + " days ago";
    } else if (hoursDifference > 0) {
        timeofques.innerHTML = hoursDifference + " hours ago";
    } else if (minutesDifference >= 1) {
        timeofques.innerHTML = minutesDifference + " minutes ago";
    } else {
        timeofques.innerHTML = "few seconds ago";
    }
}
  