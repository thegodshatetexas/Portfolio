//  Fruit Factory web application. 
//  The main idea behind this web app was to allow a user to add fruit to a sortable/dragable list. 
//  Written around a year ago on a Friday and Saturday. I used a slightly different styling on the code
//  and I think that it still looks very readable, even after a year.


$(document).ready(function(){
	mySorter("#sortable");
	var itemArray = new Array();
	var mode = null;
	var raspberryArray = new Array("Black Berry","Wine Berry","American Red");
	var plumArray = new Array("Cherry","Blackthorn","Beach");
	var orangeArray = new Array("Blood","Navel","Valencia");
	var appleArray = new Array("Akane","Golden","Red Delicious");
	var strawberryArray = new Array("French","Argentine");
	var peachArray = new Array("Georgia","Nectarine");
	fruitList();

	$( "#dialog-save" ).dialog({
		autoOpen: false,
		height: 250,
		width: 350,
		modal: true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
	});

	$( "#dialog-open" ).dialog({
		autoOpen: false,
		height: 250,
		width: 350,
		modal: true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
	});

	$( "#dialog-instructions" ).dialog({
		autoOpen: true,
		height: 450,
		width: 450,
		modal: true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
	});

	$("#add-item")
	.button()
	.click(function() {
		$( "#dialog-form" ).dialog("open");
	});

	$("#saveFile")
	.button()
	.click(function() {
		$( "#dialog-save" ).dialog("open");
	});

	$("#openFile")
	.button()
	.click(function() {
		$('#dialog-open').dialog('open');
	});

	$("#newFile")
	.button()
	.click(function() {
		location.reload();
	});

	$("#sortable").on("click", "#rank", function(){
		if (mode == null){
			var fruitName = $(this).parent('li').children("#fruit").children('h2').html(),
			subFruitName = $(this).parent('li').children("#fruit").children('p').html(),
			rank = parseInt($(this).parent('li').children("#rank").children('h1').html()),
			height = $(this).parent('li').children("#label_height").children('h1').html(),
			obj =$(this).parent('li');

			$(obj).addClass("markedLi");

			var rankValueString = null;
			if (rank < 9){
				rankValueString = "0"+(++rank);
			}
			else{
				rankValueString = ++rank;
			}

			$(this).parent('li').append('<div id="delete"><button id="deleteBtn" class="deleteBtn"></button></div><div id="move"><button id="btnUp" class="btnUp"></button><button id="btnDown" class="btnDown"></button></div>');
			var staticHeight = $(this).parent('li').children('#static_height').children('p').html().replace('in', '');
			$(this).parent('li').children('#static_height').empty();
			$(this).parent('li').children('#static_height').append('<input type="text" name="heightField" id="heightField" class="text ui-widget-content ui-corner-all" value="'+staticHeight+'" />');

			$('#deleteBtn').button().click(function() {
				$(this).parent().parent().remove();
			});

			$('#btnUp').button().click(function(){
				var current = $('.markedLi');
				current.prev().before(current);
			});

			$('#btnDown').button().click(function(){
				var current = $('.markedLi');
				current.next().after(current);
			});

			$("#dupe-item").button().click(function() {
				itemArray.push($( "<div />" ).appendTo( "body").item({"height": height, "fruit_type": fruitName, "sub_fruit_type": subFruitName,  idName: "item", rank: rankValueString, itemNum: (1+itemArray.length) }));
				heightFieldValue = $(obj).children('#static_height').children("#heightField").val();
				$(obj).children('#delete').remove();
				$(obj).children('#move').remove();
				$(obj).children("#fruit").html('<h2>' + fruitName + '</h2><p>' + subFruitName + '</p>');
				$(obj).children("#fruit").children('#fruit_selects').remove();
				$(obj).children('#static_height').html('<div id="static_height"><h2>&nbsp;</h2><p>' + heightFieldValue + ' in</p></div>');
				$(obj).children('#static_height').children("#heightField").remove();
				$(obj).css('background-image', 'url("img/ItemBG_neutral.png")');
				$(obj).removeClass("markedLi");
				mode = null;
				return;
			});

			$(this).parent('li').children("#fruit").empty();
			$(this).parent('li').children("#fruit").append('<div id="fruit_selects"><select data-placeholder="item" style="width:150px;" class="chzn-select-no-single" tabindex="3" name="item_fruit_type" id="item_fruit_type"><option value=""></option><option>Raspberry</option><option>Plum</option><option>Orange</option><option>Apple</option><option>Strawberry</option><option>Peach</option></select><select data-placeholder="" style="width:150px;" class="chzn-select-no-single" tabindex="4" name="item_sub_fruit_type" id="item_sub_fruit_type"><option value=""></option></div>');
			$(this).parent('li').children("#fruit").children("#fruit_selects").children('#item_fruit_type').chosen().trigger("liszt:updated");
			$(this).parent('li').children("#fruit").children("#fruit_selects").children('#item_sub_fruit_type').chosen().trigger("liszt:updated");
			$(this).parent('li').css('background-image', 'url("img/ItemBG_Hover2.png")');

			$('#item_fruit_type').chosen().change(function(){
				var fruit_type = $("#item_fruit_type").val();
				var selectedFruitArray = null;

				switch (fruit_type) {
					default:
					break;
					case "Raspberry":
					selectedFruitArray = raspberryArray;
					break;
					case "Plum":
					selectedFruitArray = plumArray;
					break;
					case "Orange":
					selectedFruitArray = orangeArray;
					break;
					case "Apple":
					selectedFruitArray = appleArray;
					break;
					case "Strawberry":
					selectedFruitArray = strawberryArray;
					break;
					case "Peach":
					selectedFruitArray = peachArray;
					break;
				}

				$.each(selectedFruitArray, function (index, value) {
					$('#item_sub_fruit_type').append($('<option>', {
						value: value,
						text : value
					}));
				});

				$("#item_sub_fruit_type").attr('disabled', false).trigger("liszt:updated");
			});
			mode = "editing";
		}
		else if (mode == "editing"){
			// Before we remove anything we want to capture the select values so that we can display them outside of editing mode
			var str = '<h2>' + $(this).parent('li').children("#fruit").children('#fruit_selects').children("#item_fruit_type").val() + '</h2><p>' + $(this).parent('li').children("#fruit").children('#fruit_selects').children("#item_sub_fruit_type").val() + '</p>',
			heightFieldValue = $(this).parent('li').children('#static_height').children("#heightField").val();

			$(this).parent('li').children('#delete').remove();
			$(this).parent('li').children('#move').remove();
			$(this).parent('li').children('#static_height').children("#heightField").remove();
			$(this).parent('li').children('#static_height').html('<div id="static_height"><h2>&nbsp;</h2><p>' + heightFieldValue + ' in</p></div>');
			$(this).parent('li').children("#fruit").children('#fruit_selects').remove();
			$(this).parent('li').children("#fruit").html(str);
			$(this).parent('li').css('background-image', 'url("img/ItemBG_neutral.png")');
			$(this).parent('li').removeClass("markedLi");

			mode = null;
		}
	});

$("#sortable").sortable({
	start: function(event, ui) {
		ui.item.startPos = ui.item.index();
	},
	stop: function(event, ui) {
		startPos = 1+ui.item.startPos;
		newPos = 1+ui.item.index();
		newPosString = "0"+newPos;

		$("li").each(function(index){
			var rankValueString = null;
			if (index < 9){
				rankValueString = "0"+(++index);
			}
			else{
				rankValueString = ++index;
			}

			$(this).children("#rank").html("<h1>"+ rankValueString + "</h1>");
		});
	}
});

$(function() {
	var height = $( "#height" ),
	fruit_type = $( "#fruit_type" ),
	sub_fruit_type = $( "#sub_fruit_type" ),
	allFields = $( [] ).add( height ).add( fruit_type ).add( sub_fruit_type ),
	tips = $( ".validateTips" );

	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 500,
		width: 350,
		modal: true,
		buttons: {
			"New Item": function() {
				var bValid = true;
				allFields.removeClass( "ui-state-error" );

				bValid = bValid && checkLength( height, "height", 1, 5 );
				bValid = bValid && checkLength( fruit_type, "fruit_type", 1, 15, 'Please select a Fruit.');
				bValid = bValid && checkLength( sub_fruit_type, "sub_fruit_type", 1, 15, 'Please select a Sub Fruit.' );
				bValid = bValid && checkRegexp( height, /^[\d ]+([.,][\d ]+)?$/, "Height may consist of only 0-9" );

				if ( bValid ) {
					var rankValueString = null;

					if (itemArray.length < 9)
						rankValueString = "0"+(1+itemArray.length);
					else
						rankValueString = 1+itemArray.length;

					var newItem = $( "<div />" ).appendTo( "body").item({"height": height.val(), "fruit_type": fruit_type.val(), "sub_fruit_type": sub_fruit_type.val(),  idName: ("item"+1+itemArray.length), rank: rankValueString, itemNum: (1+itemArray.length) });
					itemArray.push(newItem);
					$( this ).dialog("close");
					$("#sub_fruit_type").attr('disabled', true).trigger("liszt:updated");
					$("#fruit_type").trigger("liszt:updated");
				}
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
});
});

function fruitList(){
	var raspberryArray = new Array("Black Berry","Wine Berry","American Red");
	var plumArray = new Array("Cherry","Blackthorn","Beach");
	var orangeArray = new Array("Blood","Navel","Valencia");
	var appleArray = new Array("Akane","Golden","Red Delicious");
	var strawberryArray = new Array("French","Argentine");
	var peachArray = new Array("Georgia","Nectarine");

	$("#sub_fruit_type").attr('disabled', true).trigger("liszt:updated");
	$('#fruit_type').chosen().change(function(){

		var fruit_type = $("#fruit_type").val();
		var selectedFruitArray = null;

		switch (fruit_type) {
			default:
			break;
			case "Raspberry":
			selectedFruitArray = raspberryArray;
			break;
			case "Plum":
			selectedFruitArray = plumArray;
			break;
			case "Orange":
			selectedFruitArray = orangeArray;
			break;
			case "Apple":
			selectedFruitArray = appleArray;
			break;
			case "Strawberry":
			selectedFruitArray = strawberryArray;
			break;
			case "Peach":
			selectedFruitArray = peachArray;
			break;
		}

		$.each(selectedFruitArray, function (index, value) {
			$('#sub_fruit_type').append($('<option>', {
				value: value,
				text : value
			}));
		});

		$("#sub_fruit_type").attr('disabled', false).trigger("liszt:updated");
	});
};

function mySorter(keyword){
	$(keyword).sortable({
		placeholder: "ui-state-highlight"
	});
	$(keyword).disableSelection();

};

function checkLength( o, n, min, max, msg ) {
	if ( o.val().length > max || o.val().length < min ) {
		o.addClass( "ui-state-error" );
		if (msg == null){
			updateTips( "Length of " + n + " must be between " + min + " and " + max + "." );
		}
		else{
			updateTips(msg);
		}

		return false;
	} else {
		return true;
	}
}

function updateTips( t ) {
	var tips = $(".validateTips");
	tips
	.text( t )
	.addClass( "ui-state-highlight" );
	setTimeout(function() {
		tips.removeClass( "ui-state-highlight", 1500 );
	}, 500 );
}

function checkRegexp( o, regexp, n ) {
	if ( !( regexp.test( o.val() ) ) ) {
		o.addClass( "ui-state-error" );
		updateTips( n );
		return false;
	} else {
		return true;
	}
}