window.onload = function()
{

	var mainX1;
	var mainX2;
	var mainY1;
	var mainY2;

	var secX1;
	var secX2;

	var mainStep = 1;

	// Canvases
	var mainCanvas = document.getElementById("main-plot");
	var mainCtx = mainCanvas.getContext('2d');

	var cubesCanvas = document.getElementById("cubes-plot");
	var cubesCtx = cubesCanvas.getContext('2d');


	var trapsCanvas = document.getElementById("traps-plot");
	var trapsCtx = trapsCanvas.getContext('2d');

	var mkCanvas = document.getElementById("mk-plot");
	var mkCtx = mkCanvas.getContext('2d');

	var simpCanvas = document.getElementById("simp-plot");
	var simpCtx = simpCanvas.getContext('2d');

	var resultArray = [
		["-","-","-","-","-","-","-","-","-","-"],
		["-","-","-","-","-","-","-","-","-","-"],
		["-","-","-","-","-","-","-","-","-","-"],
		["-","-","-","-","-","-","-","-","-","-"],
	];

	document.getElementById('buildMainPlot').addEventListener('click', function(){

		let errors = [];

		mainX1 = document.getElementById("mainX1").value ?  parseFloat(document.getElementById("mainX1").value) : 0;
		mainX2 = document.getElementById("mainX2").value ?  parseFloat(document.getElementById("mainX2").value) : 5;
		mainY1 = document.getElementById("mainY1").value ?  parseFloat(document.getElementById("mainY1").value) : -20;
		mainY2 = document.getElementById("mainY2").value ?  parseFloat(document.getElementById("mainY2").value) : 126;

		if(mainX1 > mainX2)
		{
			errors.push("Помилка! x1 не може бути більшим за x2");
		}
		if(mainY1 > mainY2)
		{
			errors.push("Помилка! y1 не може бути більшим за y2");
		}


		if(errors.length > 0)
		{
			let errorStr = "";
			for(let e = 0; e < errors.length; e++)
			{
				errorStr += "  - " +errors[e] + "\n";
			}
			alert("Неможливо побудувати графік функції через наступні помилки:\n" + errorStr);

			return;
		}

		let analitText = "";
		analitText += "<p><strong>f(x) = 1 + e^x</strong>, тому <strong>F(x) = x + e^x + C</strong><br>";
		analitText += "<p><strong>F(x)|("+mainX2.toString()+","+mainX1.toString()+") = "+ mainX2.toString() +" + e^"+mainX2.toString()+" - "+mainX1.toString()+" - e^"+mainX1.toString()+" = "+((mainX2 + Math.exp(mainX2)) - (mainX1 + Math.exp(mainX1))).toString()+"</strong><br>";
		analitText += "<p><strong>F(x) = "+((mainX2 + Math.exp(mainX2)) - (mainX1 + Math.exp(mainX1))).toString()+"</strong></p>";
		document.getElementById("analit-method-block").innerHTML = analitText;

		document.getElementById("section-result").innerHTML = "<p><strong> a = "+ mainX1 + "</strong></p><p><strong> b = "+ mainX2 + "</strong></p>";
		document.getElementById("cubes-step-info").innerHTML  = "<p><strong>"+ mainX1 +"</strong> <= x <= "+ mainX2 +"</strong><p>";
		document.getElementById("traps-step-info").innerHTML  = "<p><strong>"+ mainX1 +"</strong> <= x <= "+ mainX2 +"</strong><p>";
		document.getElementById("mk-step-info").innerHTML  = "<p><strong>"+ mainX1 +"</strong> <= x <= "+ mainX2 +"</strong><p>";
		document.getElementById("simp-step-info").innerHTML  = "<p><strong>"+ mainX1 +"</strong> <= x <= "+ mainX2 +"</strong><p>";

		mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(mainCtx, "red", mainX1, mainX2, mainY1, mainY2);
		buildPlot(mainCtx, mainCanvas.width- 25, mainCanvas.height - 25, mainX1, mainX2, mainY1, mainY2);
	});

	// Cubes Method
	function CubesMethod()
	{
		cubesCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(cubesCtx, "red", mainX1, mainX2, 0, fXfunc(mainX2));
		buildPlot(cubesCtx, cubesCanvas.width- 25, cubesCanvas.height - 25, mainX1, mainX2, 0, fXfunc(mainX2));

		let result = 0;

		let stepInput = document.getElementById("cubes-step").value ? parseFloat(document.getElementById("cubes-step").value) : 1;
		let step = Math.pow(2,stepInput);
		document.getElementById("cubes-step-value").innerHTML = "<p>N = " + step + "</p>";

		step = (mainX2 - mainX1) / step;
		let printX = 0;
		let x = mainX1;
		while(x < mainX2)
		{

			cubesCtx.fillStyle="rgba(0, 255, 0, 0.5)";		
			let zeroY = (cubesCanvas.height-25) - ((cubesCanvas.height-25) / (fXfunc(mainX2) - 0) * (-0));
			let curveY = (cubesCanvas.height-25) - ((cubesCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x)-0));

			if(fXfunc(x) < 0)
			{
				cubesCtx.fillRect((cubesCanvas.width-25) * step / (mainX2-mainX1) *  printX, 
								zeroY, 
								(cubesCanvas.width-25) * step / (mainX2-mainX1) - 1, 
								curveY-zeroY);
			}
			else
			{
				cubesCtx.fillRect((cubesCanvas.width-25) * step / (mainX2-mainX1) *  printX, 
								curveY, 
								(cubesCanvas.width-25) * step / (mainX2-mainX1) - 1, 
								zeroY-curveY);
			}
			result += step * fXfunc(x);
			x += step;
			printX += 1;
			document.getElementById("cubes-result").innerHTML = "<p><strong> F(x) = "+ result.toFixed(countZeros(result)) +"</strong></p>";
			resultArray[0][stepInput-1] = result.toFixed(countZeros(result));
		}

	}
	document.getElementById('cubes-step').oninput = function()
	{
		if(mainX1 != null && mainX2 != null)
		{
			CubesMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	}

	document.getElementById('find-cubes-F').addEventListener('click', function()
	{	
		if(mainX1 != null && mainX2 != null)
		{
			CubesMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	});

	//Trapezes Method
	function TrapsMethod()
	{
		trapsCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(trapsCtx, "red", mainX1, mainX2, 0, fXfunc(mainX2));
		buildPlot(trapsCtx, trapsCanvas.width- 25, trapsCanvas.height - 25, mainX1, mainX2, 0, fXfunc(mainX2));

		let result = 0;

		let stepInput = document.getElementById("traps-step").value ? parseFloat(document.getElementById("traps-step").value) : 1;
		let step = Math.pow(2,stepInput);
		document.getElementById("traps-step-value").innerHTML = "<p>N = " + step + "</p>";

		step = (mainX2 - mainX1) / step;
		let printX = 0;
		let x = mainX1;
		while(x < mainX2)
		{

			trapsCtx.fillStyle="rgba(0, 255, 0, 0.5)";		
			let zeroY = (trapsCanvas.height-25) - ((trapsCanvas.height-25) / (fXfunc(mainX2) - 0) * (-0));
			let curveY = (trapsCanvas.height-25) - ((trapsCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x)-0));
			let curveY1 = (trapsCanvas.height-25) - ((trapsCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x + step)-0));
			 

			if(fXfunc(x) < 0)
			{
				trapsCtx.beginPath();
				trapsCtx.moveTo((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX, zeroY);
				trapsCtx.lineTo((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX, curveY - zeroY);
				trapsCtx.lineTo(((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((trapsCanvas.width-25) * step / (mainX2-mainX1) - 1), curveY1 - zeroY);
				trapsCtx.lineTo(((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((trapsCanvas.width-25) * step / (mainX2-mainX1) - 1), zeroY);
				trapsCtx.closePath();
				trapsCtx.fill();
			}
			else
			{
				trapsCtx.beginPath();
				trapsCtx.moveTo((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX, zeroY);
				trapsCtx.lineTo((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX, curveY);
				trapsCtx.lineTo(((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((trapsCanvas.width-25) * step / (mainX2-mainX1) - 1), curveY1);
				trapsCtx.lineTo(((trapsCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((trapsCanvas.width-25) * step / (mainX2-mainX1) - 1), zeroY);
				trapsCtx.closePath();
				trapsCtx.fill();
			}
			result += ((step * fXfunc(x)) + ((step * (fXfunc(x + step) - fXfunc(x))) / 2));
			x += step;
			printX += 1;
			document.getElementById("traps-result").innerHTML = "<p><strong> F(x) = "+ result.toFixed(countZeros(result)) +"</strong></p>";
			resultArray[1][stepInput-1] = result.toFixed(countZeros(result));
		}
	}
	document.getElementById('traps-step').oninput = function()
	{
		if(mainX1 != null && mainX2 != null)
		{
			TrapsMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	}

	document.getElementById('find-traps-F').addEventListener('click', function()
	{	
		if(mainX1 != null && mainX2 != null)
		{
			TrapsMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	});

	//Monte Carlo Method
	function MKMethod()
	{
		mkCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(mkCtx, "red", mainX1, mainX2, 0, fXfunc(mainX2));
		buildPlot(mkCtx, mkCanvas.width- 25, mkCanvas.height - 25, mainX1, mainX2, 0, fXfunc(mainX2));

		let result = 0;

		let stepInput = document.getElementById("mk-step").value ? parseFloat(document.getElementById("mk-step").value) : 1;
		let step = Math.pow(2,stepInput);
		document.getElementById("mk-step-value").innerHTML = "<p>N = " + step + "</p>";

		let i = 0;
		let a = 0;
		while(i < step)
		{
			x = Math.floor(Math.random() * (mkCanvas.width-25));
			y = (mkCanvas.height-25) - Math.floor(Math.random() * (mkCanvas.height-25));

			let zeroY = (mkCanvas.height-25);
			let curveY = (mkCanvas.height-25) - ((mkCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x * (mainX2- mainX1) / (mkCanvas.width-25))-0));

			//console.log(x, x * (mainX2- mainX1) / mkCanvas.width, fXfunc(x * (mainX2- mainX1) / mkCanvas.width));


			if(y <= zeroY && y >= curveY)
			{
				mkCtx.fillStyle="rgba(0, 255, 0, 1)";	
				a++;
			}
			else
			{
				mkCtx.fillStyle="rgba(0, 0, 0, 1)";
			}
			mkCtx.fillRect(x,y,2,2);		
			i++;

			let w = mainX2 - mainX1;
			let h = fXfunc(mainX2);

			let result = (w * h) / step * a;
			document.getElementById("mk-result").innerHTML = "<p><strong> F(x) = "+ result.toFixed(countZeros(result)) +"</strong></p>";
			resultArray[2][stepInput-1] = result.toFixed(countZeros(result));
		}
	}
	document.getElementById('mk-step').oninput = function()
	{
		if(mainX1 != null && mainX2 != null)
		{
			MKMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	}

	document.getElementById('find-mk-F').addEventListener('click', function()
	{	
		if(mainX1 != null && mainX2 != null)
		{
			MKMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	});

	//Simpson Method
	function SimpsonMethod()
	{
		simpCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(simpCtx, "red", mainX1, mainX2, 0, fXfunc(mainX2));
		buildPlot(simpCtx, simpCanvas.width- 25, simpCanvas.height - 25, mainX1, mainX2, 0, fXfunc(mainX2));

		let result = 0;

		let stepInput = document.getElementById("simp-step").value ? parseFloat(document.getElementById("simp-step").value) : 1;
		let step = Math.pow(2,stepInput);
		document.getElementById("simp-step-value").innerHTML = "<p>N = " + step + "</p>";

		step = (mainX2 - mainX1) / step;
		let printX = 0;
		let x = mainX1;
		while(x < mainX2)
		{

			simpCtx.fillStyle="rgba(0, 255, 0, 0.5)";		
			let zeroY = (simpCanvas.height-25) - ((simpCanvas.height-25) / (fXfunc(mainX2) - 0) * (-0));
			let curveY = (simpCanvas.height-25) - ((simpCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x)-0));
			let curveY1 = (simpCanvas.height-25) - ((simpCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x + step)-0));
			let curveYC = (simpCanvas.height-25) - ((simpCanvas.height-25) / (fXfunc(mainX2) - 0) * (fXfunc(x + step / 2)-0));
			 

			if(fXfunc(x) < 0)
			{
				simpCtx.beginPath();
				simpCtx.moveTo((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX, zeroY);
				simpCtx.lineTo((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX, curveY - zeroY);
				simpCtx.lineTo(((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX) + (((simpCanvas.width-25) * step / (mainX2-mainX1) - 1) / 2), curveYC - zeroY);
				simpCtx.lineTo(((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((simpCanvas.width-25) * step / (mainX2-mainX1) - 1), curveY1 - zeroY);
				simpCtx.lineTo(((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((simpCanvas.width-25) * step / (mainX2-mainX1) - 1), zeroY);
				simpCtx.closePath();
				simpCtx.fill();
			}
			else
			{
				simpCtx.beginPath();
				simpCtx.moveTo((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX, zeroY);
				simpCtx.lineTo((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX, curveY);
				simpCtx.lineTo(((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX) + (((simpCanvas.width-25) * step / (mainX2-mainX1) - 1) / 2), curveYC);
				simpCtx.lineTo(((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((simpCanvas.width-25) * step / (mainX2-mainX1) - 1), curveY1);
				simpCtx.lineTo(((simpCanvas.width-25) * step / (mainX2-mainX1) *  printX) + ((simpCanvas.width-25) * step / (mainX2-mainX1) - 1), zeroY);
				simpCtx.closePath();
				simpCtx.fill();
			}
			let a  = x;
			let b = x + step;
			result += (b - a) / 6 * (fXfunc(a) + 4 * fXfunc((a + b) / 2) + fXfunc(b));
			x += step;
			printX += 1;
			document.getElementById("simp-result").innerHTML = "<p><strong> F(x) = "+ result.toFixed(countZeros(result)) +"</strong></p>";
			resultArray[3][stepInput-1] = result.toFixed(countZeros(result));
		}
	}
	document.getElementById('simp-step').oninput = function()
	{
		if(mainX1 != null && mainX2 != null)
		{
			SimpsonMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	}

	document.getElementById('find-simp-F').addEventListener('click', function()
	{	
		if(mainX1 != null && mainX2 != null)
		{
			SimpsonMethod();
		}
		else
		{
			alert("Не визначено межі інтегрування");
		}
	});

	// Tab manage
	document.getElementById('main-step').oninput = function()
	{
		let stepInput = document.getElementById("main-step").value ? parseFloat(document.getElementById("main-step").value) : 1;
		document.getElementById("main-step-value").innerHTML = "<p>Кількість ітерацій = " + Math.pow(2,stepInput) + "</p>";

		for(let i = 1; i <= 4; i++)
		{
			document.getElementById("res"+i.toString()).innerHTML = resultArray[i-1][stepInput-1];
		}

	}

	
	function buildPlot(ctx, w, h , min_l, max_l, min_Y, max_Y)
	{
		ctx.fillStyle="#000";
		ctx.fillRect(0, h - (h/ (max_Y-min_Y) * (-min_Y)), ctx.canvas.width-25, 1);
		let printX = 0;
		for(let lambda = min_l; lambda < max_l; by=lambda += (max_l-min_l) / w)
		{
			y = renderPass(lambda, ctx, h, printX, min_Y, max_Y);	
	    	
			printX += 1;
		}
	}

	function buildGrid(ctx, color, min_x, max_x, min_y, max_y)
	{
		ctx.fillStyle=color;
		ctx.fillRect(0, ctx.canvas.height-25, ctx.canvas.width, 1);
		ctx.fillRect(ctx.canvas.width-25, 0, 1, ctx.canvas.height);

		ctx.font = "14px Arial";
		ctx.fillText(min_x, 5, ctx.canvas.height-5);
		ctx.fillText(max_x, ctx.canvas.width - 37, ctx.canvas.height-5);
		ctx.fillText(min_y, ctx.canvas.width - 25, ctx.canvas.height - 27);
		ctx.fillText(max_y, ctx.canvas.width - 25, 15);

		ctx.fillText(0, ctx.canvas.width - 20, ctx.canvas.height - (ctx.canvas.height / (max_y-min_y) * (-min_y)) -10);
	}


	function renderPass(x, ctx, height, printX, y1, y2)
	{
		let y = 1 + Math.exp(x);
					
		let printY = height - (height / (y2 -y1) * (y-y1));
		ctx.fillRect(printX, printY, 1, 1);
		return y;
	}

	function fXfunc(x)
	{
		return 1 + Math.exp(x);
	}

	function dXfunc(x)
	{
		return Math.exp(x) - (1/x);
	}

	function countZeros(x)
	{
		let result = 0;
		if(x.toString().split('.')[1] != null)
		{
			nums = x.toString().split('.')[1].split('');
			for(let i = 0; i < nums.length; i++)
			{
				if(nums[i] == '0')
				{
					if(i != 0) 
					{
						if(nums[i-1] != '0')
						{
							return i;
						}
					}
				}
			}
		}

		return result;
	}
}
