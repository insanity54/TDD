/**
 * layouts
 *
 * easy way to get source of handlebars layouts
 *
 * example:
 *
 *     var layouts = require('./layouts');
 *     var listLayout = layouts.list;
 *     Handlebars.compile(listLayout);
 */


var path = require('path');
var layoutDir = path.join(__dirname, '..', 'layouts');
var fs = require('fs');


var list = (function list() {
    return fs.readFileSync(path.join(layoutDir, 'list.hbs'), 'utf8');
})()



module.exports = {
    list: list
}
