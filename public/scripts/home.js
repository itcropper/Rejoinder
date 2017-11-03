(function(){

    let punctuation = "<<,>.?/:;\"'()!".split('');
    
    class Dashboard {
        constructor(element){
            this.$root = $(element);
            if(!this.$root.length) return;

            this.$currentPost = null;

            this.$therm = this.$root.find('.therm-container');
            this.$ticker = this.$root.closest('body').find('.ticker');
            this.initListeners();

        }

        initListeners(){
            var _this = this;

            var $jsTagsInput = this.$root.find('.js-hashtags');
            $jsTagsInput.tagsinput({
                confirmKeys: [32, 44],
                splitOn: ',',
                trimValue: true
            });
            $jsTagsInput.on('itemAdded', function(event) {
                var vals = $(this).closest('.input-group').find('.bootstrap-tagsinput').val();
              console.log(vals);
            });

            $('.bootstrap-tagsinput input').keyup(function(event){
              if(event.keyCode == 13){
                _this.fillDashboard($('.js-hashtags').val());
              }
            });

            $('.js-hashtags-submit').on('click', function(){
                _this.fillDashboard($('.js-hashtags').val());
            });
            
            $('body').on('keydown', (e) => {
               if ((e.metaKey || e.ctrlKey) && e.keyCode === 76) {
                   e.preventDefault();
                   this.$currentPost.find('.like input').trigger('click');
               } 
            });
            
            
        }

        updateQualityStick(comment){
            let $progress = this.$therm.find('.progress'),
                value = 0,
                puncRatio = 0;

            value = Math.min(comment.split('').length / 140 , 1) * 50 ; //length of comment
            
            value += comment.split(' ').length * 1.2;
            
            puncRatio = comment.split('').filter(m => punctuation.indexOf(m) > -1).length / comment.split('').length;            
            
            if(puncRatio > 0 && puncRatio < .1){
                value *= 1.8;
            }else if(puncRatio >= .1){
                value *= .3;
            }
            
            function setWidthandColor(i){
                let width = Math.min(i, 100);
                let color = rej.numberToColorHsl(width);
                var colorStepper = rej.numberToColorHsl(0),
                    widthStepper = i;
                var interval = setInterval(() => {
                    console.log(widthStepper);
                    if(widthStepper++ >= width){clearInterval(interval);}
                    $progress.css({
                        width:`${widthStepper}%`,
                        "background-color": rej.numberToColorHsl(widthStepper)
                    });
                }, 5)
                
                //$progress.css({width: `${width}%`, "background-color": color });
            }
            
            setWidthandColor(value);//animate this process

        }

        igPostHtml(postObj){
            return `      
                <div class="post-container hidden row">
                    <div class="image-container col-md-8">
                        <img src="${postObj.imgSrc}" />
                        <div class="like">
                            <input type="checkbox" id="ig-liked"/>
                            <label for="ig-liked">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32c-5.15-4.67-8.55-7.75-8.55-11.53 0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54l-1.45 1.31z"/>
                                </svg>
                            </label>
                        </div>
                    </div>
                    <div class="side-details col-md-4">
                        
                        <div class='input-comments'>
                            <p class='comments'>${postObj.caption} </p>
                            <textarea class='comment form-control'></textarea>
                            <button class='btn btn-primary btn-transparent js-submit-comment'>Comment</button>
                        </div>
                    </div>
                </div>`;
        }

        runCommenting(){
            this.$currentPost = this.$currentPost || this.$root.find('.ig-content-window').find('.post-container').first();
            let $textArea = this.$currentPost.find('textarea');
            setTimeout(() => {
                $textArea.focus();
            }, 50)
            

            this.$currentPost.removeClass('hidden');
            setTimeout(() => {
                var postHeight = this.$currentPost.height();
                console.log(postHeight);

                this.$currentPost.find('.side-details .comments').css({"min-height":`${postHeight / 4}px`, "max-height": `${(postHeight / 3)}px` });
                this.$currentPost.find('textarea').css("min-height",`${postHeight / 2}px`);
            },500);///TODO come back to this. Adding more animation will make this more seamless


            $textArea.on('keydown', (e) => {
               if ((e.metaKey || e.ctrlKey || event.shiftKey) && e.keyCode === 13) {
                   $textArea.val($textArea.val() + "\n");
               } else if(e.keyCode === 13){
                   console.log('submit');
                   e.preventDefault();
                   this.submitComment();
               }
            });
            
            $textArea.keyup((e) => {
                this.updateQualityStick($(e.currentTarget).val());
            });
        }

        submitComment(comment){//animate this stuff;
            var $nextPost = this.$currentPost.next();
            this.$currentPost.remove();
            this.$currentPost = $nextPost;            
            this.runCommenting();
            
            this.updateTicker();
        }
        
        updateTicker(){
            var count = +this.$ticker.text();
            count++;
            this.$ticker.text(count);
            var tcl = this.$ticker.clone();

            tcl.css({
                position: "absolute",
                left: this.$ticker.offset().left,
                top: this.$ticker.offset().top
            })

            $('body').append(tcl); 
            
            setTimeout(() => {
                this.$ticker.text(count);
                tcl.text(count);
                tcl.addClass('fade');
                setTimeout(() => {
                    tcl.remove();
                },2000);
            },50);
            
        }

        fillDashboard(hashtags){
            //'tag-contents'

            var $contentRoot = $('.ig-content-window', this.$root);

            hashtags = hashtags.split(',').map(ht => `tag=${ht}`).join('&');

            $.getJSON(`./api/user/tags?${hashtags}`)
                .done((data) => {
                    var $images = data.map(d => {
                        return this.igPostHtml({
                           imgSrc: d.images.highr,
                           caption: d.caption
                       });
                    });
                    $contentRoot.html($images.join(''));

                    this.runCommenting();

    //                $('.tag-contents').slick({
    //                    variableWidth: true
    //                });
                })

        }
    }

    if(typeof(dashboard) == 'undefined'){
        var dashboard = new Dashboard('.dashboard');
    }
})();
