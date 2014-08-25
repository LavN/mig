describe("first test group", function() {
    describe("inner test group", function() {
        console.log(this);
        var a;
        it("inner test 1", function() {
            a = true;
            expect(a).to.be(true);
        });
    });  
    it("test 1", function() {
        expect(true).to.be(true);
    });
});

