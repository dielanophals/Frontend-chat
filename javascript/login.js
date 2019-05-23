const url = "https://chatbot-dielanophals.herokuapp.com";

var btnLogin = document.querySelector(".login button").addEventListener("click", () => {
    let username = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    if(username === ""){
      let feedback = document.querySelector(".alert");
      feedback.textContent = "Enter an email!";
      feedback.classList.remove('hidden');
  }else if(password === ""){
      let feedback = document.querySelector(".alert");
      feedback.textContent = "Enter a password!";
      feedback.classList.remove('hidden');
  }else{
    fetch(url + '/users/login', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    }).then(response => {
      return response.json();
    }).then(json => {
      if(json.status === "success"){
        localStorage.setItem("email", username);
        let token = json.data.token;
        localStorage.setItem("token", token);
        window.location.href = "chat.html";
      }else{
        let feedback = document.querySelector('.alert');
        feedback.textContent = "Login failed!";
        feedback.classList.remove('hidden');
      }
      console.log(json)
    })
  }  
  })
  