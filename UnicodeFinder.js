//singleton pattern template
var UnicodeFinder = {};

UnicodeFinder.Base = (function() {

	//private attributes
    var numRows = 256;
    var range = 0;
    var blockHash = {};    

    
    
	//private methods
    function makeBlockHash() {
            
        $.each(blocks, function(idx, blk){
            var idxBlk = ("000000" + blk[0]).substr(-6).toUpperCase();
            blockHash[idxBlk] = blk[2];
        });          
        
    }
    
	function makeControls() {

        //assumes DOM has .unicode-control
        
        var c = [];
        
        //range select
        c.push("Range:<select id='unicode-range'>");
        
            for(var i = 0; i < 50; i++){
                c.push("<option value='" + i + "'>Range [" + i + "] " 
                    + ("000000" + (i * 4096).toString(16)).substr(-6).toUpperCase()
                    + " : " + (i * 4096) + "</option>");
            }
        
        c.push("</select>");
        
        //block select
        c.push("Block:<select id='unicode-block'>");
        
            $.each(blocks, function(idx, blk){
            
                var rng = Math.floor(parseInt(blk[0], 16) / 4096);
                c.push("<option value='" + rng + "_" + blk[0] + "'>Range [" 
                    + rng + "] : " 
                    + ("000000" + blk[0]).substr(-6).toUpperCase()
                    + " " + blk[2] + "</option>");
            });
        
        c.push("</select>");
        
        //go
        c.push("<input id='unicode-go' type='button' value='Show Character Table'></input>");
       
        $(".unicode-control").html(c.join(''));                  
                
	}
    
    function makeEvents() {

        $("#unicode-range").on("change", function(){
            range = parseInt($("#unicode-range option:selected").val());
        });
    
        $("#unicode-block").on("change", function(){
            var selBlk = $("#unicode-block option:selected").val();
            var seqVal = parseInt(selBlk, 16);
            var rgeNum = Math.floor(seqVal / 4096); 
            
console.log(selBlk, seqVal, rgeNum);
        });
        
        $("#unicode-go").on("click", function(){
            makeUnicodeTable()
        });
        
    }
    
    function makeUnicodeTable() {
        
        //assumes DOM has .unicode-content
        var plane = parseInt(1,16);
        var next = parseInt(0,16);
        var seq = 0 + (4096 * range);
console.log(range, seq);        
        var c = [];
        c.push("<table>");
         for(var i = 0; i < numRows; i++){
        
            c.push("<tr>");
            for(var j = 0; j < 16; j++){
        
                var coords = "(" + i + ", " + j + ") ";
                var hexStr = ("000000" + seq.toString(16)).substr(-6).toUpperCase();
                var charStr = "&#x" + seq.toString(16);
                
                //insert row if seq = block
                if( blockHash[hexStr]){
        
                    c.push("<td colspan='16'>");			
                        c.push("<div class='block'>" + blockHash[hexStr] + "</div>");		
                    c.push("</td>");
        
                    c.push("</tr>");
                    c.push("<tr>");
                }
                c.push("<td>");
                    
                    c.push("<div class='addr'>" + hexStr + "</div>");
                    c.push("<div class='char'>" + charStr + "</div>");
                
                c.push("</td>");
                
                //for next cell
                next++;
                seq++;
            
            }
            c.push("</tr>");
            
         }
        c.push("</table>");
         
        $(".unicode-content").html(c.join(''));

    }
        

	
	return {
		//public attributes
		//thisPubAtt: true,
		//thatThis: 3.12,
		
		//public methods
        Initialize: function() {
            
            makeBlockHash();
            makeControls();
            makeEvents();            
            
        }



	};
})();

