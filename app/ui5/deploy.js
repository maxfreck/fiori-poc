let path = require('path');
let fs = require("fs");

const project = path.basename(process.cwd());

const src = 'dist/';
const dest = '../../../resources/ui5/' + project + '/';


console.log("Deploying " + project);
console.log(src + ' → ' + dest);

if (fs.existsSync(dest)) {
	fs.rmdirSync(dest, {recursive: true})
}

fs.cp(src, dest, { recursive: true }, (err) => {
	if (err) {
		console.error(err);
	}
});