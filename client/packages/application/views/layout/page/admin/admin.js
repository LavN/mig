m.AdminPageLayoutView = m.LayoutView.extend({
	rendered: function($el){
		console.log("rendered");
		var _=this;
  		this.$('.cabinet_nav_tab').click(function(ev){
  			$('.cabinet_nav_tab').removeClass("active");
  			$(this).toggleClass("active");
  			// if(window.currentUser instanceof UserModel){
  				// var v;
	  			// if (this.id == "sources") v = new SourcesUserModelView(window.currentUser);
	  			// if (this.id == "profile") v = new ProfileUserModelView(window.currentUser);
  			// }
  			// _.$("#nav_tab_body").html("");
  			// _.$("#nav_tab_body").append(v.$el);
  			
  		});
	}
})
