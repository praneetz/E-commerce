window.onload=()=>{
    var form = document.getElementById("regis-form");
    var pristine = new Pristine(form);
    form.addEventListener("submit",(e)=>{
        e.preventDefault()
        console.log(pristine.validate());
    })

}