var crypto = require('crypto');
var Q = require("q");
var Sync = require('sql-ddl-sync').Sync;
var cfgPath = 'mysync/config.json';
var rulePath = '../';
var db;
var scheme = {};
var g;
var bdhash = {};
var bdscheme = {};
var rules = {};


module.exports = function(m, grunt) {
    if(!m || !grunt)
        return console.log(">>> Init error.");
    var mname;
    g = grunt;
    db = m.databases.default;
    for(var i in m.app.models) {
        scheme[i] = m.app.models[i].allProperties;
    }
    if(g.file.exists(cfgPath)){
       var obj = g.file.readJSON(cfgPath);
       if(obj.hash) bdhash = obj.hash;
       if(obj.scheme) bdscheme = obj.scheme;
    }
    if(g.option('m')) {
        mname = g.option('m');
        if(!scheme[mname]) {
            console.log(">>> No such model: " + mname);
            return;
        }
    }
    if(g.option('file')){
        try {
            var val = require(rulePath + g.option('file'));
            if(!val) {
                console.log(">>> No rules in file: "+g.option('file')+" Add rules and run again.");
                return done(false);
            }
            rules = val;
        } catch (err) {
            console.log(">>>" + err);
            return done(false);
        }
    }
    return {
        status : function(done) {
            var none = true;
            if(mname) {
                if(!isSynced(mname)){
                    none = false;
                    modelInfo(mname);
                }
            } else {
                for(var i in scheme) {
                    if(!isSynced(i)){
                        none = false;
                        modelInfo(i);
                    } 
                }
            }
            if(none) console.log(">>> Nothing to sync.")
            return done();
        },
        auto : function(done) {
            if(mname) {
                if(isSynced(mname)){
                    console.log(">>> model " + mname + " nothing to sync.");
                    return done();
                } 
                var prms = syncOne(mname, scheme[mname]);
                prms.done(done, function(){done(false);});
            } else {
                syncAll(done, syncOne);
            }
        },
        magic : function(done){
            if(mname) {
                if(isSynced(mname)){
                    console.log(">>> model " + mname + " nothing to sync.");
                    return done();
                }
                if(!rules[mname]){
                    console.log(">>> No rules for: "+mname+" Add rules and run again. Or use sync:auto");
                    return done(false);
                }
                var prms = magicSyncOne(mname, rules);
                prms.done(done, function(){done(false);});
            } else {
                syncAll(done, function(name){ magicSyncOne(name, rules[name]);});
            }
        }
    }
}
function modelInfo(name) {
    var old = bdscheme[name];
    if(!old) return console.log("   No table for model: "+name);
    var u = m.utils._;
    var cur = scheme[name];
    var curK = u.keys(cur);
    var oldK = u.keys(old);
    var addK = u.difference(curK, oldK);
    var remK = u.difference(oldK, curK);
    var commonK = u.difference(curK, addK);
    var changeK = u.filter(commonK, function(key){
        return !u.isEqual(cur[key],old[key]);
    })
    console.log(">>> Model name: "+name);
    console.log("   Add columns: "+addK);
    console.log("   Remove columns: "+remK);
    console.log("   Change columns: "+changeK);
    console.log("<<<");
}
function createMagic(obj){
    var txt = "module.exports = { /n";
    
    txt += "/t"+name + ":function(oldScheme){/n"+
    +"/t};/n"
    txt += "}"
    
    g.file.write(cfgPath, JSON.stringify({hash:bdhash, scheme: bdscheme}));
}
function magicSyncOne(name, rules) { //return promice
    console.log(">>> Rule sync : "+name);
    var u = m.utils._;
    var old = bdscheme[name];
    if(!old){
        return syncOne(name, scheme[name])
    }
    var def = Q.defer();
    var flagAdd = false;
    var cur = scheme[name];
    var curK = u.keys(cur);
    var oldK = u.keys(old);
    var addK = u.difference(curK, oldK);
    var remK = u.difference(oldK, curK);
    var commonK = u.difference(curK, addK);
    var changeK = u.filter(commonK, function(key){
        return !u.isEqual(cur[key],old[key]);
    })
    console.log("   Add columns: "+ addK);
    console.log("   Change columns: "+ changeK);
    console.log("   Remove columns: "+ remK);
    var prms = def.promise,
        sch = old;
    // sync add
    if(addK.length != 0){
        sch = u._.extend(old, u._.pick(cur, addK));
        flagAdd = true;
    }
    // change
    if(changeK.length != 0){
       sch = u._.extend(sch, u._.pick(cur, changeK));
       flagChng = true;
    }
    if(flagAdd) prms = prms.then(function(){ return syncOne(name, sch);});  
    //magic
    
    // remove
    if(remK.length != 0){
        var schR = u._.omit(sch, remK);
        if(u._.isEqual(schR, cur)) prms = prms.then(function(){ return syncOne(name, cur);});
        else console.log(">>> Internal error: before remove schemes not equal.")
    }else save(name, cur);
    
    setTimeout(function(){def.resolve()}, 100);
    return prms;
}


function syncOne(name, properties){
    console.log(">>> Sync: " + m.utils._.keys(properties));
    console.log(">>> Sync: " + JSON.stringify(properties));
    var def = Q.defer();
    var sync = new Sync({
        dialect : db.driver_name,
        driver : db.driver,
        debug : function(text) {
            console.log("> %s", text);
        }
    });
    sync.defineCollection(name, properties);
    sync.sync(function(err) {
        if(err) {
            console.log(">>> Table: " + name + " > Sync Error: " + err);
            return def.reject(err);
        } else{
            save(name, properties);
            console.log(">>> Model: " + name + " successfull synced.");
            def.resolve();
        }
    });
    return def.promise;
}

function syncAll(done, syncOneFunc) {
    var prms;
    m.utils._.keys(scheme).reduce(function(p,i){
        if(!isSynced(i))
            prms = p.then(function(){
                return syncOneFunc(i,scheme[i]);
            });
        else prms = p;
        return prms
    },Q());
    prms.done(function() { 
        done();
    }, function() {
        done(false);
    });
}



function calcHash(data) {
    var hash = crypto.createHash("md5");
    hash.update(data);
    return hash.digest('hex');
}

function save(modelname, properties) {
    bdhash[modelname] = calcHash(JSON.stringify(properties));
    bdscheme[modelname] = properties;
    g.file.write(cfgPath, JSON.stringify({hash:bdhash, scheme: bdscheme}));
    return true;
}


function isSynced(name) {
    if(calcHash(JSON.stringify(scheme[name])) == bdhash[name]) return true;
    else return false;
}
function renameCols(modelname){
    var Dialect = require("./node_modules/sql-ddl-sync/lib/Dialects/" + db.driver_name);
    if(!Dialect) {
        console.log('Grunt error no dialect: ' + db.driver_name);
        return done(false);
    }
    Dialect.getCollectionProperties(db.driver, modelname, function(err, columns) {
            if(err) {
                console.log(err);
                return done(false);
            }
            console.log(columns);
        });
        function modifyOne(column){
           Dialect.modifyCollectionColumn(db.driver, modelname, column, function(err, obj) {
                if(err) {
                    console.log(err);
                    return done(false);
                }
                console.log(columns);
            }); 
        }
    
}

function nu_dialect() {
    if(!db) {
        console.log('Grunt error no database');
        return done(false);
    }
    var Dialect = require("./node_modules/sql-ddl-sync/lib/Dialects/" + db.driver_name);
    if(!Dialect) {
        console.log('Grunt error no dialect: ' + db.driver_name);
        return done(false);
    }
    var modelname = "subject";
    var properties = scheme[modelname];
    Dialect.hasCollection(db.driver, modelname, function(err, has) {
        if(err) {
            console.log(err);
            return done(false);
        }
        Dialect.getCollectionProperties(db.driver, modelname, function(err, columns) {
            if(err) {
                console.log(err);
                return done(false);
            }
            console.log(columns);
            console.log(properties);
            done();
        });
    });
}