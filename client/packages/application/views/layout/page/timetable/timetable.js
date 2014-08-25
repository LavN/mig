m.TimetablePageLayoutView = m.LayoutView.extend({
	rendered: function($el){
		console.log("rendered");
		var _=this;
		this.$el.find(".edit_wrapper").each(function(el){
			console.log(this)
			var $wrp=$(this);
			$wrp.find(".wrapper_controls").each(function(){
				// console.log(this);
				var $ctrl = $(this);
				$ctrl.click(function(ev){
					console.log(this);
					if(this.id == "visible"){
						$wrp.find("#wrapper_body").toggleClass("hide");
					} 
				})
			})
			// var bar = $("<p>change delete hide new</p>");
			// bar.attr("id",$(el).id)
			// $(el).append()
		});
		
	}
})