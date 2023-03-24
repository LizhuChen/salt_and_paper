/* html5 way to get element */
let imgElement = document.getElementById("imageSrc");
/* css way to get element */
let inputElement = document.querySelector("#fileInput");
let Boxfilter = document.querySelector("#filter1"); //Boxfilter
let Unsharp = document.querySelector("#filter2"); //Unsharp masking
let Bilateral = document.querySelector("#filter3"); //Bilateral filtering
let Salt_pepper = document.querySelector("#filter4"); //Creat salt-and-pepper noises

inputElement.addEventListener("change", (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);

function onOpenCvReady() {
  /* get the status element and change its text */
  document.getElementById('status').innerHTML = "OpenCV.js is ready.";
}

/* this line should be placed under the declaration of btnElement for consistency */
let mat = undefined;
let temp_mat = undefined ;

imgElement.addEventListener("load", function(e) {
  mat = cv.imread(imgElement);
  temp_mat = cv.imread(imgElement);
  Boxfilter.disabled = false;
  Unsharp.disabled = false;
  Bilateral.disabled = false;
  Salt_pepper.disabled = false;

});

Boxfilter.addEventListener("click", (e) => {
  let dst = new cv.Mat();
  let src = new cv.Mat();
  let kernelSize = 5;
  let arr = new Array(kernelSize**2).fill(1);
  for(var i=0;i<arr.length;i++) {
    arr[i] /= arr.length;
  }
  
  let kernel = cv.matFromArray(kernelSize, kernelSize, cv.CV_32FC1, arr);
  cv.cvtColor(mat, src, cv.COLOR_RGBA2RGB);
  cv.filter2D (src, dst, cv.CV_8U, kernel, anchor = new cv.Point(-1, -1), delta = 0, borderType = cv.BORDER_DEFAULT)
  cv.imshow("outputCanvas", dst);

  dst.delete();
  src.delete();
  kernel.delete();
});


Unsharp.addEventListener("click", (e) => {
  let dst = new cv.Mat();
  let src = new cv.Mat();
  let kernelSize = 5;
  
  let arr = new Array(kernelSize**2).fill(1);
  for(var i=0;i<arr.length;i++) {
    arr[i] /= arr.length;
  }
  
  let arr1 = new Array(kernelSize**2).fill(0);
  let center = Math.round(kernelSize/2);
  arr1[center]= 2 ;
  
  for(var i=0;i<arr.length;i++) {
    arr[i] = arr1[i] - arr[i];
  }
  
  let kernel = cv.matFromArray(kernelSize, kernelSize, cv.CV_32FC1, arr);
  cv.cvtColor(mat, src, cv.COLOR_RGBA2RGB);
  cv.filter2D (src, dst, cv.CV_8U, kernel, anchor = new cv.Point(-1, -1), delta = 0, borderType = cv.BORDER_DEFAULT)
  cv.imshow("outputCanvas", dst);

  dst.delete();
  src.delete();
  kernel.delete();
});

Bilateral.addEventListener("click", (e) => {
  let dst = new cv.Mat();
  let src = new cv.Mat();
  let kernelSize = 5;
  let arr = new Array(kernelSize**2).fill(1);
  for(var i=0;i<arr.length;i++) {
    arr[i] /= arr.length;
  }
  
  let kernel = cv.matFromArray(kernelSize, kernelSize, cv.CV_32FC1, arr);
  cv.cvtColor(mat, src, cv.COLOR_RGBA2RGB);
  cv.bilateralFilter(src, dst,kernelSize,150,150,borderType = cv.BORDER_DEFAULT);
  cv.imshow("outputCanvas", dst);
  
  dst.delete();
  src.delete();
  kernel.delete();
});

Salt_pepper.addEventListener("click", (e) => {
  var img = new Image();
  img.src = imgElement.src;

  for(i = 0 ; i < 500 ; i++ ){
	var row = Math.floor(Math.random()*img.width);
	var col = Math.floor(Math.random()*img.height);

	temp_mat.ucharPtr(row, col)[0] = 255 ;
	temp_mat.ucharPtr(row, col)[1] = 0 ;
	temp_mat.ucharPtr(row, col)[2] = 0 ;
  }
	
  let dst = new cv.Mat();
  let src = new cv.Mat();
  let kernelSize = 3;
  cv.imshow("outputCanvas", temp_mat);

  cv.cvtColor(temp_mat, src, cv.COLOR_RGBA2RGB);
  cv.medianBlur(src, dst,kernelSize);
  cv.imshow("outputCanvas1", dst);
  dst.delete();
  src.delete();

});


let rgbChannels = new cv.MatVector();
cv.split(mat, rgbChannels);

let rCh = rgbChannels.get(0);
let gCh = rgbChannels.get(1);
let bCh = rgbChannels.get(2);
let rFlt = new cv.Mat();
let gFlt = new cv.Mat();
let bFlt = new cv.Mat();
cv.filter2D (rCh, rFlt, cv.CV_8U, kernel, anchor = new cv.Point(-1, -1), delta = 0, borderType = cv.BORDER_DEFAULT)
cv.filter2D (gCh, gFlt, cv.CV_8U, kernel, anchor = new cv.Point(-1, -1), delta = 0, borderType = cv.BORDER_DEFAULT)
cv.filter2D (bCh, bFlt, cv.CV_8U, kernel, anchor = new cv.Point(-1, -1), delta = 0, borderType = cv.BORDER_DEFAULT)
let resultVec = new cv.MatVector();
resultVec.push_back(rFlt);
resultVec.push_back(gFlt);
resultVec.push_back(bFlt);
cv.merge(resultVec, dst);

cv.imshow("outputCanvas", dst);
rgbChannels.delete();
rCh.delete();gCh.delete();bCh.delete();
rFlt.delete();gFlt.delete();bFlt.delete();
resultVec.delete();
dst.delete();
kernel.delete();
