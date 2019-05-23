const url = "https://chatbot-dielanophals.herokuapp.com";

var btnSignup = document.querySelector(".signup button").addEventListener("click", function(e) {
    let email = document.querySelector('#email').value;
    let firstname = document.querySelector('#firstname').value;
    let lastname = document.querySelector('#lastname').value;
    let password = document.querySelector('#password').value;

    if(email === ""){
        let feedback = document.querySelector(".alert");
        feedback.textContent = "Enter an email!";
        feedback.classList.remove('hidden');
    }else if(password === ""){
        let feedback = document.querySelector(".alert");
        feedback.textContent = "Enter a password!";
        feedback.classList.remove('hidden');
    }else{
        fetch(url + "/users/signup", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": email,
            "firstname": firstname,
            "lastname": lastname,
            "password": password
        })
    }).then(response =>{
        return response.json();
    }).then(json => {
        if(json.status == "succes"){
            let token = json.data.token;
            localStorage.setItem("firstname", firstname);
            localStorage.setItem("token", token);
            window.location.href = "chat.html";
        }
    }).catch(err => {
        console.log(err)
    })
    }
});