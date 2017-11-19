(function(){
    
    class Login {
        constructor(el){
            this.$root = $(el);
            
            this.viewModel = {
                username: ko.observable(''),
                pass: ko.observable('')
            }
            
            this.viewModel.submitable = ko.computed(() => {
                return this.viewModel.username() != '' &&
                       this.viewModel.pass() != '';
            });
            
            ko.applyBindings(this.viewModel);
            
            this.$root.find('.btn').on('click', this.login.bind(this));
        }
        
        login(e){
            e.preventDefault();
            $.ajax({
                url: "/login",
                method: "POST",
                data: JSON.stringify({
                    username: this.viewModel.username(),
                    password: this.viewModel.pass()
                })
            }).done(e => {
                if(e){
                    location.href = "/dashboard";
                }
            })
            
        }
    }

    if($('.login-container').length){
        var sign = new Login('.login-container');
    }
})();
