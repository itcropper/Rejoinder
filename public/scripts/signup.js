(function(){
 
    class Signup {
        constructor(el){
            this.$root = $(el);
            
            this.viewModel = {
                tersmAndCond: ko.observable(false),
                email : ko.observable(''),
                email2 : ko.observable(''),
                badEmail2: ko.observable(''),
                pass : ko.observable(''),
                pass2 : ko.observable(''),
                username: ko.observable(''),
                badUsername: ko.observable(false)
            };
            
//            this.viewModel.username.subscribe((nv) => {
//                
//                if(nv.replace(/\s+/g,"") != nv){
//                    this.viewModel.badUsername("Username cannot contain space characters."); 
//                    return;
//                }
//                
//                var ajax;
//                setTimeout(() => {
//                    if(ajax){
//                        ajax.abort();
//                        ajax = null;
//                    } else{
//                       ajax = $.ajax({
//                           url: "/api/user/checkusername/" + nv,
//                           method: "GET"
//                       }).done((e) => {
//                           console.log(e);
//                           if(e){
//                                this.viewModel.badUsername("That username is already taken. Please chose another one.");    
//                           }else{
//                               this.viewModel.badUsername(""); 
//                           }
//                           
//                       }).always(() => {
//                           ajax = null;
//                       });
//                    }
//                }, 500);
//            });
            
//            this.viewModel.email2.subscribe((nv) => {
//                if(this.viewModel.email() != nv){
//                    this.viewModel.badEmail2('Emails do not match');
//                }
//            });
            
            this.viewModel.submitable = ko.computed(() => {
               return this.viewModel.tersmAndCond() &&
                   this.viewModel.email() != ''&&
                   this.viewModel.email2() != ''&&
                   this.viewModel.pass() != ''&&
                   this.viewModel.pass2() != ''
                   this.viewModel.username() !='';
            });
            
            this.$root.find('.btn').on('click', this.submitSignup.bind(this));
            
            ko.applyBindings(this.viewModel);
        }
        
        submitSignup(e){
            
            e.preventDefault();
            
            $.ajax({
                url: "/signup",
                method: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    username: this.viewModel.username(),
                    email: this.viewModel.email(),
                    password: this.viewModel.pass()
                })
            }).done((e) => {
                if(e){
                    location.href = "./dashboard";
                }
                console.log(e);
            })
            
        }
        
    }
    
    
    
    if($('.signup-container').length){
        var sign = new Signup('.signup-container');
    }
})();

