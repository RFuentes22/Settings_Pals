let app = {
    init: function () {
        this.addEvents();
        this.updateUser();
    },
    addEvents: function () {
        let loadContent = function () {
            fetch("/post")
                .then(res => res.json())
                .then(data => {
                    let posts = document.getElementsByClassName("posts")[0];
                    posts.innerHTML = data.reduce((cadena, element) => {
                        return cadena +
                            ` 
                            <article class="post-article">
                <p class="info-post">${element.post}</p>
                <button class="btn-ice"><i class="far fa-snowflake"></i></button>
            </article>
                            `
                    }, "");

                });
        }

        loadContent();

    },
   //update user
   updateUser: function (req,res) {
    document.update.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let data = {
            name: document.update.name.value,
            lastName: document.update.lastName.value,
            email: document.update.email.value,
            username: document.update.username.value,
            password: document.update.password.value
        }
        //peticion
        fetch('/settings'  , {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(res => {
                alert("Usuario Actualizado con exito");
                
            })
            .catch(err => {
                alert("Por favor revise los datos ingresados");
                console.log(err);
            });
    });

}
    
};
window.onload = () => app.init();