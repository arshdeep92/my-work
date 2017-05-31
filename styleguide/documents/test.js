$j.each($j("input, textarea"), function(i,v) {
	if ($j(this).val() != "") {
		$j(this).addClass('active');
	}
});

$j("input, textarea").focus(function() {
	$j(this).addClass('active');	
}).blur(function() {
	if ($j(this).val() == "") {
		$j(this).removeClass('active');
	}
});