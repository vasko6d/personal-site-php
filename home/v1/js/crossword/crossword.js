var theme;
var source;
var h;
var w;
var across;
var down;
function gen_crossword(cross_source){
	function isAlpha(char) {
	ccA = "A".charCodeAt(0);
	ccZ = "Z".charCodeAt(0);
	ccC = char.charCodeAt(0);	
	if (ccC >= ccA && ccC <= ccZ){
		return true;}
	else{
		return false;}
	};
	
	cross_source();
	
  document.getElementById('crossy_title').innerHTML = theme;
  document.getElementById('ACROSS').innerHTML = across;
  document.getElementById('DOWN').innerHTML = down;

  var myTable= "<table id=\"cross_table\">";
  var r = 0;
  var entry = "";
  var clue = 1;

  for (var j=0; j<h; j++) {
	myTable +"<tr>";
  for (var i=0; i<w; i++){
	var c = source.charAt(i+r);     //current character
	var cb = source.charAt(i+r-1);  //char 1 back
	var clb = source.charAt(i+r-w); //char one line up
	if (isAlpha(c)){
		if(r ==0 || i == 0 || !isAlpha(cb) || !isAlpha(clb)){
			entry = clue.toString();
			clue++;}
		else{
			entry = "&nbsp";}
		myTable += "<td class=\"wb\">" +entry+ "<input type=\"text\" value=\"\" maxlength=\"1\" class = \"icell\"></input></td>";}
	else{
		myTable += "<td class=\"bb\">" + "</td>";}
		
  }
	myTable +="</tr>";
	r += w;
  }
   myTable+="</table>";

document.getElementById('tablePrint').innerHTML = myTable;
}


