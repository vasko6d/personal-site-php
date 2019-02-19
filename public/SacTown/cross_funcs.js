//highligh direction, add current clues, check answer, fix mving when directly above is a black box2
let cur_puzzle = 2;
gen_crossword(this['source'+cur_puzzle.toString()]);

let in_dir = false; // input direction false is horizantal
let prev_this = null;
$(document).ready(function(){

function get_clues(point,ac,dc){
	let cur_text = $(point).parent().text();
	let beg = across.indexOf("("+cur_text+")");
	let temp = across.slice(beg,-1);
	let fin = temp.indexOf("<br/>");
	let Aclue = temp.slice(0,fin);
    if(ac){document.getElementById('acontent').innerHTML =  Aclue;}
	beg = down.indexOf("("+cur_text+")");
	temp = down.slice(beg,-1);
	fin = temp.indexOf("<br/>");
	let Dclue = temp.slice(0,fin);
    if(dc){document.getElementById('dcontent').innerHTML =  Dclue}
	
}

function hlight_H(point,h_it,r,lim_p,lim_m){
	let row = $(point).parent().parent().index();
	let cur_td_ind = $(point).parent().index() + row*w;
	if(row != r){return;}	
	let tds = document.getElementsByTagName("td");	
	if(h_it){$(point).parent().toggleClass('yb');}
	
	if(cur_td_ind+1 < h*w && tds[cur_td_ind+1].className == 'wb' && !lim_p){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field+1];
		hlight_H(next_box,h_it,r,false,true);
	}
		get_clues(point,true,false);
	if(cur_td_ind-1 >= 0 && tds[cur_td_ind-1].className == 'wb' && !lim_m){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field-1];
		hlight_H(next_box,h_it,r,true,false);
	}
}
function hlight_V(point,h_it,lim_p,lim_m){
	let row = $(point).parent().parent().index();
	let cur_td_ind = $(point).parent().index() + row*w;
	let tds = document.getElementsByTagName("td");
	
	get_clues(point,false,true);
	if(h_it){$(point).parent().toggleClass('yb');}
	
	if(cur_td_ind+w < h*w && tds[cur_td_ind+w].className == 'wb' && !lim_p){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field+w-num_bb(point,1)];
		hlight_V(next_box,h_it,false,true);}
	
	get_clues(point,false,true);
	if(cur_td_ind-w >= 0 && tds[cur_td_ind-w].className == 'wb' && !lim_m){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field-w+num_bb(point,-1)];
		hlight_V(next_box,h_it,true,false);}
}

function ulight(point){
	let row = $(point).parent().parent().index();
	let cur_td_ind = $(point).parent().index() + row*w;
	let tds = document.getElementsByTagName("td");
	//alert(tds[cur_td_ind].className)
	 $(point).parent().toggleClass('yb');
	
	if(cur_td_ind+1 < h*w && tds[cur_td_ind+1].className == 'wb yb'){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field+1];
		ulight(next_box);}
	
	if(cur_td_ind-1 >= 0 && tds[cur_td_ind-1].className == 'wb yb'){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field-1];
		ulight(next_box);}
		
	if(cur_td_ind+w < h*w && tds[cur_td_ind+w].className == 'wb yb'){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field+w-num_bb(point,1)];
		ulight(next_box);}
	
	if(cur_td_ind-w >= 0 && tds[cur_td_ind-w].className == 'wb yb'){
		let inboxes = $('.icell');
		cur_field = $('.icell').index(point);
		next_box = inboxes[cur_field-w+num_bb(point,-1)];
		ulight(next_box);}
}

function num_bb(point,booler){
	let cur_td_ind = $(point).parent().index() + $(point).parent().parent().index()*w;
	let tds = document.getElementsByTagName("td");
	let bb_count = 0;
//see if nex is black
		for(let i =0; i<w; i++){
			if(cur_td_ind+booler*i <0 || cur_td_ind+i*booler >= h*w){ break;}
			if (tds[booler*i+cur_td_ind].className == 'bb'){
				bb_count++;
			}
		}
	
    //document.getElementById('test').innerHTML =  bb_count;//tds[cur_td_ind+1].className;
	return bb_count;
}

function parse_updown(point){
	if(prev_this != null){
		ulight(prev_this);}
	hlight_H(point,!in_dir,$(point).parent().parent().index(),false,false);
	hlight_V(point,in_dir,false,false);
	prev_this = point;
}
$(document).on("mouseup",".icell",function(){
parse_updown(this);
});    

$(document).on("keyup",".icell",function(){
    let KeyID = event.keyCode;
    let BPR = w;
    let inboxes = $('.icell');
    let pointher = this;
	
	if(this.className == 'icell icell2'){
		let sln = source.replace(/#/g,'');
		if(this.value.toUpperCase() == sln[inboxes.index(this)]){
			$(this).toggleClass('icell2');
		}
	}
	
    if (KeyID != 8  && KeyID != 46 && KeyID != 32 &&
        KeyID != 37 && KeyID != 38 && KeyID != 39 &&
        KeyID != 40){
        if (this.value.length == this.maxLength) {
            if(in_dir){
                cur_field = $('.icell').index(this)
                next_box = inboxes[cur_field+BPR-num_bb(this,1)]
 				if(next_box != undefined){
				next_box.focus();
				pointher = next_box;}
			}
            else{
                cur_field = $('.icell').index(this)
                next_box = inboxes[cur_field+1]
 				if(next_box != undefined){
				next_box.focus();
				pointher = next_box;}
			}
                
        }
    }
	parse_updown(pointher);

});    


$(document).on("keydown",".icell",function(){
   let KeyID = event.keyCode;
   let inboxes = $('.icell');
   let BPR = w;
		let KeyID = event.keyCode;
		ccA = "A".charCodeAt(0);
		ccZ = "Z".charCodeAt(0);
		if(KeyID>=ccA && KeyID<=ccZ){
			$(this).val('');
		}
   switch(KeyID)
   {
      case 8:
		   if(this.value.length == 1){
			   this.value = '';
		   }
		   else{
           if (in_dir){
               cur_field = $('.icell').index(this)
               next_box = inboxes[cur_field-BPR+num_bb(this,-1)]
				if(next_box != undefined){
					next_box.focus();
					next_box.value = ''}}
           else{
             cur_field = $('.icell').index(this)
             next_box = inboxes[cur_field-1]
				if(next_box != undefined){
					next_box.focus();
					next_box.value = ''}}
		   }
          break;     
      case 46:
          $(this).val('');
          break;
      case 32:
          in_dir = !in_dir;
          break;
      case 37:
           cur_field = $('.icell').index(this)
           next_box = inboxes[cur_field-1]
		   if(next_box != undefined){
				next_box.focus();}
           break;
      case 39:
           cur_field = $('.icell').index(this)
           next_box = inboxes[cur_field+1]
		   if(next_box != undefined){
				next_box.focus();}
           break;
      case 40:
           cur_field = $('.icell').index(this)
           next_box = inboxes[cur_field+BPR-num_bb(this,1)]
		   if(next_box != undefined){
				next_box.focus();}
           break;
      case 38:
           cur_field = $('.icell').index(this)
           next_box = inboxes[cur_field-BPR+num_bb(this,-1)]
		   if(next_box != undefined){
				next_box.focus();}
           break;
      default:
      break;
   }
});
//-----------------------------------------CHECK SOLUTION----------------------------------------------------
document.getElementById("check_button").onclick = function(){
    let inboxes = $('.icell');
	sln = source.replace(/#/g,'');
	//alert(sln);
	var perfect = true;
	for(let i=0;i<sln.length;i++){
		if(inboxes[i].value.toUpperCase() != sln[i]){
			perfect = false;
			if(inboxes[i].value.length == 1 && inboxes[i].className != 'icell icell2')
				$(inboxes[i]).toggleClass('icell2');}
	}
	if(perfect){alert('CONGRATS!!! You are Sack.');}
}

//------------------------------------------downloadpdf---------------------------------------------------
document.getElementById("prev_puzzle").onclick = function(){
	if(window['source'+(cur_puzzle-1).toString()]!= undefined){
		cur_puzzle--;
		gen_crossword(window['source'+cur_puzzle.toString()]);	
	}
}
document.getElementById("next_puzzle").onclick = function(){
	if(window['source'+(cur_puzzle+1).toString()]!= undefined){
		cur_puzzle++;
		gen_crossword(window['source'+cur_puzzle.toString()]);	
	}
}

});
