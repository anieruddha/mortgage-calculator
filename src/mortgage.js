/**
 * Calculate the monthly mortgage payment.
 * @param  {Number} loan_amount The initial amount of the loan in dollars.
 * @param  {Number} int_rate    The interest rate as a decimal (e.g. 0.03).
 * @param  {Number} term_years  The number of years over which the mortgage is
 *                              acive (e.g. 30)
 * @return {Number}             The monthly payment, which includes principal
 *                              and interst (P&I). 
 */
function monthly_morgage(loan_amount, int_rate, term_years) {
  let total_sum = 0.0, multiplier = 1.0;
  for (let i = 1; i <= term_years * 12; i++) {
    total_sum += multiplier;
    multiplier = Math.pow(1.0 + int_rate / 12.0, i);
  }
  return loan_amount * multiplier / total_sum;
}

let res = monthly_morgage(1350000, 0.032, 30);
console.log(res);