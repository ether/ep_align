describe("Alignment of Text", function(){

  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
   // Check Center Alignment
    // Check Left Alignment
     // Check Right Alignment
      // Check Highlighting text and setting it to un-bold works

  it("Center Aligns the Text", function(done) {
    var alignment = "center";
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the bold button and click it
    var $button = chrome$(".ep_align_center");
    $button.click();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first().first();
    var $alignedSpanStyles = $newFirstTextElement.children().first().attr("style");

    var hasAlignment = ($alignedSpanStyles.indexOf("text-align: "+alignment) !== -1 || $alignedSpanStyles.indexOf("text-align:"+alignment) !== -1)

    //expect it to be aligned correctly
    expect(hasAlignment).to.be(true);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    done();
  });

  it("Left Aligns the Text", function(done) {
    var alignment = "left";
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the bold button and click it
    var $button = chrome$(".ep_align_left");
    $button.click();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first().first();
    var $alignedSpanStyles = $newFirstTextElement.children().first().attr("style");

    var hasAlignment = ($alignedSpanStyles.indexOf("text-align: "+alignment) !== -1 || $alignedSpanStyles.indexOf("text-align:"+alignment) !== -1)

    //expect it to be aligned correctly
    expect(hasAlignment).to.be(true);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    done();
  });

  it("Right Aligns the Text", function(done) {
    var alignment = "right";
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the bold button and click it
    var $button = chrome$(".ep_align_"+alignment);
    $button.click();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first().first();
    var $alignedSpanStyles = $newFirstTextElement.children().first().attr("style");

    var hasAlignment = ($alignedSpanStyles.indexOf("text-align: "+alignment) !== -1 || $alignedSpanStyles.indexOf("text-align:"+alignment) !== -1)

    //expect it to be aligned correctly
    expect(hasAlignment).to.be(true);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    done();
  });

  it("Justify Aligns the Text", function(done) {
    var alignment = "justify";
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the bold button and click it
    var $button = chrome$(".ep_align_"+alignment);
    $button.click();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first().first();
    var $alignedSpanStyles = $newFirstTextElement.children().first().attr("style");

    var hasAlignment = ($alignedSpanStyles.indexOf("text-align: "+alignment) !== -1 || $alignedSpanStyles.indexOf("text-align:"+alignment) !== -1)

    //expect it to be aligned correctly
    expect(hasAlignment).to.be(true);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    done();
  });


});
