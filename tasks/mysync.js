var crypto = require('crypto');
var MigrateTask = require('migrate-orm2');
var Sync = require('sql-ddl-sync').Sync;
var mPath = 'migrations/';
var sPath = mPath+'scheme/';

var db = m.databases.default;
var models = m.app.models;

exports.status = function(grunt, done){
    if(!db || !models) {
        console.log('Mysync error: args not defined');
        return done(false);
    }
    var scheme = concatScheme(models);
    var hash = calcHash(JSON.stringify(scheme));
    var migCfg = grunt.file.readJSON(mPath + 'config.json');
    console.log(">>>Info:");
    console.log("Migration ID: " + migCfg.id);
    if(hash != migCfg.hash) console.log("Hash is diffrent. Need to sync.");
    else console.log("Scheme synced.");
    console.log("<<<");
    done();
}
exports.mysyncHard = function(done){
    if(!db || !models) {
        console.log('Mysync error: args not defined');
        return done(false);
    }
    var scheme = concatScheme(models);
    var hash = calcHash(JSON.stringify(scheme));
    
    var sync = new Sync({
        dialect : db.driver_name,
        driver : db.driver,
        debug : function(text) {
            console.log("> %s", text);
        }
    });
    sync.defineCollection('subject', scheme.subject);
    // TODO for all scheme
    sync.sync(function(err) {
        if(err) {
            console.log("> Sync Error:" + err);
            cb(err);
        } else {
            console.log("> Sync Done");
            cb();
        }
        process.exit(0);
    });
}
exports.mysyncSoft = function(gr, ver, done){
    
}
// exports.mysyncUp = function(){
//     
// }
// exports.mysyncDown = function(){
//     
// }
function mysync(flag, cb) {
    if(!db || !models) {
        console.log('Mysync error: args not defined');
        return cb('Mysync error: args not defined');
    }
    var scheme = concatScheme(models);
    var hash = calcHash(JSON.stringify(scheme));
    var migCfg = grunt.file.readJSON(mPath + 'config.json');

    var mgId = migCfg.id;
    var mgHash = migCfg.hash;
    var sync = function(){};
    if(flag == "auto") sync = auto;
    if(flag == "manual") sync = manual;

    switch (opt){
        case "sync":{
            create(db, function(err, result){
                if(err) return cb(err);
                up(result, sync, cb);
            })
        }
        case "up": up(id, sync, cb);
        case "down": down(id, sync, cb);
        default:{
            console.log(">>>Info:");
            console.log("Migration ID: " + mgId);
            if(hash != mgHash) console.log("Hash is diffrent. Need to sync.");
            else console.log("Scheme synced.");
            console.log("<<<");
        }
    }
}
function create(db, cb){
    var task = new MigrateTask(db.driver, {
                dir : mPath
            });
    task.generate('scheme', function(err, result) {
        if(err) return cb(err);
        console.log('Create migration: '+result);
        return cb(false, result); 
    });
}
function up(id, sync, cb){
    var task = new MigrateTask(db.driver, {
                dir : mPath
            });
    task.up(id)
}
function down(id, sync, cb){
    
}

function auto(db, scheme, cb){
    var sync = new Sync({
        dialect : db.driver_name,
        driver : db.driver,
        debug : function(text) {
            console.log("> %s", text);
        }
    });
    sync.defineCollection('subject', scheme.subject);
    // TODO for all scheme
    sync.sync(function(err) {
        if(err) {
            console.log("> Sync Error:" + err);
            cb(err);
        } else {
            console.log("> Sync Done");
            cb();
        }
        process.exit(0);
    });


}
function manual(){
    
}     
      

function concatScheme(models) {
    var curScheme = {};
    for(var i in models) {
        curScheme[i] = models[i].allProperties;
    }
    return curScheme;
}

function calcHash(data) {
    var hash = crypto.createHash("md5");
    hash.update(data);
    return hash.digest('hex');
}

function saveScheme(id, scheme) {
    var pathname = schDir + id + ".json";
    var txt = JSON.stringify(scheme);
    grunt.file.write(pathname, txt);
    console.log("Create hash file: " + pathname);
    return true;
}

function saveConfig(cfg) {
    grunt.file.write(mPath + 'config.json', JSON.stringify(cfg));
}

function existsMig(id) {
    return grunt.file.exists(mPath + id + '.js');
}
          
          
          
