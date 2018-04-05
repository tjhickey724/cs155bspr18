/* The goal of this file is to unit test the RayTracing program.
We are adding .equals methods to all the classes for use in testing...
*/

function round(number, precision) {
  var shift = function (number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
}


function closeEnough(a,b){
	// first we get rid of some of the lower order bits
	let a1 = (a+1000)-1000
	let b1 = (b+1000)-1000
	// then test for equality
	return a1==b1
}

function testRectangle(){
	const s1 = new Square()
	const s2 = new Square()
	const s3 = new Square()
	s2.rotateX(Math.PI/2)
	s3.rotateX(Math.PI/2).translate(new Vector3(0,-1,0))
	

}
