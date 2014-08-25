module.exports = {
    run: function(models) {
        console.log("magic: for subject");
        var df = Q.defer();
        models.subject.get(1, function(err, obj) {
            if(err) {
                console.log(err);
                df.reject(err);
            } 
            else {
                console.log("-----1");
                obj.semestr = "__"+obj.course;
                obj.save(function(err) {
                    if(err) console.log(err);
                    if(err) df.reject(err);
                    else df.resolve();
                });
            }
            
        });
        return df.promise;
    }
};
