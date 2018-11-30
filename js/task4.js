window.onload = function()
{

	var mainX1;
	var mainX2;
	var mainY1;
	var mainY2;

	var mainStep = 1;

	var inputArray = [];

	var n = 1;
	var r = 1;
	var l = 1;

	// Canvases
	var mainCanvas = document.getElementById("main-plot");
	var mainCtx = mainCanvas.getContext('2d');

	var lagrangCanvas = document.getElementById("lagrang-plot");
	var lagrangCtx = lagrangCanvas.getContext('2d');

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

		document.getElementById("section-result").innerHTML = "<p><strong> a = "+ mainX1 + "</strong></p><p><strong> b = "+ mainX2 + "</strong></p>";
		document.getElementById("lagrang-step-info").innerHTML  = "<p><strong>"+ mainX1 +"</strong> <= x <= "+ mainX2 +"</strong><p>";
	
		mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(mainCtx, "red", mainX1, mainX2, mainY1, mainY2);
		inputArray = [];
		fillInputArray(mainX1, mainX2, n, r);
		buildPlot(mainCtx,"#00f", 4, mainCanvas.width- 25, mainCanvas.height - 25, mainX1, mainX2, mainY1, mainY2, 11);
	});

	
	function buildPlot(ctx, color, size, w, h , min_l, max_l, min_Y, max_Y, n)
	{
		ctx.fillStyle = "#000";
		ctx.fillRect(0, h - (h/ (max_Y-min_Y) * (-min_Y)), ctx.canvas.width-25, 1);

		ctx.fillStyle = color;
		let printX = 0;
		for(let i = 0; i < inputArray.length; i++)
		{
			y = renderPass(inputArray[i][1], ctx, size, h, printX, min_Y, max_Y);	
	    	
			printX +=  w / inputArray.length;
		}
	}

	function lagrangPlot(ctx, color, size, w, h , min_l, max_l, min_Y, max_Y, n)
	{
		ctx.fillStyle = "#000";
		ctx.fillRect(0, h - (h/ (max_Y-min_Y) * (-min_Y)), ctx.canvas.width-25, 1);

		ctx.fillStyle = color;
		let printX = 0;
		for(let lambda = min_l; lambda < max_l; lambda += (max_l-min_l) / n)
		{
			y = renderPass(LagrangMethod(lambda, inputArray), ctx, size, h, printX, min_Y, max_Y);	
	    	
			printX +=  w / n;
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


	function renderPass(y, ctx, size, height, printX, y1, y2)
	{		
		let printY = height - (height / (y2 -y1) * (y-y1));
		ctx.fillRect(printX - size/2, printY - size/2, size, size);
		return y;
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

	function fX(x)
	{
		return 1 + Math.exp(x);
	}

	function fillInputArray(a = 0, b = 1, n = 1, r = 1)
	{
		let step = (b - a) / n;

		for(let i = 0; i < n; i++)
		{
			let x = a + step*i;
			inputArray.push([x, fX(x) + Math.random()*r]);
		}
	}

	function LagrangMethod(x, inp_array)
	{
		let result = 0;

		for(let i = 0; i < inp_array.length; i++)
		{
			result += inp_array[i][1] * lagrang(x, inp_array, i); 
		}

		return result;
	}


	document.getElementById('find-lagrang').addEventListener('click', function()
	{	
		if(inputArray.length > 0)
		{
			lagrangCtx.clearRect(0, 0, lagrangCanvas.width, lagrangCanvas.height);
			buildGrid(lagrangCtx, "red", mainX1, mainX2, 0, fX(mainX2));
			lagrangPlot(lagrangCtx, "#000", 2, mainCanvas.width- 25, mainCanvas.height - 25, mainX1, mainX2, mainY1, mainY2, l);
			buildPlot(lagrangCtx, "#00f", 4, mainCanvas.width- 25, mainCanvas.height - 25, mainX1, mainX2, mainY1, mainY2, n);
		}
		else
		{
			alert("Відсутні вхідні дані");
		}
		
	});

	function lagrang(x, inp_array, i)
	{
		let numerator = 1;
		let denominator = 1;

		for(let j = 0; j < inp_array.length; j++)
		{

			if(i == j)continue;
			numerator *= x - inp_array[j][0];
			denominator *= inp_array[i][0] - inp_array[j][0];
		}

		return numerator / denominator;
	}

	document.getElementById("point-count-range").oninput = function()
	{
		n = document.getElementById("point-count-range").value;
		document.getElementById("point-count-info").innerHTML = "<p>"+ n +"</p>";
	}

	document.getElementById("random-count-range").oninput = function()
	{
		r = document.getElementById("random-count-range").value;
		document.getElementById("random-count-info").innerHTML = "<p>"+ r +"</p>";
	}

	document.getElementById("lagrang-count-range").oninput = function()
	{
		l = document.getElementById("lagrang-count-range").value;
		document.getElementById("lagrang-count-info").innerHTML = "<p>"+ l +"</p>";
	}
}
