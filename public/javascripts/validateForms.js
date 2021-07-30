        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (function () {
            'use strict'
            bsCustomFileInput.init();//call to library added to boilerplate.js file to handle multiple file inputs to a form so any custom file inputs will be initialized with some very basic javascript functionality--lecture 535
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.validated-form')
          
            // Loop over them and prevent submission
            Array.from(forms)
              .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                  if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                  }
          
                  form.classList.add('was-validated')
                }, false)
              })
          })()