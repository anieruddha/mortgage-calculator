/**
 * @fileoverview Simple mortgage calculator with budgetary rules of thumb.
 */

/**
 * Calculate the monthly mortgage payment.
 * @param  {Number} loan_amount The initial amount of the loan in dollars.
 * @param  {Number} int_rate    The interest rate as a decimal (e.g. 0.03).
 * @param  {Number} term_years  The number of years over which the mortgage is
 *     acive (e.g. 30)
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
  let total_sum = 0.0;
  let multiplier = 1.0;
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
   * @param {Number=} price House price.
   * @param {Number=} percent_down The percent down on the home.
   * @param {Number=} int_rate The interest rate.
   * @param {Number=} term_years The term of the loan in years.
   * @param {Number=} income Yearly income before tax ($).
   * @param {Number=} insurance Yearly insurance bill ($).
   * @param {Number=} tax_rate The tax rate.
   */
  constructor(price = 1e6, percent_down = 0.20, int_rate = 0.032,
      term_years = 30, income = 1e5, insurance = 1e3, tax_rate = 0.01,
      extra_monthly_expense = 0) {
    this._price = price;
    this._percent_down = percent_down;
    this._mortgage = new Mortgage(this.loan_amount, int_rate, term_years);
    this._income = income;
    this._insurance = insurance;
    this._tax_rate = tax_rate;
    this._monthly_extra = extra_monthly_expense;
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

  get monthly_extra() {return this._monthly_extra;}

  set monthly_extra(value) {
    this._monthly_extra = value;
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

  monthly_total() {
    return (this.monthly_payment() + this.monthly_tax() + 
            this.monthly_insurance() + this.monthly_extra);
  }

}

/**
 * Reads from the HTML table, calculates outputs, and writes back to the table.
 */
function update() {
  // Read.
  calculator.price = removeCommas(document.getElementById('price').value);
  calculator.percent_down = Number(
    document.getElementById('percent_down').value) / 100;
  calculator.int_rate = Number(document.getElementById('int_rate').value) / 100;
  calculator.term_years = Number(document.getElementById('term_years').value);
  calculator.income = removeCommas(document.getElementById('income').value);
  calculator.insurance = removeCommas(document.getElementById('insurance').value);
  calculator.tax_rate = Number(document.getElementById('tax_rate').value) / 100;
  calculator.monthly_extra = removeCommas(
      document.getElementById('extra').value);

  // Update.
  document.getElementById('price').value = numberWithCommas(calculator.price);
  document.getElementById('income').value = numberWithCommas(calculator.income);
  document.getElementById('insurance').value = numberWithCommas(
      calculator.insurance);
  document.getElementById('extra').value = numberWithCommas(
      calculator.monthly_extra);
  document.getElementById('deposit').innerHTML = numberWithCommas(
      '$' + calculator.price * calculator.percent_down);
  document.getElementById('total').innerHTML = numberWithCommas(
      '$' + calculator.monthly_total().toFixed(2));
  const exp_over_inc = 100 * calculator.monthly_total() / (
      calculator.income / 12.0);
  const exp_over_income_cell = document.getElementById('expense_over_income');
  exp_over_income_cell.innerHTML = exp_over_inc.toFixed(1) + '%';
  if (exp_over_inc <= 28) {
    exp_over_income_cell.style.color = 'rgb(0, 100, 0)';
  } else {
    exp_over_income_cell.style.color = 'rgb(210, 4, 45)';
  }
}

/**
 * Inserts commas for long numbers (e.g. 3123 => 3,123).
 * @param {Number} x A numeric value.
 * @return {string} The numbers, potentially with commas inserted.
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
}

/**
 * Removes commas from long numbers (e.g. 3,123 > 3123).
 * @param {string} x A string representing a number.
 * @return {Number} The number that the input string represents.
 */
function removeCommas(x) {
  return Number(x.replace(/\,/g,''));
}

/**
 * Removes commas from long numbers (e.g. 3,123 > 3123).
 */
function setupEventListeners() {
  document.getElementById('price').addEventListener('keydown', checkKeydown);
  document.getElementById('percent_down').addEventListener('keydown',
      checkKeydown);
  document.getElementById('int_rate').addEventListener('keydown',
      checkKeydown);
  document.getElementById('term_years').addEventListener('keydown',
      checkKeydown);
  document.getElementById('income').addEventListener('keydown', checkKeydown);
  document.getElementById('insurance').addEventListener('keydown',
      checkKeydown);
  document.getElementById('tax_rate').addEventListener('keydown',
      checkKeydown);
  document.getElementById('extra').addEventListener('keydown',
      checkKeydown);
}

function checkKeydown(e) {
  if (e.code === 'Enter') {
    update();
  }
}

calculator = new FinanceCalculator();
setupEventListeners();
update();