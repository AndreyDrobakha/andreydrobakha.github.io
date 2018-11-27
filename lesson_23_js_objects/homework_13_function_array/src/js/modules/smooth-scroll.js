const smoothScrolling = (queries) => {

	let sections = document.getElementsByTagName(queries);

	if(!sections) return;

	sections.forEach = [].forEach;

	const sectionsCollection = []

	sections.forEach((el) => {
		sectionsCollection.push(el.offsetTop);
	})

	let current = 0;
	const elem = document.body;

	if (elem.addEventListener) {
		if ('onwheel' in document) {
			elem.addEventListener("wheel", onWheel);
		} else if ('onmousewheel' in document) {
			elem.addEventListener("mousewheel", onWheel);
		} else {
			elem.addEventListener("MozMousePixelScroll", onWheel);
		}
	} else {
		elem.attachEvent("onmousewheel", onWheel);
	}

	function onWheel(e) {
		e = e || window.event;

		var delta = e.deltaY || e.detail || e.wheelDelta;

		e.preventDefault ? e.preventDefault() : (e.returnValue = false);

		current = current < 0 ? 0 : current;

		if(delta >= 0) {
			current = current >= sectionsCollection.length - 1 ? current : current + 1;
		} else {
			current -= 1;
		}
		window.scrollTo({
			top: sectionsCollection[current],
			behavior: 'smooth'
		})
	}
}

export default smoothScrolling;