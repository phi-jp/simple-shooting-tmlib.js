/*
 * 
 */

var fs      = require("fs");
var uglify  = require("uglify-js");

desc("This is the default task.");
task("default", [], function() {
    var out     = fs.createWriteStream("../build/script.js");
    var out_min = fs.createWriteStream("../build/script.min.js");
    var target = [
        "../js/param.js",
        "../js/main.js",
        "../js/titlescene.js",
        "../js/gamescene.js",
        "../js/resultscene.js",
        "../js/player.js",
        "../js/enemy.js",
        "../js/item.js",
    ];
    var fileContents = [];
    
    for (var i=0,len=target.length; i<len; ++i) {
        var file = fs.readFileSync(target[i]);
        fileContents.push( file.toString() );
    }
    
    var codeText = fileContents.join("\n\n");
    out.write(codeText);

    var ast = uglify.parser.parse(codeText);
    ast = uglify.uglify.ast_mangle(ast);
    ast = uglify.uglify.ast_squeeze(ast);
    var finalCode = uglify.uglify.gen_code(ast);
    
    out_min.write(finalCode);
});
