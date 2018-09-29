var glob = require("glob");
var fs = require("fs");

var font = {
  generator: "./node_modules/.bin/bmpfont-generator",
  ttf: "./font.ttf",
  output: "./image/font.png",
  glyph: "./text/glyph.json",
  color: '"#000000"'
};

var ui = [
  "はじめる",
  "ランキング",
  "0123456789",
  "ガチャをまわす",
  "おわる",
  "【】",
  "消費ポイント:",
  "あと回まわせます",
  "ガチャ結果",
  "（ポイント） ×",
  "を入手！",
  "所持ポイント:",
  "入手ポイント:",
  "合計ポイント:",
  "続ける"
].join();

function findStrings() {
  var files = glob.sync("./scenario/*.ks")
    .concat(glob.sync("./text/*.json"));
  var strings = files
    .map(name => fs.readFileSync(name, "utf-8"))
    .reduce((a, b) => a.concat(b))
    .split("")
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
    .reduce((a, b) => a + b)
    .replace(/\r?\n/g, "")
    + ui; // ガチャUI用
  fs.writeFileSync("./strings.txt", strings);
}

var generate =
  font.generator +
  " " +
  font.ttf +
  " " +
  font.output +
  " -h 32 --lf strings.txt -m ? -j " +
  font.glyph +
  " -c " +
  font.color;

findStrings();

var exec = require("child_process").exec;
exec(generate, function(err, stdout, stderr) {
 if (err) {
   console.log(err);
 }
});
