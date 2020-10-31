(function ($) {

	var $window = $(window),
		$body = $('body'),
		$document = $(document);

	// Breakpoints.
	breakpoints({
		desktop: ['737px', null],
		wide: ['1201px', null],
		narrow: ['737px', '1200px'],
		narrower: ['737px', '1000px'],
		mobile: [null, '736px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Nav.

	// Height hack.

	var $sc = $('#sidebar, #content'), tid;

	$window
		.on('resize', function () {
			window.clearTimeout(tid);
			tid = window.setTimeout(function () {
				$sc.css('min-height', $document.height());
			}, 100);
		})
		.on('load', function () {
			$window.trigger('resize');
		})
		.trigger('resize');


	// Title Bar.
	$(
		'<div id="titleBar">' +
		'<a href="#sidebar" class="toggle"></a>' +
		'</div>'
	)
		.appendTo($body);

	// Sidebar
	$('#sidebar')
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'left',
			target: $body,
			visibleClass: 'sidebar-visible'
		});

})(jQuery);





var iter = 0;
var error = 100;
var xr = 0;
var xp1 = 0;



function f(x) {
	var errormsg = document.getElementById('errormsg')
	var value = document.getElementById('hidden').innerText.toLowerCase(); //Get input math field
	var scope = {
		x: x//solve for X, used by mathjs library
	};

	try {
		var eqn = math.compile(value); //from Mathjs library
		var result = eqn.eval(scope); //Subsitute x in the input function
	} catch (err) { //Catch any errors
		errormsg.innerHTML = '<span style="color: red;">' + err.toString() + '</span>';
	}

	return result; //Return the substitution of x in the function <-- f(x)
}

function clrtab() {
	$('html, body').animate({
		scrollTop: $("#disp").offset().top
	}, 2000);
	document.getElementById('disp').getElementsByTagName('tbody')[0].innerHTML = ''; //Clear table contents
	var errormsg = document.getElementById('errormsg');
	errormsg.innerHTML = '';
}


//falsepos
function falsepos(xl, xu, eps) {
	//Uses output function to print results in rows
	var maxiter = document.getElementById('maxiter'); //Get max iterations
	if (error >= eps && iter < maxiter.value) {
		fp = f(xu) * (xl - xu);
		sp = f(xl) - f(xu);
		xr = xu - (fp / sp);
		//xr = xu - ((f(xu)*(xl - xu)) / (f(xl) - f(xu)));
		error = Math.abs(0 - f(xr)) ;
		output_falsepos(iter, xl, f(xl), xu, f(xu), xr, f(xr), error);
		iter++;
		if (f(xr) * f(xl) > 0) xl = xr;
		else if (f(xr) * f(xl) < 0) xu = xr;
		return falsepos(xl, xu, eps);
	} else { //After finishing the recursive if, we output root, and reset variable values
		var root = document.getElementById('root'); //Select the label where we output root
		root.innerHTML = '<span style="color:green;font-weight:bold">' + parseFloat(xr).toPrecision(5) * 1 + '</span>'; //Output root
		iter = 0;
		error = 100; //since error is now 100, table contents will be reset
	}

}

function output_falsepos(iter, xl, fxl, xu, fxu, xr, fxr, error) { //Used for displaying
	var xlf = parseFloat(xl).toPrecision(8) * 1; //for decimal point precision (for example 0.535235535 to 0.53)
	var xuf = parseFloat(xu).toPrecision(8) * 1;
	var fxlf = parseFloat(f(xl)).toPrecision(8) * 1;
	var fxuf = parseFloat(f(xu)).toPrecision(8) * 1;
	var xrf = parseFloat(xr).toPrecision(5) * 1;
	var fxrf = parseFloat(f(xr)).toPrecision(8) * 1;
	var errorf = parseFloat(error).toPrecision(8) * 1; //We multiply by * 1 in the end so if an integer like 3 doesn't display as 3.000
	var tbody = document.getElementById('disp').getElementsByTagName('tbody')[0]; //inserts a row in the table body
	tbody.innerHTML = tbody.innerHTML + "<tr><th>" + iter + "</th><th>" + xlf + "</th><th>" + fxlf + "</th><th>" + xuf + "</th><th>"
		+ fxuf + "</th><th>" + xrf + "</th><th>" + fxrf + "</th><th>" + errorf + "</th></tr>";
}


//newton
function newton(x0, eps) {

	var maxiter = document.getElementById('maxiter'); //Get max iterations
	xp1 = x0 - (f(x0) / fD(x0));
	error = Math.abs(0 - f(x0));
	output_newton(iter, x0, f(x0), fD(x0), xp1, error);
	++iter;
	if (error >= eps && iter < maxiter.value) {
		newton(xp1, eps);
	} else { //After finishing the recursive if, we output root, and reset variable values
		var root = document.getElementById('root'); //Select the label where we output root
		root.innerHTML = '<span style="color:green;font-weight:bold">' + parseFloat(x0).toPrecision(5) * 1 + '</span>'; //Output root
		iter = 0;
		error = 100; //since error is now 100, table contents will be reset
	}

}

function fD(xin) {
	var MQ = MathQuill.getInterface(2);
	var dervarea = document.getElementById('derv'); //define variable to point to empty span area to output derv

	var expr = document.getElementById('hidden').innerText.toLowerCase(); //Get input math from html

	const x = xin;
	var scope = {
		x: xin //solve for X, used by mathjs library
	};

	var eqn = math.compile(expr); //from Mathjs library  
	var derv = math.derivative(expr, 'x')

	dervarea.innerHTML = derv; //Output derivative in field
	MQ.StaticMath(dervarea);

	var result = derv.eval(scope);
	return result;
}

function output_newton(iter, x0, fx0, fdx0, xp1, error) { //Used for displaying
	var x0f = parseFloat(x0).toPrecision(5) * 1; //for decimal point precision (for example 0.535235535 to 0.53)
	var errorf = parseFloat(error).toPrecision(5) * 1; //We multiply by * 1 in the end so if an integer like 3 doesn't display as 3.000
	var fxof = parseFloat(fx0).toPrecision(5) * 1;
	var fdox = parseFloat(fdx0).toPrecision(5) * 1;
	var xp1f = parseFloat(xp1).toPrecision(5) * 1;
	var tbody = document.getElementById('disp').getElementsByTagName('tbody')[0]; //inserts a row in the table body
	tbody.innerHTML = tbody.innerHTML + "<tr><th>" + iter + "</th><th>" + x0f + "</th><th>" + fxof + "</th><th>" + fdox + "</th><th>" + xp1f + "</th><th>" + errorf + " %</th></th>";
}


function clraug() {
	for (var i = 0; i < 12; i++) {
		document.getElementById('augtab').getElementsByTagName('input')[i].value = ''; //Clear table contents - Ehab Osama El-Nabarawy
	}
}

$(function () {
	$('#augmat').hide();
	$('#selection').change(function () {
		clrans();
		if ($('#selection').val() == 'sl_gs' || 'sl_lu') {
			$('#augmat').show();
			$('#buttons').show();
			$('.augtab').css('border-radius', '10px/40px');
		}
		if ($('#selection').val() == 'sl_cr') {
			$('#buttons').show();
			$('.augtab').css('border-radius', '0px');
		}

	});
});



$(function btnc() {
	$('#calcbtn').click(function btnc() {
		clrans();
		$('html, body').animate({
			scrollTop: $("#outdiv").offset().top
		}, 1000);
		if ($('#selection').val() == 'sl_gs') { gauss(); }
		if ($('#selection').val() == 'sl_lu') { LU(); }
		if ($('#selection').val() == 'sl_cr') { cramer(); }
	});
});


function clrans() {
	document.getElementById('resdiv').innerHTML = '';
	document.getElementById('outdiv').innerHTML = '';
}