const isNumeric = (num) => {
	return !isNaN(parseFloat(num) && isFinite(num));
}

export default isNumeric;