module.exports = function(grunt) {
  var mu = require('muon');
  // var crypto = require('crypto');
  // var MigrateTask = require('migrate-orm2');
  // var MigrationTask = require('migrate-orm2');
    
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // migCfg: grunt.file.readJSON('migrations/config.json'),
    concat:{
        client:{
            options: {
              stripBanners: true,
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */ \n\n (function(){\n',
              footer: (function(){
                          // return "__domain__ = '"+ (m.cfg.domain || m.cfg.host +":"+ m.cfg.port)+"',"+
                                  // "__serverMode__ = '"+m.cfg.serverMode+"',"+
                                  // "__protocol__ = '"+ m.cfg.protocol +"';"+
                                  // "\n})();\n\n";
                      }).call(), 
            },
            files: {
              'tmp/grunt/concatmuon.js': ['node_modules/muon/lib/client/muonjs/*.js'],
            }
        }
    },
    uglify:{
        client: {
            src: 'tmp/grunt/concatmuon.js',
            dest: 'client/assets/muon.js'
          }
    },
    watch:{
        reload:{
            options:{livereload:true},
            files:['**/*js'],
            tasks:[]
        }
    },
    clean:{
        client:['tmp/grunt'],
    },
    mocha_phantomjs:{
        all:{
            options:{
                urls:[
                    'http://localhost:8000'
                ]
            }
        }
    },
    additems:{
        
    }
  });
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.registerTask('default',['clean']);
  grunt.registerTask('testing',['mocha_phantomjs']);
  grunt.registerTask('client_render',['concat:client','uglify:client','clean:client']);

  grunt.registerTask('sync','Scheme-BD sync tasks',function(tsk){
      console.log("1");
      if(!tsk) tsk = 'status';  
      var done = this.async();
      m.ready(function(){
          console.log("2");
          var s = require("./tasks/scheme-sync");
          var sync = s(m, grunt);
          if(sync[tsk]) sync[tsk](done);
          else done(false);
      })
  });
  grunt.registerTask('additems','for testing',function(tsk){
      var done = this.async();
      console.log("tut")
      m.ready(function(){
          console.log(m);
          var db;
            m.database.getDatabase("default").then(function(dbs){
                db = dbs;
                var sbj = db.models.subject;
                  var obj = {
                      name : "Nadya",
                      abb: "N",
                      alias: "nnn",
                      sgroup: "cats",
                      course: "first"
                  }
                  sbj.create(obj,function(err,res){
                      console.log(err);
                      console.log(res);
                  })
                  // console.log(sbj);
                  done();
            });
          
          
          
      });
  });
// //---------------------------------------------------------------------------------------  
    // var migDir = 'migrations';
// 
    // grunt.registerTask('migrate:generate', '', function() {
        // var done = this.async();
        // m.ready(function() {
            // var db = m.databases.default;
            // var task = new MigrateTask(db.driver, {
                // dir : migDir
            // });
            // task.generate('scheme', done);
        // });
    // });
// 
// 
// 
    // grunt.registerTask('migrate:up', '', function() {
        // var done = this.async();
        // m.ready(function() {
            // var db = m.databases.default;
            // var task = new MigrateTask(db.driver, {
                // dir : migDir
            // });
            // task.up(grunt.option('file'), done);
        // });
    // });
// 
    // grunt.registerTask('migrate:down', '', function() {
        // var done = this.async();
        // m.ready(function() {
            // var db = m.databases.default;
            // var task = new MigrateTask(db.driver, {
                // dir : migDir
            // });
            // task.down(grunt.option('file'), done);
        // });
    // });


};