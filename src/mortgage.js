/**
 * Calculate the monthly mortgage payment.
 * @param  {Number} loan_amount The initial amount of the loan in dollars.
 * @param  {Number} int_rate    The interest rate as a decimal (e.g. 0.03).
 * @param  {Number} term_years  The number of years over which the mortgage is
 *                              acive (e.g. 30)
 * @return {Number}             The monthly payment, which includes principal
 *                              and interst (P&I). 
 */
function monthly_mortgage(loan_amount, int_rate, term_years) {
  if (loan_amount < 0) {
    throw new Error('Must enter a loan amount greater than 0.0');
  }
  if (int_rate < 0) {
    throw new Error('Must enter an interest rate greater than 0.0');
  }
  if (term_years <= 0) {
    throw new Error('Must enter a mortgage term greater than 0.0');
  }
  let total_sum = 0.0, multiplier = 1.0;
  for (let i = 1; i <= term_years * 12; i++) {
    total_sum += multiplier;
    multiplier = Math.pow(1.0 + int_rate / 12.0, i);
  }
  return loan_amount * multiplier / total_sum;
}

/** Mortgatge. 
 *  Class for computing mortgages.
 */
class Mortgage {
  constructor(loan_amount, int_rate, term_years) {
    this._loan_amount = loan_amount;
    this._int_rate = int_rate;
    this._term_years = term_years;
    this.calculate();
  }

  get monthly_payment() {return this._monthly_mortgage};

  get loan_amount() {return this._loan_amount};

  set loan_amount(amount) {
    if (amount !== this._loan_amount) {
      this.calculate();
    }
  }

  get int_rate() {return this._int_rate;}

  set int_rate(rate) {
    if (rate !== this._int_rate) {
      this.calculate();
    }
  }

  get term_years() {return this._term_years;}

  set term_years(term) {
    if (term !== this._term_years) {
      this.calculate();
    }
  }

  calculate() {
    this._monthly_mortgage = monthly_mortgage(
      this._loan_amount, this._int_rate, this._term_years);
  }
}