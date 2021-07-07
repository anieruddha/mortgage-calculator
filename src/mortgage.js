/**
 * Calculate the monthly mortgage payment.
 * @param  {Number} loan_amount The initial amount of the loan in dollars.
 * @param  {Number} int_rate    The interest rate as a decimal (e.g. 0.03).
 * @param  {Number} term_years  The number of years over which the mortgage is
 *  acive (e.g. 30)
 * @return {Number} The monthly payment, which includes principal and interst. 
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

/** Mortgage. 
 *  Class for computing mortgages.
 */
class Mortgage {
  /**
   * @param {Number} loan_amount The amount of the loan ($).
   * @param {Number} int_rate The interest rate.
   * @param {Number} term_years The term of the loan in years.
   */
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
      this._loan_amount = amount;
      this.calculate();
    }
  }

  get int_rate() {return this._int_rate;}

  set int_rate(rate) {
    if (rate !== this._int_rate) {
      this._int_rate = rate;
      this.calculate();
    }
  }

  get term_years() {return this._term_years;}

  set term_years(term) {
    if (term !== this._term_years) {
      this._term_years = term;
      this.calculate();
    }
  }

  calculate() {
    this._monthly_mortgage = monthly_mortgage(
      this._loan_amount, this._int_rate, this._term_years);
  }
}

/** FinanceCalculator.
 * Class for computing all the finances.
 */
class FinanceCalculator {
  /**
   * @param {Number} price House price.
   * @param {Number} percent_down The percent down on the home.
   * @param {Number} int_rate The interest rate.
   * @param {Number} term_years The term of the loan in years.
   * @param {Number} income Yearly income before tax ($).
   * @param {Number} insurance Yearly insurance bill ($).
   * @param {Number} tax_rate The tax rate.
   */
  constructor(price = 1e6, percent_down = 0.20, int_rate = 0.032,
    term_years = 30, income = 1e5, insurance = 1e3, tax_rate = 0.01) {
    this._price = price;
    this._percent_down = percent_down;
    this._mortgage = new Mortgage(this.loan_amount, int_rate, term_years);
    this._income = income;
    this._insurance = insurance;
    this._tax_rate = tax_rate;
  }

  get price() {return this._price;}

  set price(value) {
    if (value !== this._price) {
      this._price = value;
      this._mortgage.loan_amount = this.loan_amount;
    }
  }

  get percent_down() {return this._percent_down;}

  set percent_down(value) {
    if (value !== this._percent_down) {
      this._percent_down = value;
      this._mortgage.loan_amount = this.loan_amount;
    }
  }

  get int_rate() {return this._mortgage.int_rate;}

  set int_rate(value) {
    if (value !== this.int_rate) {
      this._mortgage.int_rate = value;
    }
  }

  get term_years() {return this._mortgage.term_years;}

  set term_years(value) {
    if (value !== this.term_years) {
      this._mortgage.term_years = value;
    }
  }

  get income() {return this._income;}

  set income(value) {
    this._income = value;
  }

  get insurance() {return this._insurance;}

  set insurance(value) {
    this._insurance = value;
  }

  get tax_rate() {return this._tax_rate;}

  set tax_rate(value) {
    this._tax_rate = value;
  }

  get loan_amount() {
    return this.price * (1 - this.percent_down);
  }

  monthly_payment() {
    return this._mortgage.monthly_payment;
  }

  monthly_tax() {
    return this.price * this.tax_rate / 12;
  }

  monthly_insurance() {
    return this.insurance / 12;
  }

  piti() {
    return (this.monthly_payment() + this.monthly_tax() + 
            this.monthly_insurance());
  }

}
