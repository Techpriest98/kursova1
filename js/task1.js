window.onload = function()
{
	//
	document.getElementById("check-box1").style.visibility = "hidden";
	document.getElementById("check-box2").style.visibility = "hidden";
	document.getElementById("check-box3").style.visibility = "hidden";
	document.getElementById("check-box4").style.visibility = "hidden";


	var mainX1;
	var mainX2;
	var mainY1;
	var mainY2;

	var secX1;
	var secX2;

	// Canvases
	var mainCanvas = document.getElementById("main-plot");
	var mainCtx = mainCanvas.getContext('2d');

	var iterCanvas = document.getElementById("iter-plot");
	var iterCtx = iterCanvas.getContext('2d');


	var dyhotCanvas = document.getElementById("dyhot-plot");
	var dyhotCtx = dyhotCanvas.getContext('2d');

	var newtonCanvas = document.getElementById("newton-plot");
	var newtonCtx = newtonCanvas.getContext('2d');

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

		mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(mainCtx, "red", mainX1, mainX2, mainY1, mainY2);
		buildPlot(mainCtx, mainCanvas.width- 25, mainCanvas.height - 25, mainX1, mainX2, mainY1, mainY2);
	});

	document.getElementById('find-newton-root').addEventListener('click', function()
	{	
		newtonCtx.clearRect(0, 0, newtonCanvas.width, newtonCanvas.height);
		buildGrid(newtonCtx, "red", secX1, secX2, fXfunc(secX1), fXfunc(secX2));
		buildPlot(newtonCtx, newtonCanvas.width- 25, newtonCanvas.height - 25, secX1, secX2, fXfunc(secX1), fXfunc(secX2));

		let step = document.getElementById("newton-step").value ?  parseFloat(document.getElementById("newton-step").value) : 0.1;

		x0 = secX2;

		while(Math.abs(fXfunc(x0)) > step)
		{
			buff= x0;
			x0 = x0 + (-(fXfunc(x0)) / (dXfunc(x0)));

			let zeroY = (newtonCanvas.height-25) - ((newtonCanvas.height-25) / (fXfunc(secX2) - fXfunc(secX1)) * (-fXfunc(secX1)));
			let curveY = (newtonCanvas.height-25) - ((newtonCanvas.height-25) / (fXfunc(secX2) - fXfunc(secX1)) * (fXfunc(buff)-fXfunc(secX1)));

			newtonCtx.setLineDash([5,3]);
			newtonCtx.beginPath();
			newtonCtx.moveTo((newtonCanvas.width-25) * (buff-secX1) / (secX2-secX1), curveY);
			newtonCtx.lineTo((newtonCanvas.width-25) * (x0-secX1) / (secX2-secX1), zeroY);
			newtonCtx.strokeStyle = "999";
			newtonCtx.stroke();
			

		}
		document.getElementById("check-box4").style.visibility = "visible";
		document.getElementById("newton-result").innerHTML = "<p>Корінь знайдено:</p><p><strong>"+ (x0).toFixed(countZeros(x0)) +"</strong></p>";

	});

	document.getElementById('find-iter-root').addEventListener('click', function()
	{	
		iterCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(iterCtx, "red", secX1, secX2, fXfunc(secX1), fXfunc(secX2));
		buildPlot(iterCtx, iterCanvas.width- 25, iterCanvas.height - 25, secX1, secX2, fXfunc(secX1), fXfunc(secX2));

		let step = document.getElementById("iter-step").value ?  parseFloat(document.getElementById("iter-step").value) : 0.1;
		let printX = 0;
		let x = secX1;
		while(x < secX2)
		{
			if(fXfunc(x)*fXfunc(x + step) < 0)
			{
				iterCtx.fillStyle="rgba(0, 255, 0, 0.2)";
				document.getElementById("iter-result").innerHTML = "<p>Корінь знайдено:</p><p><strong>"+ (x + step/2).toFixed(countZeros(x + step/2)) +"</strong></p>";
				document.getElementById("check-box2").style.visibility = "visible";
			}
			else
			{
				iterCtx.fillStyle="rgba(255, 0, 0, 0.2)";
			}
			
			let zeroY = (iterCanvas.height-25) - ((iterCanvas.height-25) / (fXfunc(secX2) - fXfunc(secX1)) * (-fXfunc(secX1)));
			let curveY = (iterCanvas.height-25) - ((iterCanvas.height-25) / (fXfunc(secX2) - fXfunc(secX1)) * (fXfunc(x)-fXfunc(secX1)));

			if(fXfunc(x) < 0)
			{
				iterCtx.fillRect((iterCanvas.width-25) * step / (secX2-secX1) *  printX, 
								zeroY, 
								(iterCanvas.width-25) * step / (secX2-secX1) - 1, 
								curveY-zeroY);
			}
			else
			{
				iterCtx.fillRect((iterCanvas.width-25) * step / (secX2-secX1) *  printX, 
								curveY, 
								(iterCanvas.width-25) * step / (secX2-secX1) - 1, 
								zeroY-curveY);
			}
			x += step;
			printX += 1;

		}
	});

	function findDyhotRoot()
	{
		let step =  document.getElementById("dyhot-step").value;
		console.log(step);
		document.getElementById("dyhot-step-value").innerHTML = "<p>" + step + "</p>";

		let x1 = secX1;
		let x2 = secX2;
		let sectionLength = x2 - x1;
		let i  = 1;

		while(i <= step)
		{
			dyhotCtx.clearRect(0, 0, dyhotCanvas.width, dyhotCanvas.height);
			buildGrid(dyhotCtx, "red", secX1, secX2, fXfunc(secX1), fXfunc(secX2));
			buildPlot(dyhotCtx, dyhotCanvas.width- 25, dyhotCanvas.height - 25, secX1, secX2, fXfunc(secX1), fXfunc(secX2));

		 	let center = (x2 + x1) / 2;

		 	if(fXfunc(center) * fXfunc(x2) > 0)
		 	{
		 		dyhotCtx.fillStyle="rgba(0, 255, 0, 0.3)";
		 		dyhotCtx.fillRect((dyhotCanvas.width-25) * (x1 - secX1) / (secX2-secX1), 
								0, 
								(dyhotCanvas.width-25) * ((x2-x1)/2) / (secX2-secX1), 
								(dyhotCanvas.height-25));

		 		dyhotCtx.fillStyle="rgba(255, 0, 0, 0.2)";
		 		dyhotCtx.fillRect((dyhotCanvas.width-25) * (center - secX1) / (secX2-secX1), 
								0, 
								(dyhotCanvas.width-25) * ((x2-x1)/2) / (secX2-secX1), 
								(dyhotCanvas.height-25));

		 		x2 = center;
		 	}
		 	else
		 	{
		 		dyhotCtx.fillStyle="rgba(255, 0, 0, 0.3)";
		 		dyhotCtx.fillRect((dyhotCanvas.width-25) * (x1 - secX1) / (secX2-secX1), 
								0, 
								(dyhotCanvas.width-25) * ((x2-x1)/2) / (secX2-secX1), 
								(dyhotCanvas.height-25));

		 			dyhotCtx.fillStyle="rgba(0, 255, 0, 0.2)";
		 			dyhotCtx.fillRect((dyhotCanvas.width-25) * (center - secX1) / (secX2-secX1), 
								0, 
								(dyhotCanvas.width-25) * ((x2-x1)/2) / (secX2-secX1), 
								(dyhotCanvas.height-25));

					x1 = center;
				
			}

			sectionLength = sectionLength/2;
			i++;

			let result = (x1 + x2) / 2;
			document.getElementById("check-box3").style.visibility = "visible";
			document.getElementById("dyhot-result").innerHTML = "<p>Корінь знайдено:</p><p><strong>"+ result +"</strong></p>";
		}
	}

	document.getElementById('find-dyhot-root').addEventListener('click', function()
	{
		findDyhotRoot();
	});

	document.getElementById("dyhot-step").oninput = function()
	{
		findDyhotRoot();
	}

	document.getElementById('findSection').addEventListener('click', function()
	{
		mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		buildGrid(mainCtx, "red", mainX1, mainX2, mainY1, mainY2);
		buildPlot(mainCtx, mainCanvas.width- 25, mainCanvas.height - 25, mainX1, mainX2, mainY1, mainY2);

		let step = document.getElementById("mainDelta").value ?  parseFloat(document.getElementById("mainDelta").value) : 4;
		let x = mainX1 + 0.000001;
		while(x < mainX2)
		{
			let newX = x +  (mainX2-mainX1) / step;
			if(fXfunc(x)*fXfunc(newX) < 0)
			{
				mainCtx.fillStyle="rgba(0, 255, 0, 0.2)";
				secX1 = x;
				secX2 = newX;
				
				document.getElementById("section-result").innerHTML = "<p>Корінь знайдено на відрізку</p><p>x1 = <strong>"+ secX1.toFixed(countZeros(secX1)) + "</strong></p><p>x2 = <strong>"+ secX2.toFixed(countZeros(secX2)) + "</strong></p>";
				document.getElementById("check-box1").style.visibility = "visible";

				document.getElementById("iter-step-info").innerHTML  = "<p><strong>"+ secX1.toFixed(countZeros(secX1)) +"</strong> <= x <= "+ secX2.toFixed(countZeros(secX2)) +"</strong><p>";
				document.getElementById("dyhot-step-info").innerHTML  = "<p><strong>"+ secX1.toFixed(countZeros(secX1)) +"</strong> <= x <= "+ secX2.toFixed(countZeros(secX2)) +"</strong><p>";
				document.getElementById("newton-step-info").innerHTML  = "<p><strong>"+ secX1.toFixed(countZeros(secX1)) +"</strong> <= x <= "+ secX2.toFixed(countZeros(secX2)) +"</strong><p>";

				mainCtx.fillStyle="#f00";
				mainCtx.fillRect((mainCanvas.width-25) / (mainX2-mainX1) *  (x- mainX1), 0, 1, mainCanvas.height);
				mainCtx.fillRect((mainCanvas.width-25) / (mainX2-mainX1) *  (x-mainX1) + (mainCanvas.width-25) / step - 1, 0 , 1, mainCanvas.height);
				mainCtx.font = "14px Arial";
				mainCtx.fillText("x1", (mainCanvas.width-25) / (mainX2-mainX1) *  (x-mainX1) - 15, mainCanvas.height-5);
				mainCtx.fillText("x2", (mainCanvas.width-25) / (mainX2-mainX1) *  (x-mainX1) + (mainCanvas.width-25) / step + 5, mainCanvas.height-5);
				mainCtx.fillStyle="rgba(0, 255, 0, 0.2)";
			}
			else
			{
				mainCtx.fillStyle="rgba(255, 0, 0, 0.2)";
			}
			mainCtx.fillRect( (mainCanvas.width-25) / (mainX2-mainX1) *  (x- mainX1), 0, (mainCanvas.width-25) / step - 1, mainCanvas.height-25);
			x += (mainX2-mainX1) / step;
		}
	});

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
		let y = Math.exp(x) - Math.log(x) - 20;
					
		let printY = height - (height / (y2 -y1) * (y-y1));
		ctx.fillRect(printX, printY, 1, 1);
		return y;
	}

	function fXfunc(x)
	{
		return Math.exp(x) - Math.log(x) - 20;
	}

	function dXfunc(x)
	{
		return Math.exp(x) - (1/x);
	}

	function countZeros(x)
	{
		let result = 0;
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

		return result;
	}
}
