window.onload = () => {
  var form = document.getElementById("regis-form");
  var pristine = new Pristine(form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("serverError");
    errDiv.innerHTML = "";
    if (pristine.validate()) {
      const firstName = form.first_name.value;
      const lastName = form.last_name.value;
      const email = form.username.value;
      const mobile = form.mobile.value;
      const password = form.password.value;
      let body = { firstName, lastName, email, mobile, password };
      body = JSON.stringify(body);
      console.log(body);
      const result = await fetch("/register", {
        method: "post",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.status === 200) return (window.location.href = "/login");
      const {message} = await result.json();
      console.log(message)
      const errDiv = document.getElementById("serverError");
      if(!Array.isArray(message))
      {
        const newDiv = document.createElement("div");
        newDiv.innerText = message;
        errDiv.appendChild(newDiv);
        return
      }
      message.map((err) => {
        const newDiv = document.createElement("div");
        newDiv.innerText = err;
        errDiv.appendChild(newDiv);
      });
    }
  });
};
