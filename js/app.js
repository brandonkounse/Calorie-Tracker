class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._calorieBalance = 0;
    this._caloriesConsumed = 0;
    this._caloriesBurned = 0;
    this._caloriesRemaining = this._calorieLimit;
    this._meals = [];
    this._workouts = [];
    this._totalProtein = 0;
    this._totalFat = 0;
    this._totalCarbohydrate = 0;

    this._render();
  }

  addMeal(meal) {
    if (meal instanceof Meal) {
      this._meals.push(meal);
      this._caloriesConsumed += meal.calories;
      this._totalProtein += meal.protein ?? 0;
      this._totalFat += meal.fat ?? 0;
      this._totalCarbohydrate += meal.carbohydrate ?? 0;
    } else {
      console.log('invalid meal');
    }
    this._calculateCaloriesConsumedAndBurned();
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._caloriesBurned += workout.calories;
    this._calculateCaloriesConsumedAndBurned();
    this._render();
  }

  // Private Methods
  _displayCalorieLimit() {
    const calLimitElement = document.querySelector('#calories-limit');
    calLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCalorieBalance() {
    const calTotalElement = document.querySelector('#calorie-balance');
    calTotalElement.innerHTML = this._calorieBalance;
  }

  _displayCaloriesConsumed() {
    const calConsumedElement = document.querySelector('#calories-consumed');
    calConsumedElement.innerHTML = this._caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const calBurnedElement = document.querySelector('#calories-burned');
    calBurnedElement.innerHTML = this._caloriesBurned;
  }

  _displayCaloriesRemaining() {
    const calRemainingElement = document.querySelector('#calories-remaining');
    const progressElement = document.querySelector('#calorie-progress');

    calRemainingElement.innerHTML = this._caloriesRemaining;

    if (this._caloriesRemaining <= 0) {
      calRemainingElement.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      calRemainingElement.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressElement.classList.remove('bg-success');
      progressElement.classList.add('bg-danger');
    } else {
      calRemainingElement.parentElement.parentElement.classList.add('bg-light');
      calRemainingElement.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      progressElement.classList.add('bg-success');
      progressElement.classList.remove('bg-danger');
    }
  }

  _calculateCaloriesConsumedAndBurned() {
    this._calorieBalance = this._caloriesConsumed - this._caloriesBurned;
    this._caloriesRemaining =
      this._calorieLimit - (this._caloriesConsumed - this._caloriesBurned);
  }

  _displayCalorieProgress() {
    const progressElement = document.querySelector('#calorie-progress');
    const percentage = (this._calorieBalance / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressElement.style.width = `${width}%`;
  }

  _render() {
    this._displayCalorieBalance();
    this._displayCalorieLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories, macros = {}) {
    this.id = Math.random().toString(16).split('.')[1];
    this.name = name;
    this.calories = calories;
    this.protein = macros['protein'];
    this.fat = macros['fat'];
    this.carbohydrate = macros['carbohydrate'];
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).split('.')[1];
    this.name = name;
    this.calories = calories;
  }
}

const tracker = new CalorieTracker();
