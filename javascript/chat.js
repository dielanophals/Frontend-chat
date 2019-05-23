const url = "https://chatbot-dielanophals.herokuapp.com";

// PRIMUS LIVE
primus = Primus.connect(url, {
    reconnect: {
        max: Infinity // Number: The max delay before we try to reconnect.
            ,
        min: 500 // Number: The minimum delay before we try reconnect.
            ,
        retries: 10 // Number: How many times we should try to reconnect.
    }
});


primus.on('data', (json)=>{
  if(json.action === "addMessage"){
    appendMessage(json.data);
  }
})

/* redirect if not logged in */
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

fetch(url + "/api/v1/users", {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
}).then(result => {
  return result.json();
}).then(json => {
  json.data.users.forEach(user => {
    if(user.username !== localStorage.getItem('email')){
      var users = `
        <div class="user" data-id="${user._id}">${user.firstname} ${user.lastname}</div>
      `;
      document.querySelector(".persons").innerHTML += users;    
    }else{
      localStorage.setItem('id', user._id)
    }
  });
  console.log(json);
}).catch(err => {
  window.location.href = "login.html";
})

document.querySelector(".imdchat").addEventListener("click", e => {
  if (e.target.classList.contains("group")) {
    document.querySelector(".title__user").innerHTML = e.target.innerHTML

    localStorage.setItem("receiver", "group");

    fetch(url + '/api/v1/messages', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then(result => {
      return result.json();
    }).then(json => {
      document.querySelector(".messages").innerHTML = "";
      json.data.messages.forEach(message => {
        if(message.sender === localStorage.getItem('id')){
            var messages = `
              <div class="wrapper"><span class="message right" data-id="${message._id}">${message.text}</span><div class="edit"><p data-mes="${message._id}" class="delete">X</p><p>E</p></div></div>
            `;
        }else{
          var messages = `
          <div class="wrapper left"><span class="message" data-id="${message._id}">${message.text}</span></div>
        `;
        }
        document.querySelector(".messages").innerHTML += messages;    
      });
      console.log(json);
    }).catch(err => {
      console.log("Go away")
      //window.location.href = "login.html";
    })
      document.querySelector('.chat--form').classList.remove('hidden');
  }else if (e.target.classList.contains("user")) {
        let receiver = e.target.getAttribute("data-id");
        localStorage.setItem("receiver", receiver);
        document.querySelector(".title__user").innerHTML = e.target.innerHTML

        fetch(url + '/api/v1/messages/' + receiver, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(result => {
          return result.json();
        }).then(json => {
          document.querySelector(".messages").innerHTML = "";
          json.data.messages.forEach(message => {
          if(message.sender === localStorage.getItem('id')){
            var messages = `
              <div class="wrapper"><span class="message right" data-id="${message._id}">${message.text}</span><div class="edit"><p data-mes="${message._id}" class="delete">X</p><p>E</p></div></div>
            `;
          }else{
            var messages = `
              <div class="wrapper left"><span class="message" data-id="${message._id}">${message.text}</span></div>
            `;
          }
          document.querySelector(".messages").innerHTML += messages;    
          });
          console.log(json);
        }).catch(err => {
          console.log("Go away")
          window.location.href = "login.html";
      })
        document.querySelector('.chat--form').classList.remove('hidden');
    } else if (e.target.classList.contains("right")) {
      $(e.target).next(".edit").css({"display": "block"});
    }else if(e.target.classList.contains("delete")){
      let mes = e.target.getAttribute("data-mes");

      fetch(url + '/api/v1/messages/' + mes, {
          method: "delete",
          'headers': {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
              "messageId": mes
          })
      })
      .then(result => {
          return result.json();
      }).then(json => {
          if (json.status === "success") {
              alert("gone");
          }
          console.log(json);
      }).catch(err => {
          console.log(err)
      })
    }else{
      $(".edit").css({"display": "none"});
    }
});

//append a message to the dom
let appendMessage = (json) => {
  if(json.data.messages.sender === localStorage.getItem('id')){
    var messages = `
      <div class="wrapper"><span class="message right" data-id="${json.data.messages._id}">${json.data.messages.text}</span><div class="edit"><p data-mes="${message._id}" class="delete">X</p><p>E</p></div></div>
    `;
  }else{
    var messages = `
    <div class="wrapper left"><span class="message" data-id="${json.data.messages._id}">${json.data.messages.text}</span></div>
  `;
  }
input.value = "";
input.focus();
document.querySelector(".messages").innerHTML += messages;
}
//add a message on enter
let input = document.querySelector("#message");
input.addEventListener("keyup", e => {
  if(e.keyCode === 13){
    let text = input.value;

    fetch(url + '/api/v1/messages/', {
      method: 'post',
      'headers':{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        "text": text,
        "receiver": localStorage.getItem('receiver')
      })
    }).then(result => {
      return result.json();
    }).then(json => {
      console.log(json)
      input.value = "";
      input.focus();

      primus.write({
        "action": "addMessage",
        "data": json
      });

      //appendMessage(json);

    }).catch(err => {
      console.log(err);
    })
  }
  e.preventDefault();
})